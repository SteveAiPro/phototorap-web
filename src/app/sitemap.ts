import { MetadataRoute } from 'next';
import { GUIDES } from '@/data/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://phototorap.com';
  const now = new Date();

  // ⚠️ 本站目前**没有语言路由** —— /zh /es /fr /pt /de /ja /ko 全部返回 404。
  // 多语言是客户端切换（见 src/data/translations.ts），不产生独立 URL。
  //
  // 因此这里既不能提交语言 URL，也不能声明 hreflang 替代版本：
  // 那等于向 Google 提交 404 页面 + 给出矛盾的 hreflang 信号。
  //
  // 实测证据（2026-10-11）：
  //   - 旧 sitemap 共 28 个 URL，其中 7 个是语言路由，curl 实测全部 404
  //   - GSC「网页索引编制」报告：/fr /ko /de 被判为「未找到 (404)」，
  //     /es /ja /pt 落入「已发现 - 尚未编入索引」（Google 从未抓取）
  //   - 首页 HTML 无任何 hreflang 标签，但 sitemap 却声明了 8 个语言替代版本
  //
  // 若日后实现真正的 i18n 路由（Next.js 多语言路由 + 每语言静态生成），
  // 再在此恢复语言 URL 与 alternates.languages，并在各页面加互指的 hreflang。

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hotel-lobby-ai`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-rap-generator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/birthday-rap-song`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ai-rap-battle-generator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ethics`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Guide detail pages
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes];
}
