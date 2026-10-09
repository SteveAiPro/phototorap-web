import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { readImageSize } from '@/lib/imageMeta';
import { SEEDANCE_MAX_INPUT_WIDTH, MIN_REFERENCE_SIDE } from '@/lib/imagePrep';

export async function POST(req: Request) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `user_uploads/${fileName}`;

    const size = readImageSize(buffer);

    // 最小尺寸拦截：参考图太小 → 模型拿不到人脸细节 → 出片不像本人。
    // 在写入存储之前就拦下，避免把不可用的图存进桶里、也避免用户白等一次生成。
    // 前端已做同样校验，这里是防绕过（直连 API）的权威判定。
    if (size && Math.min(size.width, size.height) < MIN_REFERENCE_SIDE) {
      console.warn(
        `[api/upload] Reference image too small: ${size.width}x${size.height} (${size.format}) — 短边低于 ${MIN_REFERENCE_SIDE}px，已拒绝。`
      );
      return NextResponse.json(
        {
          error:
            `This photo is too small (${size.width}×${size.height}). ` +
            `Please use a photo at least ${MIN_REFERENCE_SIDE}px on the shorter side, ` +
            `otherwise the AI can't capture your face clearly.`,
          code: 'IMAGE_TOO_SMALL',
          width: size.width,
          height: size.height,
        },
        { status: 422 }
      );
    }

    // 观测：这张图送进 Seedance 会不会因尺寸被 E005 拒绝。
    // 前端已做归一化，这里出现超宽说明请求绕过了前端（直连 API），仅告警不阻断。
    if (size && size.width > SEEDANCE_MAX_INPUT_WIDTH) {
      console.warn(
        `[api/upload] Oversized reference image: ${size.width}x${size.height} (${size.format}) at ${filePath} — 宽度超过 ${SEEDANCE_MAX_INPUT_WIDTH}px 会触发 Seedance E005，请确认前端归一化是否生效。`
      );
    }

    let publicUrl = '';

    // 1. 优先上传至 Cloudflare R2 全球 CDN
    try {
      const { uploadToR2 } = await import('@/lib/r2');
      publicUrl = await uploadToR2(filePath, buffer, file.type || 'image/png');
      console.log('[api/upload] Image uploaded to Cloudflare R2:', publicUrl);
    } catch (r2Err) {
      console.warn('[api/upload] Cloudflare R2 upload error, falling back to Supabase:', r2Err);
    }

    // 2. 同时双写同步备份到 Supabase Storage
    try {
      const { data, error } = await admin.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type || 'image/png',
          upsert: true,
        });

      if (!publicUrl) {
        if (error) {
          console.error('[api/upload] Supabase storage upload error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        const { data: publicUrlData } = admin.storage
          .from(bucket)
          .getPublicUrl(filePath);
        publicUrl = publicUrlData.publicUrl;
      }
    } catch (sbErr) {
      console.warn('[api/upload] Supabase backup upload error:', sbErr);
    }

    return NextResponse.json({
      success: true,
      path: filePath,
      url: publicUrl,
      bucket,
    });
  } catch (err: any) {
    console.error('[api/upload] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal upload error' }, { status: 500 });
  }
}
