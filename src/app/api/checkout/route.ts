import { NextResponse } from 'next/server';
import { getWaffoClient, PAYMENT_PLANS } from '@/lib/waffo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phototorap.com';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planId, email, userId } = body;

    const plan = PAYMENT_PLANS[planId as keyof typeof PAYMENT_PLANS];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid credit package selected.' },
        { status: 400 }
      );
    }

    const waffo = getWaffoClient();

    // 未配置 Waffo 私钥时：生产环境直接报错。
    // 此前这里会返回 mode=simulation，前端随即白送积分——等于生产环境存在
    // "不付钱就发积分"的路径。本地开发仍允许模拟，方便调试支付后的 UI 流程。
    if (!waffo) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[api/checkout] Waffo client not configured — checkout disabled in production.');
        return NextResponse.json(
          { error: 'Payment is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
      return NextResponse.json({
        success: true,
        mode: 'simulation',
        checkoutUrl: `/pricing?payment=simulation&plan=${planId}&credits=${plan.credits}`,
        planName: plan.name,
        creditsAdded: plan.credits,
      });
    }

    // 创建 Waffo Pancake 托管收银台会话
    const session = await waffo.checkout.createSession({
      productId: plan.productId,
      currency: 'USD',
      buyerEmail: email || undefined,
      successUrl: `${SITE_URL}/pricing?payment=success&plan=${planId}&credits=${plan.credits}`,
      metadata: {
        userId: userId || '',
        planId: plan.id,
        credits: String(plan.credits),
      },
      expiresInSeconds: 3600,
      darkMode: true,
    });

    return NextResponse.json({
      success: true,
      url: session.checkoutUrl,
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId,
    });
  } catch (err: any) {
    console.error('[api/checkout] Error creating Waffo checkout session:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to initialize payment session' },
      { status: 500 }
    );
  }
}
