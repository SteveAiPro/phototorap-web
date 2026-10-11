import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 服务端读取当前请求的登录用户。
 *
 * 前端用的是 createBrowserClient（@supabase/ssr），会话存在 cookie 里，
 * 所以服务端能直接读到——这也是本文件能作为鉴权依据的前提。
 */

export interface SessionUser {
  id: string;
  email: string | null;
}

export interface SessionResult {
  ok: boolean;
  user?: SessionUser;
  status?: number;
  error?: string;
}

export async function getSessionUser(): Promise<SessionResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { ok: false, status: 500, error: 'Auth is not configured' };
  }

  try {
    const cookieStore = cookies();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // 只做身份校验，不需要回写会话 cookie
        setAll() {},
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { ok: false, status: 401, error: 'Sign in required' };
    }

    return { ok: true, user: { id: user.id, email: user.email ?? null } };
  } catch (err: any) {
    console.error('[session] getSessionUser failed:', err);
    return { ok: false, status: 500, error: 'Auth check failed' };
  }
}
