import { NextResponse } from 'next/server';
import { getReplicatePrediction } from '@/lib/replicate';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { deductCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const predictionId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const stage = searchParams.get('stage') || 'hotel-lobby';
    const topic = searchParams.get('topic') || 'Custom Rap Freestyle';
    const photo1 = searchParams.get('photo1');
    const photo2 = searchParams.get('photo2');
    const modelTier = searchParams.get('model') || 'standard';

    if (!predictionId) {
      return NextResponse.json({ error: 'Missing prediction id' }, { status: 400 });
    }

    const prediction = await getReplicatePrediction(predictionId);

    // 如果任务仍在进行中 (starting / processing)
    if (prediction.status === 'starting' || prediction.status === 'processing') {
      return NextResponse.json({
        success: true,
        status: prediction.status,
        predictionId,
      });
    }

    // 如果任务失败 (failed / canceled)
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return NextResponse.json({
        success: false,
        status: prediction.status,
        error: prediction.error || 'AI Video rendering failed or was flagged. No credits deducted.',
      });
    }

    // 如果任务成功 (succeeded)，处理持久化与扣款
    let finalVideoUrl = prediction.videoUrl || '';

    if (finalVideoUrl && finalVideoUrl.startsWith('http')) {
      const admin = getSupabaseAdmin();

      // 1. 流式转存至 Cloudflare R2
      try {
        console.log('[api/generate/status] Persisting video to Cloudflare R2...', finalVideoUrl);
        const vidResp = await fetch(finalVideoUrl);
        if (vidResp.ok) {
          const vidBuffer = Buffer.from(await vidResp.arrayBuffer());
          const fileName = `rap_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
          const filePath = `generated_videos/${fileName}`;

          try {
            const { uploadToR2 } = await import('@/lib/r2');
            const r2Url = await uploadToR2(filePath, vidBuffer, 'video/mp4');
            console.log('[api/generate/status] Successfully saved to R2:', r2Url);
            finalVideoUrl = r2Url;
          } catch (r2Err) {
            console.warn('[api/generate/status] R2 upload error, falling back:', r2Err);
          }

          // 同步备份至 Supabase
          if (admin) {
            try {
              await admin.storage
                .from('uploads')
                .upload(filePath, vidBuffer, { contentType: 'video/mp4', upsert: true });
            } catch (sbErr) {
              console.warn('[api/generate/status] Supabase backup error:', sbErr);
            }
          }
        }
      } catch (err) {
        console.error('[api/generate/status] Error saving video stream:', err);
      }

      // 2. 扣除积分与记录数据库 (只有真正拿到成片才扣)
      const modelCreditsMap: Record<string, number> = {
        standard: 10,
        fast: 17,
        pro: 20,
        flagship: 37,
      };
      const creditsCost = modelCreditsMap[modelTier] || 10;
      let remainingCredits: number | null = null;

      if (admin && userId && !userId.startsWith('usr_')) {
        remainingCredits = await deductCredits(
          userId,
          creditsCost,
          `Generated 5s rap video (${stage})`
        );

        const payloadTopic = JSON.stringify({
          topic,
          photo1: photo1 || null,
          photo2: photo2 || null,
        });

        try {
          await admin.from('video_generations').insert({
            user_id: userId,
            stage,
            audio_beat: modelTier,
            lyrics_topic: payloadTopic,
            status: 'completed',
            video_url: finalVideoUrl,
            cost_credits: creditsCost,
          });
          console.log('[api/generate/status] Successfully recorded generation in database!');
        } catch (insertErr) {
          console.warn('[api/generate/status] Error recording generation:', insertErr);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        videoUrl: finalVideoUrl,
        remainingCredits,
        lyrics: `Dropping beats for ${topic}, two legends in the frame!`,
      });
    }

    return NextResponse.json({
      success: false,
      status: 'failed',
      error: 'No video output returned by AI model',
    });
  } catch (error: any) {
    console.error('[api/generate/status] Error:', error);
    return NextResponse.json({ error: error.message || 'Status check failed' }, { status: 500 });
  }
}
