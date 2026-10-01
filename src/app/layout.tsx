import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Photo to Rap: AI Rap Video Generator from Photos',
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
  openGraph: {
    title: 'Photo to Rap: AI Rap Video Generator from Photos',
    description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
    url: 'https://phototorap.com',
    siteName: 'PhotoToRap AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo to Rap: AI Rap Video Generator from Photos',
    description: 'Turn photos into viral AI rap videos in 3 minutes. Upload 1 or 2 selfies to get lip-synced rap duo & solo clips in Hotel Lobby style. Free preview.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090A0F] text-[#F3F4F6] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
