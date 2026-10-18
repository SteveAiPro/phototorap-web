import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <main className="py-24 px-4 sm:px-6 mx-auto max-w-3xl text-center">
        <div className="font-display text-7xl font-black text-[#FF6A00]">404</div>
        <h1 className="mt-4 font-display text-3xl font-black text-white">
          This track does not exist
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
          The page you asked for is not on this stage. The generators below all work:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/ai-rap-generator"
            className="rounded-full bg-[#FF6A00] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#FF8A00]"
          >
            AI Rap Generator
          </Link>
          <Link
            href="/hotel-lobby-ai"
            className="rounded-full border border-[#222533] px-5 py-2.5 text-sm text-gray-200 hover:border-[#FF6A00]"
          >
            Hotel Lobby AI
          </Link>
          <Link
            href="/birthday-rap-song"
            className="rounded-full border border-[#222533] px-5 py-2.5 text-sm text-gray-200 hover:border-[#FF6A00]"
          >
            Birthday Rap Song
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-[#222533] px-5 py-2.5 text-sm text-gray-200 hover:border-[#FF6A00]"
          >
            Guides
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
