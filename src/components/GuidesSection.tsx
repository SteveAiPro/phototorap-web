'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { GUIDES } from '@/data/guides';

export default function GuidesSection() {
  return (
    <section className="border-t border-[#222533] bg-[#0A0C12] py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header exact match to mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Guides
            </h2>
            <Sparkles className="h-4 w-4 text-[#FF6A00]" />
            <span className="text-xs text-gray-400 ml-1 hidden sm:inline">
              Learn the tricks behind the most viral AI rap videos.
            </span>
          </div>

          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6A00] hover:underline"
          >
            <span>View all guides</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Featured Guides exactly matching mockup cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#222533] bg-[#12141C] p-4 hover:border-[#FF6A00]/60 transition-all duration-300"
            >
              {/* Image banner with badge */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black mb-4">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FF6A00] backdrop-blur-md">
                  {guide.tag}
                </span>
              </div>

              {/* Title & read time */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#FF6A00] transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#222533] pt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{guide.readTime}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#FF6A00] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
