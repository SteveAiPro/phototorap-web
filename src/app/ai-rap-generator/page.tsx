import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'AI Rap Generator: Make a Rap Video from Your Photos',
  description:
    'Turn 1 or 2 photos into an original, lip-synced AI rap video in about 3 minutes. Pick a stage, add a topic, and get a vertical MP4 ready for TikTok and Reels.',
  openGraph: {
    title: 'AI Rap Generator: Make a Rap Video from Your Photos',
    description:
      'Turn 1 or 2 photos into an original, lip-synced AI rap video in about 3 minutes. Pick a stage, add a topic, and get a vertical MP4 ready for TikTok and Reels.',
    url: 'https://phototorap.com/ai-rap-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Rap Generator: Make a Rap Video from Your Photos',
    description:
      'Turn 1 or 2 photos into an original, lip-synced AI rap video in about 3 minutes. Pick a stage, add a topic, and get a vertical MP4 ready for TikTok and Reels.',
  },
  alternates: {
    canonical: 'https://phototorap.com/ai-rap-generator',
  },
};

const config: EffectConfig = {
  badge: 'AI RAP GENERATOR FROM PHOTOS',
  h1Top: 'AI Rap',
  h1Accent: 'Generator',
  intro:
    'Upload one photo of yourself, or one of you and a friend, and this AI rap generator writes an original song about your topic, then renders both of you performing it, lip-synced, on a virtual stage. No mic, no studio, no prompt writing.',
  bullets: [
    'Original lyrics and beat, written around your topic',
    'Solo or duo performances from 1 or 2 photos',
    'Vertical 9:16 MP4, ready for TikTok, Reels and Shorts',
  ],
  defaultStage: 'studio-booth',
  defaultOccasion: 'friends',
  examples: [
    { src: '/examples/friends.mp4', poster: '/examples/friends.jpg', label: 'Best friends duo, Hotel Lobby stage' },
    { src: '/examples/couple.mp4', poster: '/examples/couple.jpg', label: 'Couple duo performance' },
  ],
  aboutTitle: 'How this AI rap generator works',
  about: [
    'Most AI music tools stop at audio. PhotoToRap goes one step further: it starts from your photos, so the finished rap is a video of you performing, not just a track with your name on it. Add one clear photo for a solo performance, or one photo of each person for a duo where you trade verses back and forth.',
    'You pick the stage (Hotel Lobby booth, Luxury Lobby, Studio Booth or Street Cypher), choose an occasion or type your own topic in up to 120 characters, and the generator writes the bars, produces the beat and renders the performance. A standard render takes about 3 minutes and a failed render is never charged.',
    'Because every song is generated from scratch, there is no copyrighted track in your video: nothing for TikTok or Instagram to mute, and no real artist is impersonated. Only use photos of people who agreed to be in the video.',
  ],
  faqs: [
    {
      q: 'Is this AI rap generator free to try?',
      a: 'Yes. You can watch a free preview of your video first and only pay when you love the result. A single full song is $9.99, packs start at $29 for 5 songs, and there is an optional monthly plan.',
    },
    {
      q: 'Can two people rap together in one video?',
      a: 'Yes. Upload one photo of each person, or one photo of the two of you together, and the generator renders a duo performance where you trade verses.',
    },
    {
      q: 'What topic should I enter?',
      a: 'One specific line works best: a birthday, a friendship story, a friendly roast or your business. The more concrete the detail, the better the lyrics land.',
    },
    {
      q: 'Which AI model renders the video?',
      a: 'You choose the model before rendering, from Seedance 2.0 Mini up to Seedance 2.5, along with resolution and length. The credit price is shown before you render.',
    },
  ],
  related: [
    { href: '/hotel-lobby-ai', label: 'Hotel Lobby AI' },
    { href: '/birthday-rap-song', label: 'Birthday Rap Song' },
    { href: '/ai-rap-battle-generator', label: 'AI Rap Battle Generator' },
    { href: '/guides/best-ai-rap-generator', label: 'Guide: Best AI Rap Generators' },
  ],
};

export default function AiRapGeneratorPage() {
  return <EffectPage config={config} />;
}
