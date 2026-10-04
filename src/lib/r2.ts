import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'e2f3a057e20cb7fed767d78e0c4019a0';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '707038f80c696ea36a6e006f389df469';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'e22b3b47e9ba7d4a6e07aa11bce32c247619fca31aba43ec13db0e38e5922929';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'phototorap';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-c36ad19b3ab44f9986b92271722e796c.r2.dev';

let _s3Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!_s3Client) {
    _s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _s3Client;
}

/**
 * 上传文件 Buffer 或 Uint8Array 到 Cloudflare R2 并返回公开访问 CDN URL
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = 'application/octet-stream'
): Promise<string> {
  const client = getR2Client();
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
    })
  );

  const baseUrl = R2_PUBLIC_URL.replace(/\/+$/, '');
  return `${baseUrl}/${cleanKey}`;
}

export function isR2Configured(): boolean {
  return Boolean(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ACCOUNT_ID);
}
