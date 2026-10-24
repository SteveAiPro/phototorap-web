import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'AI Rap Battle Generator: Roast Your Friend in a Video',
  description:
    'Turn two photos into a friendly AI rap battle: pick your opponent, write the roast topic, and watch both of you trade diss verses in a lip-synced cypher video.',
  openGraph: {
    title: 'AI Rap Battle Generator: Roast Your Friend in a Video',
    description:
      'Turn two photos into a friendly AI rap battle: pick your opponent, write the roast topic, and watch both of you trade diss verses in a lip-synced cypher video.',
    url: 'https://phototorap.com/ai-rap-battle-generator',
  },
  twitter: {
    title: 'AI Rap Battle Generator: Roast Your Friend in a Video',
    description:
      'Turn two photos into a friendly AI rap battle: pick your opponent, write the roast topic, and watch both of you trade diss verses in a lip-synced cypher video.',
  },
  alternates: {
    canonical: 'https://phototorap.com/ai-rap-battle-generator',
  },
};

const config: EffectConfig = {
  badge: 'FRIENDLY ROASTS ONLY',
  h1Top: 'AI Rap Battle',
  h1Accent: 'Generator',
  intro:
    'Pick your opponent and settle it on stage. Upload one photo of each battler, write the roast topic, and this AI rap battle generator renders a back-and-forth diss video in a street cypher setting, both of you lip-synced and trading verses.',
  bullets: [
    'Back-and-forth battle format, not a one-sided song',
    'Roast topics you control: habits, history, inside jokes',
    'Street Cypher stage preset for the battle look',
  ],
  defaultStage: 'street-cypher',
  defaultOccasion: 'friends',
  examples: [
    { src: '/examples/roast.mp4', poster: '/examples/roast.jpg', label: 'Friendly roast performance' },
    { src: '/examples/orange-street.mp4', poster: '/examples/orange-street.webp', label: 'Street stage duo' },
  ],
  aboutTitle: 'How to set up a good AI rap battle',
  about: [
    'A rap battle lives on specifics. "My friend is bad at cooking" is a weak topic; "burned pasta three times, still calls himself the group chef" gives the writer something to swing with. Enter one line about each battler, or the shared history you both laugh about, and the generator writes verses for both sides, so the battle feels even.',
    'Keep it friendly: the best roasts punch at habits, stories and legends, never at appearance, family or anything your opponent would not laugh at themselves. Only battle people who are in on the joke and happy to be in the video. The winner, as always, is decided by the group chat.',
    'The Street Cypher stage is preset for this page. If you want the battle in the orange Hotel Lobby booth instead, switch the stage inside the generator before you render.',
  ],
  faqs: [
    {
      q: 'Do both people get verses in the battle?',
      a: 'Yes. The video is a back-and-forth: both battlers perform their own diss verses, lip-synced to the generated track.',
    },
    {
      q: 'What makes a good roast topic?',
      a: 'One true, funny detail per person: a famous fail, a legendary habit, an old group-chat story. Specific beats generic every time.',
    },
    {
      q: 'Can I battle as a solo against myself?',
      a: 'You can upload two different photos of yourself and perform both sides of the battle.',
    },
    {
      q: 'How much does a rap battle video cost?',
      a: 'The free preview comes first. A full battle video is one song: $9.99 single, or cheaper per song in the 5-song pack at $29. A failed render is never charged.',
    },
  ],
  related: [
    { href: '/ai-rap-generator', label: 'AI Rap Generator' },
    { href: '/birthday-rap-song', label: 'Birthday Rap Song' },
    { href: '/hotel-lobby-ai', label: 'Hotel Lobby AI' },
    { href: '/guides/rap-battle-roasts', label: 'Guide: Rap Battle Roasts' },
  ],
};

export default function AiRapBattleGeneratorPage() {
  return <EffectPage config={config} />;
}
