import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits, deductCredits } from '@/lib/credits';
import {
  isReplicateConfigured,
  runSeedanceVideoGeneration,
  runLivePortraitVideoGeneration,
} from '@/lib/replicate';
import { checkPromptSafety } from '@/lib/waffo';
import { computeCredits, normalizeDuration, normalizeResolution } from '@/lib/pricing';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { photo1, photo2, stage, topic, mode, userId } = body;

    // 严格限制：未登录游客绝对禁止使用 AI 生成接口，必须先注册/登录
    if (!userId || userId.startsWith('usr_')) {
      return NextResponse.json(
        { error: 'Please sign in or create an account to generate AI rap videos.' },
        { status: 401 }
      );
    }

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

    // 计价：只由「分辨率 + 时长」两个维度决定，公式与前端共用 pricing.ts。
    //
    // ⚠️ 历史问题（2026-10-11 修复）：
    //   1. 曾按 model 档位定价（10/17/20/37），但四个档位实际调用的是**同一个模型**，
    //      按档位收不同价格属于虚假承诺；
    //   2. 15 秒的 1.3 倍加价在前端和后端各算了一遍，两处口径不同导致展示与实扣不一致。
    // 现在统一为 computeCredits(resolution, duration)，这里是唯一真相来源。
    const resolution = normalizeResolution(body.resolution);
    const duration = normalizeDuration(body.duration);
    const cost = computeCredits(resolution, duration);

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    // 先回收自己遗留的僵尸任务（用户中途关页面时，预扣的积分会一直挂着）
    await reconcileStaleJobs(admin, userId);

    // ⚠️ 扣费必须在这里 —— 创建 prediction **之前**，而且必须是原子的。
    //
    // deduct_credits 是一条 `update ... where credits >= amount` 的条件更新，
    // Postgres 会串行化并发请求：余额只够 1 次时，N 个并发请求里只有 1 个能成功，
    // 其余拿不到更新行 → 抛异常 → 返回 null。**这就是堵住"并发白嫖"的关键**。
    //
    // 此前扣费放在生成完成时、且失败不影响成片交付，导致 10 积分能连出多个视频
    // （线上实测 4 例）。除收入流失外，Replicate 侧是真实计费的，同时也是
    // 一条 denial-of-wallet 通道。
    const remaining = await deductCredits(
      userId,
      cost,
      `Generated 5s rap video (${stage || 'hotel-lobby'})`
    );

    if (remaining === null) {
      return NextResponse.json(
        {
          error: `Insufficient credits. This generation costs ${cost} credits. Please top up to continue.`,
          code: 'INSUFFICIENT_CREDITS',
          required: cost,
        },
        { status: 402 }
      );
    }

    let videoUrl = stageVideoMap[stage] || '/examples/friends.mp4';
    let taskId = 'task_' + Math.random().toString(36).substring(7);
    let realGenerationSuccess = false;

    // 如果已配置 REPLICATE_API_TOKEN，异步创建 ByteDance Seedance 2.0 Mini 任务并立即返回
    // 避免同步等待被 Vercel 15 秒超时无情杀掉
    if (isReplicateConfigured()) {
      let predictionId = '';
      let jobId: number | null = null;

      try {
        const { createSeedancePrediction } = await import('@/lib/replicate');
        console.log('[api/generate] Submitting async prediction to Seedance 2.0 Mini...');
        const pred = await createSeedancePrediction({
          photo1Url: photo1,
          photo2Url: photo2,
          stage,
          topic,
          // 真正把用户选的分辨率与时长透传给模型（此前硬编码 5s + 按档位推断分辨率）
          resolution,
          duration,
          aspectRatio: body.aspectRatio || '9:16',
          modelTier: body.model || 'standard',
          mode: mode || (photo2 ? 'two' : 'one'),
        });
        predictionId = pred.id;

        // 落 job 行：预扣金额、predictionId 与生成参数全部记在服务端。
        // 之后 /api/generate/status 一律从这一行读，不再信任 query 参数 ——
        // 此前 model 档位来自 query，用 flagship 生成、传 standard 轮询就能少扣钱。
        const { data: job, error: jobErr } = await admin
          .from('video_generations')
          .insert({
            user_id: userId,
            stage: stage || 'hotel_lobby',
            audio_beat: body.model || 'standard',
            lyrics_topic: JSON.stringify({
              topic,
              photo1: photo1 || null,
              photo2: photo2 || null,
              predictionId: pred.id,
              reserved: cost,
              // 记下实际送模型的参数，便于对账（预扣金额必须与这两个值算出的价格一致）
              resolution,
              duration,
            }),
            status: 'processing',
            video_url: '',
            cost_credits: cost,
          })
          .select('id')
          .single();

        if (jobErr) throw new Error(jobErr.message);
        jobId = job?.id ?? null;

        console.log('[api/generate] Prediction created:', pred.id, '| job:', jobId, '| charged:', cost);
      } catch (repErr: any) {
        // 绝不让用户为一次没能启动的生成付钱
        await addCredits(
          userId,
          cost,
          'refund',
          `refund_${Date.now()}`,
          'Auto refund: failed to start generation'
        );
        console.error('[api/generate] Start failed, credits refunded:', repErr);
        return NextResponse.json(
          { error: repErr?.message || 'Failed to submit generation job. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        async: true,
        predictionId,
        jobId,
        status: 'starting',
        creditsDeducted: cost,
        remainingCredits: remaining,
      });
    }

    // 如果 AI 成功生成了 Replicate Delivery 临时视频，立即自动流式转存到 Cloudflare R2 永久持久化！
    // 享受 0 出网流量费与全球 Anycast CDN 高速分发，避免 Replicate 1 小时后自动删除
    if (realGenerationSuccess && videoUrl && videoUrl.startsWith('http')) {
      try {
        console.log('[api/generate] Persisting Replicate video to permanent Cloudflare R2 Storage...', videoUrl);
        const vidResp = await fetch(videoUrl);
        if (vidResp.ok) {
          const vidBuffer = Buffer.from(await vidResp.arrayBuffer());
          const fileName = `rap_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
          const filePath = `generated_videos/${fileName}`;

          let r2SavedUrl = '';
          try {
            const { uploadToR2 } = await import('@/lib/r2');
            r2SavedUrl = await uploadToR2(filePath, vidBuffer, 'video/mp4');
            console.log('[api/generate] Video successfully saved to Cloudflare R2 CDN:', r2SavedUrl);
            videoUrl = r2SavedUrl;
          } catch (r2Err) {
            console.warn('[api/generate] R2 upload error, falling back to Supabase:', r2Err);
          }

          // 同步备份至 Supabase Storage
          if (admin) {
            try {
              const { error: uploadErr } = await admin.storage
                .from('uploads')
                .upload(filePath, vidBuffer, {
                  contentType: 'video/mp4',
                  upsert: true,
                });

              if (!r2SavedUrl && !uploadErr) {
                const { data: publicData } = admin.storage
                  .from('uploads')
                  .getPublicUrl(filePath);
                if (publicData?.publicUrl) {
                  videoUrl = publicData.publicUrl;
                }
              }
            } catch (sbErr) {
              console.warn('[api/generate] Supabase storage backup failed:', sbErr);
            }
          }
        }
      } catch (saveErr) {
        console.error('[api/generate] Error saving video to storage:', saveErr);
      }
    }

    // 如果没有配置 AI 或者 AI 生成失败且是正式用户操作，绝不扣费并提示用户
    // ── 走到这里说明 Replicate 未配置（isReplicateConfigured() === false）──────
    //
    // 此前这里会给用户返回一个静态占位视频（/examples/*.mp4）并**照常扣积分** ——
    // 等于收钱交付假货。现在扣费已经提前到函数开头，所以必须退款并明确报错，
    // 绝不拿占位视频冒充成片。
    await addCredits(
      userId,
      cost,
      'refund',
      `refund_${Date.now()}`,
      'Auto refund: AI backend not configured'
    );
    console.error('[api/generate] Replicate not configured — generation unavailable, credits refunded.');
    return NextResponse.json(
      {
        error: 'AI video generation is temporarily unavailable. No credits were deducted.',
        code: 'BACKEND_UNAVAILABLE',
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('[api/generate] Generation error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}

/**
 * 回收自己遗留的僵尸任务。
 *
 * 用户中途关掉页面时，预扣的积分会一直挂着（既没交付也没退）。这里挑出
 * 10 分钟前仍是 'processing' 的记录，去 Replicate 查真实状态：
 *   - 失败/取消 → 退款并把记录标记为 failed
 *   - 仍在跑    → 跳过，等下次
 *   - 已成功    → 跳过（不退款；客户端正常会在轮询窗口内取回）
 *
 * 只查当前用户、最多 3 条，避免拖慢正常请求。
 */
async function reconcileStaleJobs(admin: any, userId: string) {
  try {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: stale } = await admin
      .from('video_generations')
      .select('id, lyrics_topic, cost_credits')
      .eq('user_id', userId)
      .eq('status', 'processing')
      .lt('created_at', cutoff)
      .order('created_at', { ascending: true })
      .limit(3);

    if (!stale?.length) return;

    const { getReplicatePrediction } = await import('@/lib/replicate');

    for (const row of stale) {
      let meta: any = {};
      try {
        meta = JSON.parse(row.lyrics_topic || '{}');
      } catch {}
      if (!meta.predictionId) continue;

      let p: { status: string };
      try {
        p = await getReplicatePrediction(meta.predictionId);
      } catch {
        continue; // 查不到就先放着，下次再处理
      }

      if (p.status === 'starting' || p.status === 'processing' || p.status === 'succeeded') continue;

      const amount = Number(meta.reserved) || Number(row.cost_credits) || 0;
      if (amount > 0) {
        await addCredits(
          userId,
          amount,
          'refund',
          `refund_${meta.predictionId}`,
          'Auto refund: generation failed'
        );
      }
      await admin
        .from('video_generations')
        .update({ status: 'failed', cost_credits: 0 })
        .eq('id', row.id);
      console.log(`[api/generate] Reconciled stale job ${row.id} → refunded ${amount}`);
    }
  } catch (err) {
    console.warn('[api/generate] reconcileStaleJobs failed (non-fatal):', err);
  }
}
