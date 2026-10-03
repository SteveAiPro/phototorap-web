import React from 'react';
import Navbar from '@/components/Navbar';
import GeneratorCard from '@/components/GeneratorCard';
import Footer from '@/components/Footer';
import { Flame, Check, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Hotel Lobby AI Rap Video Generator | PhotoToRap AI',
  description: 'Create the viral Hotel Lobby COLORS booth rap video with two photos. Lip-synced Quavo & Takeoff style duo video ready in 3 minutes.',
  alternates: {
    canonical: 'https://phototorap.com/hotel-lobby-ai',
  },
};

export default function HotelLobbyPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00] mb-4">
              <Flame className="h-4 w-4" />
              <span>THE VIRAL QUAVO & TAKEOFF ORANGE BOOTH</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Hotel Lobby AI <span className="text-[#FF6A00]">Rap Generator</span>
            </h1>
            <p className="mt-4 text-base text-gray-300 leading-relaxed">
              Step into the famous orange COLORS stage. Upload one photo of you and one photo of your friend, and AI renders your customized Hotel Lobby rap duo performance.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-2 text-white">
                <Check className="h-4 w-4 text-[#FF6A00]" /> Authentic orange monochrome booth aesthetics
              </span>
              <span className="flex items-center gap-2 text-white">
                <Check className="h-4 w-4 text-[#FF6A00]" /> High quality 142 BPM hip-hop 808 beat
              </span>
              <span className="flex items-center gap-2 text-white">
                <Check className="h-4 w-4 text-[#FF6A00]" /> Vertical 9:16 format ready for TikTok & Reels
              </span>
            </div>
          </div>
          <div className="lg:col-span-6">
            <GeneratorCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
