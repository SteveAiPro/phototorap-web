import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits, deductCredits } from '@/lib/credits';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 鉴权前置：本接口能任意增减用户积分（等于凭空造钱），必须确认调用者是管理员。
    const guard = await requireAdmin();
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status || 403 });
    }

    const body = await req.json();
    const { userId, amount, reason } = body;

    if (!userId || typeof amount !== 'number' || amount === 0) {
      return NextResponse.json({ error: 'Valid userId and non-zero amount are required' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    if (amount > 0) {
      const ok = await addCredits(userId, amount, 'purchase', 'ADMIN_MANUAL_GRANT', reason || 'Admin Manual Credit Grant');
      if (!ok) {
        return NextResponse.json({ error: 'Failed to grant credits' }, { status: 500 });
      }
    } else {
      const remaining = await deductCredits(userId, Math.abs(amount), reason || 'Admin Manual Credit Deduction');
      if (remaining === null) {
        return NextResponse.json({ error: 'Failed to deduct credits or insufficient balance' }, { status: 400 });
      }
    }

    const { data: updatedUser } = await admin
      .from('users')
      .select('id, email, name, credits')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (err: any) {
    console.error('[api/admin/adjust-credits] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
