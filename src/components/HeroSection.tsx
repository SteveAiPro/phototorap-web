'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import GeneratorCard from '@/components/GeneratorCard';
import SoundPreviews from '@/components/SoundPreviews';
import { Flame, Star, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 bg-radial-gradient">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FF6A00]/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: 标题导引 + 2x2 四宫格视频 */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[#222533] bg-[#12141C]/80 p-5 sm:p-7 shadow-2xl backdrop-blur-sm">
            <div>
              {/* Trending Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#222533] bg-[#0A0C13] p-1 pr-3 text-xs text-gray-300 mb-4">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img className="inline-block h-5 w-5 rounded-full object-cover object-top ring-1 ring-black" src="/examples/friends.jpg" alt="" />
                  <img className="inline-block h-5 w-5 rounded-full object-cover object-top ring-1 ring-black" src="/examples/couple.jpg" alt="" />
                  <img className="inline-block h-5 w-5 rounded-full object-cover object-top ring-1 ring-black" src="/examples/grandpas.jpg" alt="" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse"></span>
                  <span className="font-bold text-white text-[11px] sm:text-xs">{t.hero.badge}</span>
                </div>
              </div>

              {/* H1 Heading */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.08]">
                {t.hero.title1} <span className="text-[#FF6A00]">{t.hero.title2}</span> {t.hero.title3}
              </h1>

              {/* Subtitle */}
              <p className="mt-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Section Divider & Tip */}
              <div className="my-4 flex items-center justify-between border-t border-[#1F2230] pt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>Every video starts from 2 photos</span>
                </span>
                <span className="text-[11px] text-gray-500">
                  Tap speaker to unmute
                </span>
              </div>
            </div>

            {/* 2x2 四宫格 */}
            <div className="w-full flex-1 flex flex-col justify-center">
              <SoundPreviews />
            </div>

            {/* Bottom rating footer */}
            <div className="mt-4 pt-3 border-t border-[#1F2230] flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center text-amber-400 text-xs">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3 w-3 fill-current" />
                ))}
                <span className="ml-1.5 font-bold text-white">4.9/5</span>
                <span className="text-gray-500 ml-1 text-[11px]">(1.2M+ created)</span>
              </div>
              <span className="text-[11px] text-[#FF6A00] font-mono">100% Free Preview</span>
            </div>
          </div>

          {/* Right Column: 4-Step Generator Card */}
          <div className="lg:col-span-6 w-full flex">
            <GeneratorCard />
          </div>
        </div>
      </div>
    </section>
  );
}
