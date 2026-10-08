/**
 * Seedance 输入图归一化（规避 ByteDance E005 "flagged as sensitive"）
 *
 * 背景：bytedance/seedance-2.0-mini 的 E005 绝大多数不是内容问题，而是
 * **输入参考图分辨率过高**——宽度超过约 900px 会在输入校验阶段（20~52ms 内）
 * 直接被拒，根本进不到生成环节。手机原图普遍 3000~4000px 宽，正好全部命中。
 *
 * 实测结论（对 bytedance/seedance-2.0-mini）：
 *   - 触发上限：输入图宽 > ~900px
 *   - 安全目标：压到 768px 宽（绝对宽度，不是按比例缩放）
 *   - 编码：JPEG quality 90
 *   - 保持原图不动，只把送模型的副本变小
 *
 * 这是恢复 reference_images 传参的前置条件：不先解决 E005，把用户照片送进模型
 * 会 100% 失败，只能退化成"纯文本生成"——也就是生成与用户完全无关的视频。
 */

/** 超过这个宽度就会触发 E005 输入校验拒绝 */
export const SEEDANCE_MAX_INPUT_WIDTH = 900;
/** 实测安全的绝对目标宽度 */
export const SEEDANCE_SAFE_INPUT_WIDTH = 768;
const JPEG_QUALITY = 0.9;

/**
 * 把待送模型的图片压到安全尺寸。返回 File / Blob，失败时原样返回。
 * 仅在浏览器端生效（依赖 canvas）；服务端或异常情况下直接透传。
 */
export async function downscaleForModel(file: File): Promise<File | Blob> {
  if (!file.type.startsWith('image/')) return file;
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') {
    return file;
  }

  try {
    // imageOrientation: 'from-image' —— 手机自拍普遍带 EXIF 旋转，
    // 不按 EXIF 解码会导致压出来的图躺倒。
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const { width, height } = bitmap;

    // 未超过触发阈值：不重编码，保留原始画质
    if (width <= SEEDANCE_MAX_INPUT_WIDTH) {
      bitmap.close?.();
      return file;
    }

    const targetWidth = SEEDANCE_SAFE_INPUT_WIDTH;
    const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
    console.log(
      `[imagePrep] ${width}x${height} -> ${targetWidth}x${targetHeight} (E005 安全尺寸)`
    );
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch (err) {
    console.warn('[imagePrep] downscale failed, sending original file:', err);
    return file;
  }
}
