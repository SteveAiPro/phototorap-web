import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
    }

    // 1. 获取用户信息与当前积分
    const { data: user, error: userError } = await admin
      .from('users')
      .select('id, email, name, avatar, credits, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('[api/user/transactions] User lookup error:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. 获取积分交易流水明细 (credit_transactions)
    // 优先按 user_id 精准过滤，若遇 Supabase uuid 类型隐式转换则兼容内存过滤
    let userTransactions: any[] = [];
    const { data: txByEq, error: txError } = await admin
      .from('credit_transactions')
      .select('id, amount, type, description, ref_id, created_at, user_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (txByEq && txByEq.length > 1) {
      userTransactions = txByEq;
    } else {
      // 容错兜底：查询最近 100 条并在服务层准确匹配 user_id
      const { data: allTxs } = await admin
        .from('credit_transactions')
        .select('id, amount, type, description, ref_id, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(100);

      userTransactions = (allTxs || []).filter((t: any) => String(t.user_id).toLowerCase() === String(userId).toLowerCase());
    }

    // 3. 获取生成的视频任务历史 (video_generations)
    const { data: videos, error: videoError } = await admin
      .from('video_generations')
      .select('id, stage, audio_beat, lyrics_topic, status, video_url, cost_credits, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json(
      {
        success: true,
        user,
        transactions: userTransactions || [],
        videos: videos || [],
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('[api/user/transactions] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
