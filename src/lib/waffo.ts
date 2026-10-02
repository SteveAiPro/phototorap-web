import { WaffoPancake } from '@waffo/pancake-ts';

export interface PaymentPlan {
  id: 'single' | 'pack' | 'monthly';
  productId: string;
  productType: 'onetime' | 'subscription';
  name: string;
  priceFormatted: string;
  credits: number;
  description: string;
}

export const WAFFO_STORE_ID = process.env.WAFFO_STORE_ID || 'STO_3YZqFeue0cGj2iyEvaPLzq';

export const PAYMENT_PLANS: Record<string, PaymentPlan> = {
  single: {
    id: 'single',
    productId: process.env.WAFFO_PRODUCT_SINGLE || 'PROD_3UXM4zIbeWowzvUYhaueAJ',
    productType: 'onetime',
    name: 'PhotoToRap Single Track',
    priceFormatted: '$9.99',
    credits: 10,
    description: '10 AI Credits (1 Full 1080p Rap Video Export, No Watermark)',
  },
  pack: {
    id: 'pack',
    productId: process.env.WAFFO_PRODUCT_PACK || 'PROD_0PUTXFc0EnIX3Xt7u0h9Yy',
    productType: 'onetime',
    name: 'PhotoToRap Creator 5-Pack',
    priceFormatted: '$29.00',
    credits: 50,
    description: '50 AI Credits (5 Full 1080p Rap Video Exports, Priority GPU)',
  },
  monthly: {
    id: 'monthly',
    productId: process.env.WAFFO_PRODUCT_MONTHLY || 'PROD_1JWG5A2lXogO1g8b959v2l',
    productType: 'subscription',
    name: 'PhotoToRap Pro Monthly',
    priceFormatted: '$29.90/mo',
    credits: 100,
    description: '100 AI Credits Monthly (10 HD Videos each month, VIP Queue)',
  },
};

let _waffoClient: WaffoPancake | null = null;

export function getWaffoClient(): WaffoPancake | null {
  const merchantId = process.env.WAFFO_MERCHANT_ID || 'MER_2aLDbRkM13ulM8RQUYn5Q1';
  let privateKey = process.env.WAFFO_PRIVATE_KEY;

  if (!privateKey) {
    return null;
  }

  // 支持直接传入 raw base64、包含 \n 换行的字符串，或者 PEM
  if (!privateKey.includes('-----BEGIN')) {
    privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey.trim()}\n-----END RSA PRIVATE KEY-----\n`;
  } else {
    // 替换转义的 \n 为真实换行
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!_waffoClient) {
    try {
      _waffoClient = new WaffoPancake({
        merchantId,
        privateKey,
      });
    } catch (err) {
      console.error('[WaffoPancake] Initialization error:', err);
      return null;
    }
  }

  return _waffoClient;
}

export function isWaffoConfigured(): boolean {
  return Boolean(process.env.WAFFO_PRIVATE_KEY && process.env.WAFFO_MERCHANT_ID);
}

/**
 * 前置内容安全合规扫描 (Waffo Prompt Screening API)
 * 在 AI 视频/提示词实际进入生成环节前进行违规过滤
 */
export async function checkPromptSafety(prompt: string): Promise<{
  safe: boolean;
  action: 'allow' | 'review' | 'block';
  reason?: string;
}> {
  if (!prompt || !prompt.trim()) {
    return { safe: true, action: 'allow' };
  }

  const client = getWaffoClient();
  if (!client) {
    return { safe: true, action: 'allow' };
  }

  try {
    const res = await client.contentSafety.scanPrompt({
      prompt: prompt.trim().slice(0, 2000),
    });

    if (res.action === 'block') {
      return {
        safe: false,
        action: 'block',
        reason: 'Prompt contains restricted content not permitted by our content safety guidelines.',
      };
    }

    return {
      safe: true,
      action: res.action,
    };
  } catch (err: any) {
    console.warn('[Waffo ContentSafety] Scan prompt error or service unavailable, allowing through:', err?.message);
    return { safe: true, action: 'allow' };
  }
}

