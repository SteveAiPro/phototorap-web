/**
 * Seedance 参考图归一化 + 最小尺寸校验
 *
 * ⚠️ 结论更正（2026-10-09 实测）：E005 的主因**不是**分辨率，而是**图片内容
 * （真人脸）**。曾把失败归因于"输入图过大"，已用线上数据推翻——43 次带参考图的
 * 失败记录里，全部 36 张唯一图片宽度介于 243~768px，无一超过 900px 阈值。
 *
 * 但下面两件事仍然要做，只是目的不同：
 *
 * 1. 上限归一化（防另一类 E005）：宽度 > ~900px 确实会触发输入校验拒绝，
 *    手机原图普遍 3000~4000px，压到 768px 宽 + JPEG q90 可排除这个变量。
 *
 * 2. 下限校验（防出片不像本人）：参考图太小，模型拿不到足够人脸细节，
 *    生成结果与本人相似度极差。实测用户传过 243×498 的照片，即便能过审也出不了
 *    可用成片。短边低于 MIN_REFERENCE_SIDE 直接拦在上传前。
 */

/** 超过这个宽度会触发 E005 输入校验拒绝 */
export const SEEDANCE_MAX_INPUT_WIDTH = 900;
/** 实测安全的绝对目标宽度 */
export const SEEDANCE_SAFE_INPUT_WIDTH = 768;

/**
 * 参考图短边最小像素。低于此值无法提供足够人脸细节。
 *
 * 取值依据：产品输出为 480p 竖版（约 480×854），参考图短边应与输出宽度同量级。
 * 实测用户上传样本中 243 / 377 明显不可用，443 以上尚可，故取 400 为分界。
 */
export const MIN_REFERENCE_SIDE = 400;

const JPEG_QUALITY = 0.9;

export interface PreparedImage {
  /** 待上传的文件（已按需压缩；未压缩时即原文件） */
  file: File | Blob;
  /** 原始像素宽度；无法解码时为 0 */
  width: number;
  /** 原始像素高度；无法解码时为 0 */
  height: number;
  /** 是否发生了压缩 */
  resized: boolean;
}

/**
 * 读取图片原始尺寸，并按需压缩到 E005 安全区间。
 *
 * 返回原始尺寸供调用方做最小尺寸校验。解码失败时 width/height 为 0，
 * 调用方应视为"未知"放行——不要因为解码失败就阻断用户。
 * 仅在浏览器端生效（依赖 canvas）；服务端或异常情况下直接透传。
 */
export async function prepareImageForModel(file: File): Promise<PreparedImage> {
  const passthrough: PreparedImage = { file, width: 0, height: 0, resized: false };

  if (!file.type.startsWith('image/')) return passthrough;
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') {
    return passthrough;
  }

  try {
    // imageOrientation: 'from-image' —— 手机自拍普遍带 EXIF 旋转，
    // 不按 EXIF 解码会导致压出来的图躺倒。
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const { width, height } = bitmap;

    // 未超过触发阈值：不重编码，保留原始画质
    if (width <= SEEDANCE_MAX_INPUT_WIDTH) {
      bitmap.close?.();
      return { file, width, height, resized: false };
    }

    const targetWidth = SEEDANCE_SAFE_INPUT_WIDTH;
    const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return { file, width, height, resized: false };
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );
    if (!blob) return { file, width, height, resized: false };

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
    console.log(`[imagePrep] ${width}x${height} -> ${targetWidth}x${targetHeight} (E005 安全尺寸)`);
    return {
      file: new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }),
      width,
      height,
      resized: true,
    };
  } catch (err) {
    console.warn('[imagePrep] prepare failed, sending original file:', err);
    return passthrough;
  }
}

/** 短边是否达到可用下限。width/height 为 0（解码失败）时返回 true 放行。 */
export function isReferenceSizeUsable(width: number, height: number): boolean {
  if (!width || !height) return true;
  return Math.min(width, height) >= MIN_REFERENCE_SIDE;
}
