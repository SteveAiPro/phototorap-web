/** @type {import('next').NextConfig} */
const nextConfig = {
  // 遗留 URL 301 重定向（2026-10-24 依据 GSC「网页索引编制」报告添加）
  //
  // 背景：本站没有语言路由（多语言为客户端切换，不产生独立 URL），
  // 但 2026-10 初的旧版 sitemap 曾提交过 /zh /es /fr /pt /de /ja /ko，
  // 且旧版站点结构下 www 曾直接服务内容，导致 Google 发现了大量死链。
  // GSC 实测（2026-10-24）：7 个 URL 处于「未找到 (404)」状态。
  // 用 301 把这些历史信号收敛到活页面，而不是让它们继续 404 消耗抓取配额。
  async redirects() {
    return [
      // —— 1. 语言路由死链 → 英文首页（本站无 i18n 路由）——
      ...['zh', 'es', 'fr', 'pt', 'de', 'ja', 'ko', 'en'].map((lang) => ({
        source: `/${lang}`,
        destination: '/',
        permanent: true,
      })),
      {
        source: '/:lang(zh|es|fr|pt|de|ja|ko|en)/:path*',
        destination: '/:path*',
        permanent: true,
      },

      // —— 2. 改名前的旧 guide 链接 → 现存 guide（301 传递权重）——
      {
        source: '/guides/best-ai-rap-video-generators',
        destination: '/guides/best-ai-music-video-generators',
        permanent: true,
      },
      {
        source: '/guides/funny-rap-lyrics-and-prompts',
        destination: '/guides/funny-rap-lyrics',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
