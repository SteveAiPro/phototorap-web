import { NextResponse } from 'next/server';
import { getReplicatePrediction } from '@/lib/replicate';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits, getCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * 生成任务状态查询。
 *
 * 计费模型：**创建时预扣、失败时退款**（见 /api/generate）。
 * 所以本接口**不再扣费**，只做三件事：读 job 行 → 轮询 Replicate → 交付或退款。
 *
 * 关键设计：所有金额与生成参数都从服务端 job 行（video_generations）读取，
 * 完全不信任 query 参数。此前：
 *   - 金额按 query 里的 `model` 现算 → 用 flagship 生成、传 standard 轮询就能少扣钱
 *   - 没有幂等保护 → 成功后重复轮询会重复扣费、重复插入记录
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');
    const predictionIdParam = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    // 1) 从 job 行取服务端真相
    const { data: job } = await admin
      .from('video_generations')
      .select('id, user_id, stage, audio_beat, lyrics_topic, status, video_url, cost_credits')
      .eq('id', jobId)
      .maybeSingle();

    if (!job) {
      return NextResponse.json({ error: 'Unknown job' }, { status: 404 });
    }
    if (userId && job.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let meta: any = {};
    try {
      meta = JSON.parse(job.lyrics_topic || '{}');
    } catch {}

    const predictionId = meta.predictionId || predictionIdParam;
    if (!predictionId) {
      return NextResponse.json({ error: 'Job has no prediction id' }, { status: 500 });
    }

    const topic = meta.topic || 'Custom Rap Freestyle';
    const reserved = Number(meta.reserved) || Number(job.cost_credits) || 0;

    // 2) 幂等：终态直接返回上次结果，绝不重复退款、重复记账
    if (job.status === 'completed') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        videoUrl: job.video_url,
        lyrics: `Dropping beats for ${topic}, two legends in the frame!`,
      });
    }
    if (job.status === 'failed') {
      return NextResponse.json({
        success: false,
        status: 'failed',
        code: 'REFUNDED',
        error: 'This generation failed and your credits have been refunded.',
      });
    }

    // 3) 轮询 Replicate
    const prediction = await getReplicatePrediction(predictionId);

    if (prediction.status === 'starting' || prediction.status === 'processing') {
      return NextResponse.json({
        success: true,
        status: prediction.status,
        predictionId,
      });
    }

    // 4) 失败 / 取消 → 退款（预扣发生在 /api/generate，这里把钱还回去）
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      const rawError = prediction.error || '';
      // ByteDance 的内容过滤（E005）与普通生成失败是两回事，提示文案要分开：
      // E005 的触发源是**输入参考图**（人脸特写等），换词重写 prompt 没用，必须换图。
      const isInputFlagged = /E005|flagged as sensitive|content moderation|sensitive/i.test(rawError);

      if (isInputFlagged) {
        console.warn('[api/generate/status] Seedance E005 input flagged:', rawError);
      }

      if (reserved > 0) {
        await addCredits(
          job.user_id,
          reserved,
          'refund',
          `refund_${predictionId}`,
          'Auto refund: generation failed'
        );
        console.log(`[api/generate/status] Refunded ${reserved} credits for failed job ${job.id}`);
      }

      await admin
        .from('video_generations')
        .update({ status: 'failed', cost_credits: 0 })
        .eq('id', job.id);

      const balance = await getCredits(job.user_id);

      return NextResponse.json({
        success: false,
        status: prediction.status,
        code: isInputFlagged ? 'E005_INPUT_FLAGGED' : 'GENERATION_FAILED',
        refunded: reserved,
        remainingCredits: balance,
        error: isInputFlagged
          ? 'The AI safety filter rejected one of your photos. Your credits were refunded. Please retry with a waist-up or full-body photo — a tight close-up selfie is the most common trigger.'
          : rawError || 'AI video rendering failed. Your credits were refunded.',
      });
    }

    // 5) 成功 → 转存永久存储 → 标记完成（**不再扣费**，创建时已预扣）
    const tempUrl = prediction.videoUrl || '';
    if (!tempUrl.startsWith('http')) {
      // 成功却拿不到输出：同样退款，不能让用户白付
      if (reserved > 0) {
        await addCredits(
          job.user_id,
          reserved,
          'refund',
          `refund_${predictionId}`,
          'Auto refund: no output returned'
        );
      }
      await admin
        .from('video_generations')
        .update({ status: 'failed', cost_credits: 0 })
        .eq('id', job.id);
      return NextResponse.json({
        success: false,
        status: 'failed',
        code: 'REFUNDED',
        error: 'The AI model returned no video. Your credits have been refunded.',
      });
    }

    let finalVideoUrl = tempUrl;

    // 优先级：Cloudflare R2（零出网费 + Anycast CDN） → Supabase Storage 公开桶
    // ⚠️ 绝不能把 Replicate 的临时地址当最终地址返回：它 1 小时后被物理删除。
    try {
      console.log('[api/generate/status] Persisting video to permanent storage...', tempUrl);
      const vidResp = await fetch(tempUrl);
      if (vidResp.ok) {
        const vidBuffer = Buffer.from(await vidResp.arrayBuffer());
        const fileName = `rap_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
        const filePath = `generated_videos/${fileName}`;

        try {
          const { uploadToR2 } = await import('@/lib/r2');
          finalVideoUrl = await uploadToR2(filePath, vidBuffer, 'video/mp4');
          console.log('[api/generate/status] Successfully saved to R2:', finalVideoUrl);
        } catch (r2Err) {
          console.warn('[api/generate/status] R2 upload error, falling back to Supabase:', r2Err);
        }

        try {
          const { error: uploadErr } = await admin.storage
            .from('uploads')
            .upload(filePath, vidBuffer, { contentType: 'video/mp4', upsert: true });

          if (!uploadErr && finalVideoUrl === tempUrl) {
            const { data: publicData } = admin.storage.from('uploads').getPublicUrl(filePath);
            if (publicData?.publicUrl) {
              finalVideoUrl = publicData.publicUrl;
              console.log('[api/generate/status] Using Supabase Storage URL:', finalVideoUrl);
            }
          }
        } catch (sbErr) {
          console.warn('[api/generate/status] Supabase backup error:', sbErr);
        }

        if (finalVideoUrl === tempUrl) {
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

    await admin
      .from('video_generations')
      .update({ status: 'completed', video_url: finalVideoUrl, cost_credits: reserved })
      .eq('id', job.id);

    console.log(`[api/generate/status] Job ${job.id} completed (charged ${reserved} at creation)`);

    return NextResponse.json({
      success: true,
      status: 'completed',
      videoUrl: finalVideoUrl,
      lyrics: `Dropping beats for ${topic}, two legends in the frame!`,
    });
  } catch (error: any) {
    console.error('[api/generate/status] Error:', error);
    return NextResponse.json({ error: error.message || 'Status check failed' }, { status: 500 });
  }
}
