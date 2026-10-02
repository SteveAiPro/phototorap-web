import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    // 1. 全站用户列表
    const { data: users, error: userError } = await admin
      .from('users')
      .select('id, email, name, avatar, credits, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // 2. 全站积分流水记录 (最近 100 条)
    const { data: transactions, error: txError } = await admin
      .from('credit_transactions')
      .select('id, user_id, amount, type, description, ref_id, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    // 3. 全站视频生成任务历史 (最近 100 条)
    const { data: videos, error: vidError } = await admin
      .from('video_generations')
      .select('id, user_id, stage, audio_beat, lyrics_topic, status, video_url, cost_credits, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    // 4. 统计汇总数据
    const totalUsers = users?.length || 0;
    const totalCreditsInCirculation = (users || []).reduce((acc, u) => acc + (u.credits || 0), 0);
    const totalPurchasedCredits = (transactions || [])
      .filter((t) => t.type === 'purchase' && t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const totalGeneratedVideos = (videos || []).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCreditsInCirculation,
        totalPurchasedCredits,
        totalGeneratedVideos,
      },
      users: users || [],
      transactions: transactions || [],
      videos: videos || [],
    });
  } catch (err: any) {
    console.error('[api/admin/overview] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
