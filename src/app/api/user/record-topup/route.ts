import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, credits, description } = body;

    if (!userId || !credits || isNaN(credits) || credits <= 0) {
      return NextResponse.json({ error: 'Invalid userId or credits' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    const ok = await addCredits(
      userId,
      Number(credits),
      'purchase',
      'waffo_' + Date.now(),
      description || `Waffo Package Top-Up (+${credits} Credits)`
    );

    if (!ok) {
      return NextResponse.json({ error: 'Failed to record credits' }, { status: 500 });
    }

    // 获取最新余额
    const { data: user } = await admin
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      balance: user?.credits ?? 0,
    });
  } catch (err: any) {
    console.error('[api/user/record-topup] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
