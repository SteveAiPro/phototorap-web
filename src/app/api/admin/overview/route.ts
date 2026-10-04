import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const { data: rawVideos, error: vidError } = await admin
      .from('video_generations')
      .select('id, user_id, stage, audio_beat, lyrics_topic, status, video_url, cost_credits, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    // 尝试拉取 user_uploads 目录中的真实照片，作为历史老记录的智能时间窗口关联
    let storagePhotos: any[] = [];
    try {
      const { data: photoList } = await admin.storage
        .from('uploads')
        .list('user_uploads', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });
      if (photoList && photoList.length > 0) {
        storagePhotos = photoList.map((p) => ({
          name: p.name,
          created_at: p.created_at,
          url: admin.storage.from('uploads').getPublicUrl(`user_uploads/${p.name}`).data.publicUrl,
          time: p.created_at ? new Date(p.created_at).getTime() : 0,
        }));
      }
    } catch (e) {
      console.warn('[api/admin/overview] Failed to list storage photos:', e);
    }

    const videos = (rawVideos || []).map((v) => {
      let parsedTopic = v.lyrics_topic || 'Custom Freestyle';
      let photo1: string | null = null;
      let photo2: string | null = null;

      if (v.lyrics_topic && v.lyrics_topic.startsWith('{')) {
        try {
          const parsed = JSON.parse(v.lyrics_topic);
          parsedTopic = parsed.topic || 'Custom Freestyle';
          photo1 = parsed.photo1 || null;
          photo2 = parsed.photo2 || null;
        } catch {}
      }

      // 如果历史老记录未直接存 photo1/photo2，则通过时间戳在 storagePhotos 中匹配生成前 15 分钟内的图片
      if (!photo1 && storagePhotos.length > 0) {
        const vTime = new Date(v.created_at).getTime();
        const matched = storagePhotos.filter(
          (p) => p.time <= vTime + 60000 && vTime - p.time <= 15 * 60 * 1000
        );
        if (matched.length > 0) {
          photo1 = matched[0].url;
          if (matched.length > 1) {
            photo2 = matched[1].url;
          }
        }
      }

      return {
        ...v,
        lyrics_topic: parsedTopic,
        photo1,
        photo2,
      };
    });

    // 4. 统计汇总数据
    const totalUsers = users?.length || 0;
    const totalCreditsInCirculation = (users || []).reduce((acc, u) => acc + (u.credits || 0), 0);
    const totalPurchasedCredits = (transactions || [])
      .filter((t) => t.type === 'purchase' && t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const totalGeneratedVideos = (videos || []).length;

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('[api/admin/overview] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
