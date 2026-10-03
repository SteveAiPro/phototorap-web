import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Photo to Rap: Free AI Rap Video Generator from Photos Online',
  description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
  metadataBase: new URL('https://phototorap.com'),
  alternates: {
    canonical: 'https://phototorap.com',
    languages: {
      'en': 'https://phototorap.com',
      'zh': 'https://phototorap.com/zh',
      'es': 'https://phototorap.com/es',
      'fr': 'https://phototorap.com/fr',
      'pt': 'https://phototorap.com/pt',
      'de': 'https://phototorap.com/de',
      'ja': 'https://phototorap.com/ja',
      'ko': 'https://phototorap.com/ko',
      'x-default': 'https://phototorap.com',
    },
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
