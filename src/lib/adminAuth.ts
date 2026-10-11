import { getSessionUser } from './session';

/**
 * 管理后台访问守卫。
 *
 * ⚠️ 背景（2026-10-11 发现并修复）：`/api/admin/overview` 与 `/api/admin/adjust-credits`
 * 此前**完全没有鉴权**，任何未登录访客都能：
 *   1. 读取全部用户列表（含 email）、积分流水、生成记录与用户照片（实测 74 条用户数据裸奔）
 *   2. POST 给自己无限加积分
 * 前端页面是否有门禁毫无意义——接口裸奔等于后台裸奔。
 *
 * 判定方式：ADMIN_EMAILS 环境变量（逗号分隔的邮箱白名单）。
 * 之所以不用 users.role 字段，是因为 users 表当前没有该列，加列需要改 schema；
 * 白名单无需迁移、随时可改、且天然 fail-closed。
 *
 * ⚠️ 失败即拒绝（fail closed）：ADMIN_EMAILS 未配置时返回 503，**不是**放行。
 * 宁可把自己挡在外面，也不能因为"忘了配"变成人人都是管理员。
 */

export interface AdminGuardResult {
  ok: boolean;
  email?: string;
  status?: number;
  error?: string;
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** 该邮箱是否在管理员白名单内。 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

/**
 * 校验当前请求是否来自已登录的管理员。
 * 调用方拿到 !ok 时应直接返回对应 status，不要继续执行业务逻辑。
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const allowed = getAdminEmails();
  if (allowed.length === 0) {
    console.error(
      '[adminAuth] ADMIN_EMAILS is empty — all admin access is denied. ' +
        'Set it in Vercel → Settings → Environment Variables (comma-separated emails).'
    );
    return { ok: false, status: 503, error: 'Admin access is not configured' };
  }

  const session = await getSessionUser();
  if (!session.ok || !session.user) {
    return { ok: false, status: session.status || 401, error: session.error };
  }

  const email = session.user.email;
  if (!email || !allowed.includes(email.toLowerCase())) {
    console.warn('[adminAuth] Non-admin account attempted admin access:', email);
    return { ok: false, status: 403, error: 'This account is not an administrator' };
  }

  return { ok: true, email };
}
