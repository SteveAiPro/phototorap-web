import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'Halloween Rap Song Generator: A Spooky Video of You',
  description:
    'Make a personalized Halloween rap song video: upload your photos, drop in your costume or party theme, and get a lip-synced spooky rap in about 3 minutes.',
  openGraph: {
    title: 'Halloween Rap Song Generator: A Spooky Video of You',
    description:
      'Make a personalized Halloween rap song video: upload your photos, drop in your costume or party theme, and get a lip-synced spooky rap in about 3 minutes.',
    url: 'https://phototorap.com/halloween-rap-song',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halloween Rap Song Generator: A Spooky Video of You',
    description:
      'Make a personalized Halloween rap song video: upload your photos, drop in your costume or party theme, and get a lip-synced spooky rap in about 3 minutes.',
  },
  alternates: {
    canonical: 'https://phototorap.com/halloween-rap-song',
  },
};

const config: EffectConfig = {
  badge: 'THE HALLOWEEN PARTY TRICK PEOPLE REPLAY',
  h1Top: 'Halloween Rap Song',
  h1Accent: 'Generator',
  intro:
    'Costumes get one night. A rap video of you and your crew spitting Halloween bars gets replayed all season. Upload your photos, type your costume or party theme, and get a lip-synced spooky rap video in about 3 minutes — ready for the group chat or TikTok.',
  bullets: [
    'Lyrics built around your costume, party theme or crew inside joke',
    'You and your friends perform it together, costumes on, from your photos',
    'Ready in about 3 minutes, vertical MP4 for TikTok, Reels and Shorts',
  ],
  defaultStage: 'hotel-lobby',
  // 注意：generator 的 occasion 只有 birthday/anniversary/friends/business 四档，
  // 这里传 'halloween' 表示不预选任何 chip，用户在 topic 输入框里写万圣节主题；
  // topic 字段是自由文本（topicInput || selectedOccasion），后端按 topic 写词，无需改后端。
  defaultOccasion: 'halloween',
  examples: [
    { src: '/examples/neon-elevator.mp4', poster: '/examples/neon-elevator.webp', label: 'Neon stage performance' },
    { src: '/examples/orange-street.mp4', poster: '/examples/orange-street.webp', label: 'Street stage duo' },
  ],
  aboutTitle: 'Why a Halloween rap video works',
  about: [
    'Halloween content has a brutal half-life: party photos are forgotten by November 1st. A video of the two of you trading verses about the costume contest, the haunted house trip, or the friend who refuses to dress up every year gets forwarded, duetted and rewatched. The generator writes original Halloween bars around the topic line you give it — name the theme and the crew, and the song is about your night, not a generic spooky template.',
    'Topics that land well: the costume you actually wore, the party you are throwing, the office Halloween contest, or a light roast of the crew. One line is enough for the writer to build a full song. Keep it spooky, not mean.',
    'Pick the Hotel Lobby stage for the viral look, or the Studio Booth for a cleaner performance. Only use photos of people who are happy to appear — and grab the costume photos before the makeup comes off.',
  ],
  faqs: [
    {
      q: 'Do I need a Halloween costume photo?',
      a: 'No. Any clear photo works — the rap is written about the theme you type in. A costume photo just makes the video funnier.',
    },
    {
      q: 'What should I write in the topic line?',
      a: 'Your costume, your party theme, or the crew joke: e.g. "vampire couple crashing the office Halloween party" or "roast of Mike who never dresses up". One line is enough.',
    },
    {
      q: 'How much does a Halloween rap video cost?',
      a: 'Watch the free preview first. One full song with HD export is $9.99, and 5-song packs at $29 work well if the whole crew wants one.',
    },
    {
      q: 'How long does it take?',
      a: 'About 3 minutes from upload to a finished vertical MP4 you can send in a chat or post to TikTok, Reels or Shorts.',
    },
  ],
  related: [
    { href: '/ai-rap-generator', label: 'AI Rap Generator' },
    { href: '/hotel-lobby-ai', label: 'Hotel Lobby AI' },
    { href: '/birthday-rap-song', label: 'Birthday Rap Song Generator' },
    { href: '/guides/rap-songs-about-friends', label: 'Guide: Rap Songs About Friends' },
  ],
};

export default function HalloweenRapSongPage() {
  return <EffectPage config={config} />;
}
