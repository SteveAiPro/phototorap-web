import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { planId, email } = await req.json();

    // Plan config: single ($9.99 / 10 cr), pack ($29 / 50 cr), sub ($29.90 / 100 cr)
    const plans: Record<string, { price: number; credits: number; name: string }> = {
      single: { price: 9.99, credits: 10, name: 'Single Track' },
      pack: { price: 29.00, credits: 50, name: 'Creator 5-Pack' },
      monthly: { price: 29.90, credits: 100, name: 'Pro Monthly' },
    };

    const selected = plans[planId] || plans.pack;

    // Simulate instant payment success or Stripe redirect URL
    return NextResponse.json({
      success: true,
      checkoutUrl: `/pricing/success?plan=${planId}&credits=${selected.credits}`,
      planName: selected.name,
      creditsAdded: selected.credits,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
