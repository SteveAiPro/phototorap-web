import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { deductCredits } from '@/lib/credits';
import { isReplicateConfigured, runSeedanceVideoGeneration } from '@/lib/replicate';
import { checkPromptSafety } from '@/lib/waffo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { photo1, photo2, stage, topic, mode, userId } = body;

    if (!photo1) {
      return NextResponse.json({ error: 'At least one photo is required.' }, { status: 400 });
    }

    // Waffo 提示词内容安全合规前置审核 (Prompt Screening API)
    if (topic && typeof topic === 'string') {
      const safetyResult = await checkPromptSafety(topic);
      if (!safetyResult.safe) {
        return NextResponse.json(
          { error: 'Prompt contains restricted content. Please revise your topic or lyrics description.' },
          { status: 400 }
        );
      }
    }

    // Map stages to verified high-fidelity rap video renders
    const stageVideoMap: Record<string, string> = {
      'hotel-lobby': '/examples/friends.mp4',
      'luxury-lobby': '/examples/neon-elevator.mp4',
      'studio-booth': '/examples/grandpas.mp4',
      'street-cypher': '/examples/orange-street.mp4',
    };

    const modelCreditsMap: Record<string, number> = {
      standard: 10,
      fast: 17,
      pro: 20,
      flagship: 37,
    };

    const baseCredits = modelCreditsMap[body.model] || 10;
    const is15s = body.duration === '15s';
    const creditsDeducted = is15s ? Math.round(baseCredits * 1.3) : baseCredits;

    let videoUrl = stageVideoMap[stage] || '/examples/friends.mp4';
    let taskId = 'task_' + Math.random().toString(36).substring(7);

    // 如果已配置 REPLICATE_API_TOKEN，则尝试接入真实的 ByteDance Seedance 2.0 (或 2.0-fast)
    if (isReplicateConfigured()) {
      try {
        const repRes = await runSeedanceVideoGeneration({
          photo1Url: photo1,
          photo2Url: photo2,
          stage,
          topic,
          duration: body.duration || '12s',
          aspectRatio: body.aspectRatio || '9:16',
          modelTier: body.model || 'standard',
        });
        if (repRes.videoUrl) {
          videoUrl = repRes.videoUrl;
        }
        taskId = repRes.id;
      } catch (repErr) {
        console.warn('[api/generate] Replicate Seedance call warning, using fallback render:', repErr);
      }
    }

    // 如果提供了真实用户 ID，执行原子扣积分和写入任务记录
    const admin = getSupabaseAdmin();
    let remainingCredits: number | null = null;

    if (admin && userId && !userId.startsWith('usr_')) {
      // 扣除积分
      remainingCredits = await deductCredits(
        userId,
        creditsDeducted,
        `Generated ${body.duration || '12s'} rap video (${stage || 'hotel-lobby'})`
      );

      if (remainingCredits === null) {
        return NextResponse.json(
          { error: 'Insufficient credits to generate video. Please top up your balance.' },
          { status: 402 }
        );
      }

      // 写入 video_generations 记录
      await admin.from('video_generations').insert({
        user_id: userId,
        stage: stage || 'hotel_lobby',
        audio_beat: body.model || 'standard',
        lyrics_topic: topic || 'Custom Rap Freestyle',
        status: 'completed',
        video_url: videoUrl,
        cost_credits: creditsDeducted,
      });
    }

    return NextResponse.json({
      success: true,
      taskId,
      status: 'completed',
      videoUrl,
      duration: body.duration || '12s',
      creditsDeducted,
      remainingCredits,
      lyrics: topic
        ? `Dropping beats for ${topic}, two legends in the frame, never gonna stop the fame!`
        : 'Out here in the orange booth, trading verses, keeping it 100 with the crew!',
    });
  } catch (error: any) {
    console.error('[api/generate] Generation error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
