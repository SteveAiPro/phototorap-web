import React from 'react';
import EffectPage, { EffectConfig } from '@/components/EffectPage';

export const metadata = {
  title: 'Birthday Rap Song Generator: A Personal Rap Video Gift | PhotoToRap AI',
  description:
    'Make a personalized birthday rap song as a video: upload photos of you and the birthday star, add one line about them, and get a lip-synced duo rap in about 3 minutes.',
  alternates: {
    canonical: 'https://phototorap.com/birthday-rap-song',
  },
};

const config: EffectConfig = {
  badge: 'A BIRTHDAY GIFT THEY WILL ACTUALLY KEEP',
  h1Top: 'Birthday Rap Song',
  h1Accent: 'Generator',
  intro:
    'Skip the generic birthday card. Upload a photo of you and a photo of the birthday star, write one line about them, and get a personalized birthday rap song performed by the two of you in a lip-synced video, ready to send or post.',
  bullets: [
    'Lyrics written about the birthday person, by name and story',
    'You perform it together, even if you live in different cities',
    'Ready in about 3 minutes, vertical MP4 for chat and socials',
  ],
  defaultStage: 'hotel-lobby',
  defaultOccasion: 'birthday',
  aboutTitle: 'Why a birthday rap song works as a gift',
  about: [
    'Group chats forget birthday messages in a day. A video of the two of you trading verses about the birthday person does not get forgotten: it gets replayed, forwarded to family and posted on their story. The generator writes original birthday bars around the details you give it, so the song is about them, not a template with a name swapped in.',
    'Topics that land well: how you met, the trip you still talk about, the habit everyone teases them for, or the milestone they just hit ("turns 30, still owes me a burger from 2019"). One line of up to 120 characters is enough for the writer to build a full song.',
    'Pick the orange Hotel Lobby stage for the viral look, or the Studio Booth for a cleaner performance. Only use photos of people who are happy to appear, and keep roasts friendly: it is a birthday, not a diss track.',
  ],
  faqs: [
    {
      q: 'How personalized is the birthday rap song?',
      a: 'The lyrics are generated from your topic line, so names, stories and inside jokes you include end up in the bars. Add the detail you most want them to hear.',
    },
    {
      q: 'Can I make one if we are in different cities?',
      a: 'Yes. Each person only needs one clear photo. Upload one of each of you and the generator puts you on stage together.',
    },
    {
      q: 'How much does a birthday rap video cost?',
      a: 'Watch the free preview first. One full song with HD export is $9.99, and 5-song packs at $29 work well if several birthdays are coming up.',
    },
    {
      q: 'How long does it take?',
      a: 'About 3 minutes from upload to a finished vertical MP4 you can send in a chat or post to TikTok, Reels or Shorts.',
    },
  ],
  related: [
    { href: '/ai-rap-generator', label: 'AI Rap Generator' },
    { href: '/hotel-lobby-ai', label: 'Hotel Lobby AI' },
    { href: '/ai-rap-battle-generator', label: 'AI Rap Battle Generator' },
    { href: '/guides/rap-songs-about-friends', label: 'Guide: Rap Songs About Friends' },
  ],
};

export default function BirthdayRapSongPage() {
  return <EffectPage config={config} />;
}
