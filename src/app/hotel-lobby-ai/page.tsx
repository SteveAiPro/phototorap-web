import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'Hotel Lobby AI Rap Video Generator | PhotoToRap AI',
  description:
    'Make the viral Hotel Lobby COLORS booth rap video from two photos. Lip-synced duo performance on an original beat, vertical 9:16, ready in about 3 minutes.',
  openGraph: {
    title: 'Hotel Lobby AI Rap Video Generator | PhotoToRap AI',
    description:
      'Make the viral Hotel Lobby COLORS booth rap video from two photos. Lip-synced duo performance on an original beat, vertical 9:16, ready in about 3 minutes.',
    url: 'https://phototorap.com/hotel-lobby-ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Lobby AI Rap Video Generator | PhotoToRap AI',
    description:
      'Make the viral Hotel Lobby COLORS booth rap video from two photos. Lip-synced duo performance on an original beat, vertical 9:16, ready in about 3 minutes.',
  },
  alternates: {
    canonical: 'https://phototorap.com/hotel-lobby-ai',
  },
};

const config: EffectConfig = {
  badge: 'THE VIRAL ORANGE COLORS BOOTH',
  h1Top: 'Hotel Lobby AI',
  h1Accent: 'Rap Generator',
  intro:
    'Step into the orange booth everyone is posting. Upload one photo of you and one of your friend, add a single line about the two of you, and the generator writes an original rap, produces the beat and renders both of you performing it lip-synced on a Hotel Lobby-style stage.',
  bullets: [
    'Two people, two photos, one duo performance',
    'Orange monochrome booth, 142 BPM hip-hop beat',
    'Original song, so nothing gets muted on TikTok or Reels',
    'Vertical 9:16 MP4, ready in about 3 minutes',
  ],
  defaultStage: 'hotel-lobby',
  defaultOccasion: 'friends',
  examples: [
    { src: '/examples/friends.mp4', poster: '/examples/friends.jpg', label: 'Best friends duo, Hotel Lobby stage' },
    { src: '/examples/roast.mp4', poster: '/examples/roast.jpg', label: 'Friendly roast performance' },
  ],
  aboutTitle: 'What the Hotel Lobby AI video actually is',
  about: [
    'The Hotel Lobby trend comes from the orange COLORS-style booth performance: two people side by side in monochrome orange light, trading verses straight to camera in one continuous shot. It travelled from hip-hop into TikTok, Reels and LinkedIn because the format is instantly recognisable and needs no explanation. This generator rebuilds that look around your own photos instead of someone else\'s clip.',
    'Add one clear, front-facing photo of each person (or one photo of the two of you together). Then write the topic in one line: a birthday, a friendship that goes back years, a friendly roast, a business launch. The lyrics are written around that line, so the rap is about your actual story rather than generic bars. Sunglasses, heavy filters and group shots where faces are small tend to hurt the render, so pick photos where both faces are large and well lit.',
    'The result is an original song on an original beat, performed by both of you, exported as a vertical 9:16 MP4. Because nothing is sampled, there is no third-party track for TikTok or Instagram to mute, and no real artist is impersonated. One video is $9.99, packs start at $29 for 5, and a render that fails is never charged. Only upload photos of people who agreed to appear in the video.',
  ],
  faqs: [
    {
      q: 'Do I need two photos or just one?',
      a: 'Either works. One photo of each person gives a duo where you trade verses back and forth; one photo of the two of you together also works. A single photo makes a solo performance on the same stage.',
    },
    {
      q: 'Does it use the original Hotel Lobby song?',
      a: 'No. The lyrics and the beat are generated from scratch for your video, so the track is original and will not be muted or taken down for copyright. PhotoToRap is not affiliated with, or endorsed by, the original artists.',
    },
    {
      q: 'How much does a Hotel Lobby AI video cost?',
      a: 'You can watch a free preview first and only pay when you like the result. A single full video is $9.99, packs start at $29 for 5 videos, and a failed render is never charged.',
    },
    {
      q: 'How long does the render take, and what format do I get?',
      a: 'A standard render takes about 3 minutes. You get a vertical 9:16 MP4 sized for TikTok, Reels and Shorts, with the length and resolution you picked before rendering.',
    },
    {
      q: 'Can I post it on TikTok, Reels or LinkedIn?',
      a: 'Yes. The song is original and the video is yours to post. Use photos of people who agreed to be in it, and skip celebrities or public figures.',
    },
  ],
  related: [
    { href: '/ai-rap-generator', label: 'AI Rap Generator' },
    { href: '/ai-rap-battle-generator', label: 'AI Rap Battle Generator' },
    { href: '/guides/how-to-do-the-hotel-lobby-trend', label: 'Guide: How to Do the Hotel Lobby Trend' },
    { href: '/guides/hotel-lobby-capcut-template', label: 'Guide: Hotel Lobby CapCut Template' },
    { href: '/guides/hotel-lobby-ai-apps', label: 'Guide: Hotel Lobby AI Apps Compared' },
  ],
};

export default function HotelLobbyPage() {
  return <EffectPage config={config} />;
}
