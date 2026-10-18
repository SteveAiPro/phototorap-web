import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Photo to Rap: Free AI Rap Video Generator from Photos Online',
  description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
  metadataBase: new URL('https://phototorap.com'),
  alternates: {
    canonical: 'https://phototorap.com',
    // 注意：本站没有语言路由（多语言为客户端切换，不产生独立 URL），
    // /zh /es /fr /pt /de /ja /ko 全部返回 404，因此不能声明 hreflang 替代版本。
    // 与 src/app/sitemap.ts 中的处理保持一致；日后实现真正的 i18n 路由后再恢复。
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Photo to Rap: Free AI Rap Video Generator from Photos Online',
    description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
    url: 'https://phototorap.com',
    siteName: 'PhotoToRap AI',
    images: [
      {
        url: 'https://phototorap.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Photo to Rap AI Video Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo to Rap: Free AI Rap Video Generator from Photos Online',
    description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
    images: ['https://phototorap.com/og-image.png'],
  },
  verification: {
    google: '39LvT32JAXqHe6XN0UfzabaOvk5DgT6L2MJXTsZfwWs',
    other: {
      'waffo-verify': '97cd1b4f3e87735c2dc04992075224e5',
      // Bing 验证未完成前不要输出 msvalidate.01 占位值（假验证码对收录无益）。
      // 在 Bing Webmaster Tools 验证时，把真实验证码以 'msvalidate.01': '<code>' 加回这里，
      // 或改用 public/BingSiteAuth.xml 文件方式（二选一即可）。
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-5W3BLVCZPB';

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Plausible Analytics for phototorap.com */}
        <script
          defer
          data-domain="phototorap.com"
          src="https://plausible.io/js/script.js"
        />

        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-[#090A0F] text-[#F3F4F6] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
