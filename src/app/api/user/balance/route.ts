import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * 返回**当前登录用户自己**的积分余额。
 *
 * 存在意义：支付成功回跳后，前端需要把余额刷新成服务端（webhook 已写入）的真实值。
 * 此前前端走的是 `POST /api/user/record-topup`——那条路接受客户端传来的积分数且无鉴权，
 * 等于任何人都能凭空造积分。现在发放只能由已验签的 webhook 完成，前端只负责读回余额。
 */
export async function GET() {
  const session = await getSessionUser();
  if (!session.ok || !session.user) {
    return NextResponse.json({ error: session.error }, { status: session.status || 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
  }

  const { data, error } = await admin
    .from('users')
    .select('credits')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('[api/user/balance] Lookup failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, credits: data?.credits ?? 0 },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
