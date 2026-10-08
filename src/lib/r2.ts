import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 对象存储客户端。
 *
 * ⚠️ 安全约束：本文件**不允许**再出现任何硬编码兜底凭据。
 *
 * 事故记录（2026-10-07）：R2 的 Access Key ID / Secret Access Key 曾以
 * `process.env.R2_X || '<明文>'` 的形式硬编码在本文件中，并随公开仓库
 * github.com/SteveAiPro/phototorap-web 一起泄露（commit beaa21a）。
 * 任何能访问该仓库的人都可以读写、列举、删除整个桶——包括用户上传的原图
 * 与全部生成视频。凭据必须只来自环境变量。
 *
 * 需要在 Vercel → Project → Settings → Environment Variables 配置：
 *   R2_ACCOUNT_ID         Cloudflare 账户 ID
 *   R2_ACCESS_KEY_ID      R2 API Token 的 Access Key ID
 *   R2_SECRET_ACCESS_KEY  R2 API Token 的 Secret Access Key
 *   R2_BUCKET_NAME        桶名（可选，默认 phototorap）
 *   R2_PUBLIC_URL         桶的公开访问域名，结尾不带斜杠（可选，见下方默认值）
 *
 * 未配置时 uploadToR2 会抛出可读错误，由调用方降级到 Supabase Storage。
 * 注意：降级路径下视频只留在 Supabase，务必确认该桶可公开读取。
 */

/** 非敏感配置：桶名与公开域名会出现在每一个对外 URL 中，保留默认值以避免线上中断 */
const DEFAULT_BUCKET_NAME = 'phototorap';
const DEFAULT_PUBLIC_URL = 'https://pub-c36ad19b3ab44f9986b92271722e796c.r2.dev';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

let _configCache: R2Config | null = null;

/**
 * 读取配置。缺少任一凭据变量时返回 null（而不是抛错），
 * 这样模块导入本身永远不会失败，isR2Configured() 也能安全探活。
 */
function readConfig(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  if (!_configCache) {
    _configCache = {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucket: process.env.R2_BUCKET_NAME || DEFAULT_BUCKET_NAME,
      publicUrl: (process.env.R2_PUBLIC_URL || DEFAULT_PUBLIC_URL).replace(/\/+$/, ''),
    };
  }
  return _configCache;
}

const MISSING_CONFIG_MESSAGE =
  '[r2] Cloudflare R2 credentials are not configured. ' +
  'Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY ' +
  '(Vercel → Settings → Environment Variables). ' +
  'Falling back to Supabase Storage until they are present.';

let _s3Client: S3Client | null = null;

export function getR2Client(): S3Client {
  const config = readConfig();
  if (!config) {
    throw new Error(MISSING_CONFIG_MESSAGE);
  }

  if (!_s3Client) {
    _s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return _s3Client;
}

/**
 * 上传文件 Buffer 或 Uint8Array 到 Cloudflare R2 并返回公开访问 CDN URL。
 * 未配置凭据时抛错，调用方需自行降级。
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = 'application/octet-stream'
): Promise<string> {
  const config = readConfig();
  if (!config) {
    throw new Error(MISSING_CONFIG_MESSAGE);
  }

  const client = getR2Client();
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${config.publicUrl}/${cleanKey}`;
}

export function isR2Configured(): boolean {
  return readConfig() !== null;
}
