import { NextResponse } from 'next/server';
import { getStripe, PAYMENT_PLANS } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

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

    const stripe = getStripe();

    // 如果未配置 Stripe Key 或处于预览模式，返回模拟成功链接
    if (!stripe) {
      return NextResponse.json({
        success: true,
        mode: 'simulation',
        checkoutUrl: `/pricing/success?plan=${planId}&credits=${plan.credits}`,
        planName: plan.name,
        creditsAdded: plan.credits,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
              images: [`${SITE_URL}/og-image.png`],
            },
            unit_amount: plan.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: userId || undefined,
      customer_email: email || undefined,
      metadata: {
        userId: userId || '',
        planId: plan.id,
        credits: String(plan.credits),
      },
      success_url: `${SITE_URL}/pricing?payment=success&session_id={CHECKOUT_SESSION_ID}&credits=${plan.credits}`,
      cancel_url: `${SITE_URL}/pricing?payment=cancelled`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    console.error('[api/checkout] Error creating checkout session:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
