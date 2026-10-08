/**
 * 零依赖读取 JPEG / PNG 图片的像素尺寸。
 *
 * 用途：在服务端记录送进 Seedance 的参考图实际宽度。
 * 宽度 > 900px 是 E005（"flagged as sensitive"）输入校验拒绝的首要触发因素，
 * 客户端虽已做归一化，但直连 API 的请求会绕过前端；这里只做观测与告警，
 * 不阻断上传（阻断会误伤，且归一化失败时仍应放行）。
 *
 * 支持：JPEG (SOF0~SOF15)、PNG (IHDR)。
 * 其它格式返回 null，调用方按"未知"处理。
 */

export interface ImageSize {
  width: number;
  height: number;
  format: 'jpeg' | 'png';
}

function readJpegSize(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = buf[offset + 1];

    // 无载荷的标记位
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    const segLength = buf.readUInt16BE(offset + 2);
    if (segLength < 2) return null;

    // SOF0~SOF15（排除 DHT=0xc4 / JPG=0xc8 / DAC=0xcc）
    const isSOF =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

    if (isSOF) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
        format: 'jpeg',
      };
    }

    // 到达图像数据，停止扫描
    if (marker === 0xda) return null;

    offset += 2 + segLength;
  }
  return null;
}

function readPngSize(buf: Buffer): ImageSize | null {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(signature)) return null;
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null;

  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    format: 'png',
  };
}

export function readImageSize(buffer: Buffer): ImageSize | null {
  return readPngSize(buffer) || readJpegSize(buffer);
}
