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
      const rawError = prediction.error || '';
      // ByteDance 侧的内容过滤（E005）与"生成失败"是两回事，处理方式完全不同：
      // E005 的触发源是**输入参考图**（分辨率过高，或人脸特写取景），
      // 换词重写 prompt 没有任何用，必须换图。
      const isInputFlagged = /E005|flagged as sensitive|content moderation|sensitive/i.test(rawError);

      if (isInputFlagged) {
        console.warn('[api/generate/status] Seedance E005 input flagged:', rawError);
      }

      return NextResponse.json({
        success: false,
        status: prediction.status,
        code: isInputFlagged ? 'E005_INPUT_FLAGGED' : 'GENERATION_FAILED',
        error: isInputFlagged
          ? 'The AI safety filter rejected one of your photos. No credits were deducted. Please retry with a waist-up or full-body photo — a tight close-up selfie is the most common trigger.'
          : rawError || 'AI Video rendering failed. No credits were deducted.',
      });
    }

    // 如果任务成功 (succeeded)，处理持久化与扣款
    let finalVideoUrl = prediction.videoUrl || '';

    if (finalVideoUrl && finalVideoUrl.startsWith('http')) {
      const admin = getSupabaseAdmin();

      // 1. 流式转存至永久存储
      //    优先级：Cloudflare R2（零出网费 + Anycast CDN） → Supabase Storage 公开桶
      //    ⚠️ 绝不能把 Replicate 的临时地址当最终地址返回：它 1 小时后就被物理删除，
      //    用户会拿到一个打不开的视频链接。
      try {
        console.log('[api/generate/status] Persisting video to permanent storage...', finalVideoUrl);
        const vidResp = await fetch(finalVideoUrl);
        if (vidResp.ok) {
          const vidBuffer = Buffer.from(await vidResp.arrayBuffer());
          const fileName = `rap_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
          const filePath = `generated_videos/${fileName}`;

          // 1a. 首选 Cloudflare R2
          try {
            const { uploadToR2 } = await import('@/lib/r2');
            const r2Url = await uploadToR2(filePath, vidBuffer, 'video/mp4');
            console.log('[api/generate/status] Successfully saved to R2:', r2Url);
            finalVideoUrl = r2Url;
          } catch (r2Err) {
            console.warn('[api/generate/status] R2 upload error, falling back to Supabase:', r2Err);
          }

          // 1b. Supabase Storage：既是备份，也是 R2 不可用时的最终 URL 来源
          if (admin) {
            try {
              const { error: uploadErr } = await admin.storage
                .from('uploads')
                .upload(filePath, vidBuffer, { contentType: 'video/mp4', upsert: true });

              if (!uploadErr) {
                // 只有当 R2 没接管时，才把最终地址切到 Supabase 公网地址
                const isStillOnTempUrl = finalVideoUrl === prediction.videoUrl;
                if (isStillOnTempUrl) {
                  const { data: publicData } = admin.storage.from('uploads').getPublicUrl(filePath);
                  if (publicData?.publicUrl) {
                    finalVideoUrl = publicData.publicUrl;
                    console.log('[api/generate/status] Using Supabase Storage URL:', finalVideoUrl);
                  }
                }
              } else {
                console.warn('[api/generate/status] Supabase backup failed:', uploadErr.message);
              }
            } catch (sbErr) {
              console.warn('[api/generate/status] Supabase backup error:', sbErr);
            }
          }

          // 1c. 两条持久化路径都失败 —— 明确告警，别让用户拿到 1 小时后失效的链接
          if (finalVideoUrl === prediction.videoUrl) {
            console.error(
              '[api/generate/status] ⚠️ Video NOT persisted to permanent storage. ' +
                'Returned URL is a Replicate temp URL and will expire in ~1 hour.',
              { predictionId, filePath }
            );
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
