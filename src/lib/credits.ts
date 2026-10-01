import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface UserCredits {
  credits: number;
}

/**
 * 获取用户当前积分
 */
export async function getCredits(userId: string): Promise<number> {
  const admin = getSupabaseAdmin();
  if (!admin) return 0;
  const { data, error } = await admin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !data) return 0;
  return (data.credits as number) ?? 0;
}

/**
 * 扣减用户积分并记录流水（支持使用已部署的 PostgreSQL 函数 deduct_credits）
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description: string = 'Rap Video Generation'
): Promise<number | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  // 1. 优先尝试调用 Postgres atomic RPC deduct_credits
  const { data: rpcCredits, error: rpcError } = await admin.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_desc: description,
  });

  if (!rpcError && typeof rpcCredits === 'number') {
    return rpcCredits;
  }

  // 2. 备用事务原子更新
  const current = await getCredits(userId);
  if (current < amount) return null;

  const newCredits = current - amount;
  const { error: updateError } = await admin
    .from('users')
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (updateError) return null;

  await admin.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'generation',
    description,
  });

  return newCredits;
}

/**
 * 增加积分并记录流水（例如 Stripe 充值购买、系统赠送）
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'signup' | 'daily' | 'purchase' | 'refund' = 'purchase',
  refId?: string,
  description: string = 'Stripe Credit Purchase'
): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const { data: user, error: uerr } = await admin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (uerr || !user) return false;

  const newBalance = ((user.credits as number) ?? 0) + amount;

  const { error: uerr2 } = await admin
    .from('users')
    .update({ credits: newBalance, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (uerr2) return false;

  const { error: terr } = await admin.from('credit_transactions').insert({
    user_id: userId,
    amount,
    type,
    description,
    ref_id: refId,
  });

  if (terr) {
    console.warn('[credits] Warning: failed to insert credit transaction record', terr);
  }

  return true;
}
