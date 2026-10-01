import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GUIDES } from '@/data/guides';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Rap Video Guides, Tutorials & Prompts | PhotoToRap AI',
  description: 'Master the viral Hotel Lobby rap trend. Step-by-step tutorials, 100+ funny rap lyric prompts, and expert settings for TikTok & Reels.',
};

export default function GuidesHub() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />

      <main className="py-16 px-4 sm:px-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF6A00] mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>AI RAP CREATOR KNOWLEDGE BASE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            Guides, Tutorials & Lyric Prompts
          </h1>
          <p className="mt-4 text-gray-400 text-base leading-relaxed">
            Everything you need to create viral AI rap videos: step-by-step breakdowns of the Hotel Lobby trend, hilarious lyric generators, and benchmark comparisons.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#222533] bg-[#12141C] hover:border-[#FF6A00]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6A00]/10"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-[#FF6A00] backdrop-blur-md">
                  {guide.category}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{guide.readTime}</span>
                  <span>•</span>
                  <span>{guide.tag}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-white group-hover:text-[#FF6A00] transition-colors line-clamp-2">
                  {guide.title}
                </h2>
                <p className="mt-2 text-xs text-gray-400 line-clamp-2 flex-1">
                  {guide.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#FF6A00]">
                  <span>Read full guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
