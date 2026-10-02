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

    // 如果未配置 Waffo 私钥，返回模拟成功链接
    if (!waffo) {
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
      successUrl: `${SITE_URL}/pricing?payment=success&credits=${plan.credits}`,
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
