import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'Diss Track Generator: Make a Friendly Diss Rap Video | PhotoToRap AI',
  description:
    'Turn a photo and one roast topic into a diss track video: original diss bars about your friend, performed lip-synced in about 3 minutes. Friendly roasts only.',
  openGraph: {
    title: 'Diss Track Generator: Make a Friendly Diss Rap Video | PhotoToRap AI',
    description:
      'Turn a photo and one roast topic into a diss track video: original diss bars about your friend, performed lip-synced in about 3 minutes. Friendly roasts only.',
    url: 'https://phototorap.com/diss-track-generator',
  },
  twitter: {
    title: 'Diss Track Generator: Make a Friendly Diss Rap Video | PhotoToRap AI',
    description:
      'Turn a photo and one roast topic into a diss track video: original diss bars about your friend, performed lip-synced in about 3 minutes. Friendly roasts only.',
  },
  alternates: {
    canonical: 'https://phototorap.com/diss-track-generator',
  },
};

const config: EffectConfig = {
  badge: 'ONE TARGET, ONE TOPIC',
  h1Top: 'Diss Track',
  h1Accent: 'Generator',
  intro:
    'Write one line about your target and this diss track generator turns it into original diss bars, performed by you in a lip-synced rap video. Built for friendly roasts between friends who are in on the joke.',
  bullets: [
    'Diss bars written from your topic line, not a template',
    'Solo performance, or bring the target in for a duo',
    'Clean by default: habits and legends, never cruelty',
  ],
  defaultStage: 'street-cypher',
  defaultOccasion: 'friends',
  aboutTitle: 'What makes a diss track land',
  about: [
    'Specificity is the whole weapon. "You are bad at FIFA" is forgettable; "lost 7-0, blamed the controller, bought a new controller, lost 6-0" is a verse. Give the generator one true story or legendary habit in the topic line and it will build the diss around it: the setup, the evidence, the punchline on the last word of the bar.',
    'A diss track here is a roast with a beat, not harassment. Only diss friends who would laugh, keep it off appearance, family and anything personal, and never impersonate a real artist. If your target can watch it in the group chat and laugh, you have the tone right.',
    'Want an answer track? Send them the video and let them respond with the AI rap battle generator, where both sides get verses.',
  ],
  faqs: [
    {
      q: 'What is a diss track generator?',
      a: 'A tool that writes and performs a diss track for you: you supply a photo and a roast topic, and it generates original diss lyrics, a beat and a lip-synced performance video.',
    },
    {
      q: 'Can the diss be about a specific story?',
      a: 'Yes, and it should be. Put the story in the topic line (up to 120 characters) and the bars will be built around your details.',
    },
    {
      q: 'Is it okay to diss a real celebrity or artist?',
      a: 'No. Only use photos of people who agreed to be in the video, and keep targets to friends who are in on the joke.',
    },
    {
      q: 'How much does a diss track video cost?',
      a: 'Watch the free preview first. One full video is $9.99, 5-song packs are $29, and a failed render is never charged.',
    },
  ],
  related: [
    { href: '/ai-rap-battle-generator', label: 'AI Rap Battle Generator' },
    { href: '/ai-rap-generator', label: 'AI Rap Generator' },
    { href: '/hotel-lobby-ai', label: 'Hotel Lobby AI' },
    { href: '/guides/how-to-make-a-diss-track', label: 'Guide: How to Make a Diss Track' },
  ],
};

export default function DissTrackGeneratorPage() {
  return <EffectPage config={config} />;
}
