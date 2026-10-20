import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Cake, Swords, Skull, Type, Ghost } from 'lucide-react';

const GENERATORS = [
  {
    href: '/hotel-lobby-ai',
    icon: Flame,
    title: 'Hotel Lobby AI',
    desc: 'The viral orange booth duo performance',
  },
  {
    href: '/ai-rap-generator',
    icon: Sparkles,
    title: 'AI Rap Generator',
    desc: 'Any topic, solo or duo, from your photos',
  },
  {
    href: '/birthday-rap-song',
    icon: Cake,
    title: 'Birthday Rap Song',
    desc: 'A personalized rap video birthday gift',
  },
  {
    // 季节性卡片：万圣节过后（11 月初）撤掉这一张，/halloween-rap-song 页面保留为常青页
    href: '/halloween-rap-song',
    icon: Ghost,
    title: 'Halloween Rap Song',
    desc: 'A spooky rap video of you and your crew',
  },
  {
    href: '/ai-rap-battle-generator',
    icon: Swords,
    title: 'AI Rap Battle',
    desc: 'Roast your friend in a back-and-forth battle',
  },
  {
    href: '/diss-track-generator',
    icon: Skull,
    title: 'Diss Track Generator',
    desc: 'One target, one topic, a clean diss video',
  },
  {
    href: '/rap-duo-name-generator',
    icon: Type,
    title: 'Rap Duo Name Generator',
    desc: 'Find a stage name for your duo, free',
  },
];

export default function GeneratorsStrip() {
  return (
    <section className="border-t border-[#222533] bg-[#090A0F] py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-extrabold text-white">
            Pick your generator
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            One photo or two, three minutes, a rap video that is actually about you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENERATORS.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded-2xl border border-[#222533] bg-[#12141C] p-5 hover:border-[#FF6A00] transition-colors"
            >
              <g.icon className="h-6 w-6 text-[#FF6A00] mb-3" />
              <div className="font-display text-base font-bold text-white group-hover:text-[#FF6A00]">
                {g.title}
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
