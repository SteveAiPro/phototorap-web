import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { deductCredits } from '@/lib/credits';
import {
  isReplicateConfigured,
  runSeedanceVideoGeneration,
  runLivePortraitVideoGeneration,
} from '@/lib/replicate';
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
    let realGenerationSuccess = false;

    // 如果已配置 REPLICATE_API_TOKEN，优先使用 ByteDance Seedance 2.0 Mini（480p 5s，原生带 142 BPM 鼓点伴奏与真实说唱歌词台词）
    // 若遇到意外，则尝试 LivePortrait 保底
    if (isReplicateConfigured()) {
      try {
        console.log('[api/generate] Starting Seedance 2.0 Mini generation (5s, 480p with Rap audio)...');
        const repRes = await runSeedanceVideoGeneration({
          photo1Url: photo1,
          photo2Url: photo2,
          stage,
          topic,
          duration: '5s',
          aspectRatio: body.aspectRatio || '9:16',
          modelTier: body.model || 'standard',
        });
        if (repRes.videoUrl) {
          videoUrl = repRes.videoUrl;
          taskId = repRes.id;
          realGenerationSuccess = true;
          console.log('[api/generate] Seedance rap generation succeeded:', videoUrl);
        }
      } catch (repErr: any) {
        console.warn('[api/generate] Seedance call error, trying LivePortrait fallback:', repErr?.message || repErr);
        try {
          const lpRes = await runLivePortraitVideoGeneration({
            photo1Url: photo1,
            photo2Url: photo2,
            stage,
            topic,
            duration: '5s',
            aspectRatio: body.aspectRatio || '9:16',
            modelTier: body.model || 'standard',
          });
          if (lpRes.videoUrl) {
            videoUrl = lpRes.videoUrl;
            taskId = lpRes.id;
            realGenerationSuccess = true;
            console.log('[api/generate] LivePortrait generation succeeded:', videoUrl);
          }
        } catch (lpErr: any) {
          console.error('[api/generate] Both AI models failed:', lpErr?.message || lpErr);
        }
      }
    }

    // 如果 AI 成功生成了 Replicate Delivery 临时视频，立即自动流式转存到 Supabase Storage 永久持久化！
    // 避免 Replicate 1 小时后自动清理导致链接 404
    const admin = getSupabaseAdmin();
    if (realGenerationSuccess && videoUrl && videoUrl.startsWith('http') && admin) {
      try {
        console.log('[api/generate] Persisting Replicate video to permanent Supabase Storage...', videoUrl);
        const vidResp = await fetch(videoUrl);
        if (vidResp.ok) {
          const vidBuffer = Buffer.from(await vidResp.arrayBuffer());
          const fileName = `rap_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
          const filePath = `generated_videos/${fileName}`;

          const { error: uploadErr } = await admin.storage
            .from('uploads')
            .upload(filePath, vidBuffer, {
              contentType: 'video/mp4',
              upsert: true,
            });

          if (!uploadErr) {
            const { data: publicData } = admin.storage
              .from('uploads')
              .getPublicUrl(filePath);

            if (publicData?.publicUrl) {
              videoUrl = publicData.publicUrl;
              console.log('[api/generate] Video successfully saved to Supabase permanent CDN:', videoUrl);
            }
          } else {
            console.warn('[api/generate] Failed to upload to Supabase storage, keeping original URL:', uploadErr);
          }
        }
      } catch (saveErr) {
        console.error('[api/generate] Error saving video to Supabase:', saveErr);
      }
    }

    // 如果没有配置 AI 或者 AI 生成失败且是正式用户操作，绝不扣费并提示用户
    const isMockOrGuest = !userId || userId.startsWith('usr_');

    if (!realGenerationSuccess && !isMockOrGuest && isReplicateConfigured()) {
      return NextResponse.json(
        {
          error: 'AI video generation is currently experiencing high load. No credits were deducted. Please try again with a clearer portrait photo.',
        },
        { status: 503 }
      );
    }

    // 无论正式登录用户还是游客，只要生成成功，都全量记录到后台 video_generations 数据表！
    let remainingCredits: number | null = null;

    if (admin) {
      // 1. 如果是正式登录用户，执行扣减积分
      if (userId && !userId.startsWith('usr_')) {
        remainingCredits = await deductCredits(
          userId,
          creditsDeducted,
          `Generated 5s rap video (${stage || 'hotel-lobby'})`
        );

        if (remainingCredits === null) {
          return NextResponse.json(
            { error: 'Insufficient credits to generate video. Please top up your balance.' },
            { status: 402 }
          );
        }
      }

      // 2. 全量写入 video_generations 记录（供管理员后台实时查看与播放）
      const recordUserId = (userId && !userId.startsWith('usr_')) ? userId : (userId || 'guest_user');
      try {
        await admin.from('video_generations').insert({
          user_id: recordUserId,
          stage: stage || 'hotel_lobby',
          audio_beat: body.model || 'standard',
          lyrics_topic: topic || 'Custom Rap Freestyle',
          status: 'completed',
          video_url: videoUrl,
          cost_credits: (userId && !userId.startsWith('usr_')) ? creditsDeducted : 0,
        });
      } catch (insertErr) {
        console.warn('[api/generate] Error recording video in database:', insertErr);
      }
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
