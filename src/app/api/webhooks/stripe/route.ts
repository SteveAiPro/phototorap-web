import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits } from '@/lib/credits';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn('[webhooks/stripe] Stripe or webhook secret is not configured.');
    return NextResponse.json(
      { error: 'Stripe webhook is not configured' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('[webhooks/stripe] Signature verification failed:', err?.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message}` },
      { status: 400 }
    );
  }

  // 处理支付完成事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id || session.metadata?.userId;
      const credits = Number(session.metadata?.credits);

      if (!userId || !credits || isNaN(credits) || credits <= 0) {
        console.error(
          `[webhooks/stripe] Missing or invalid userId (${userId}) or credits (${credits}) for session ${session.id}`
        );
        return NextResponse.json({ received: true });
      }

      const admin = getSupabaseAdmin();
      if (!admin) {
        console.error('[webhooks/stripe] Supabase admin client not available');
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 500 }
        );
      }

      // 幂等性防护：检查是否已为该 session 加过点数
      const { data: existingTx } = await admin
        .from('credit_transactions')
        .select('id')
        .eq('ref_id', session.id)
        .maybeSingle();

      if (existingTx) {
        console.log(
          `[webhooks/stripe] Session ${session.id} already processed. Skipping duplicate grant.`
        );
        return NextResponse.json({ received: true });
      }

      const success = await addCredits(
        userId,
        credits,
        'purchase',
        session.id,
        `Stripe Checkout: ${session.id}`
      );

      if (success) {
        console.log(
          `[webhooks/stripe] Successfully added ${credits} credits to user ${userId} for session ${session.id}`
        );
      } else {
        console.error(
          `[webhooks/stripe] Failed to add ${credits} credits to user ${userId}`
        );
        return NextResponse.json(
          { error: 'Failed to update credits' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
