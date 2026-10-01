'use client';

import React from 'react';
import Link from 'next/link';
import { Mic2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#222533] bg-[#07080C] py-12 px-4 sm:px-6 text-xs text-gray-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1 */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6A00] text-black">
                <Mic2 className="h-4 w-4 fill-black stroke-black" />
              </div>
              <span className="font-display text-lg font-black text-white">
                PhotoToRap<span className="text-[#FF6A00]">.ai</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-4">
              Turn any photo into viral AI rap videos in 3 minutes. Upload two photos of you and a friend for the viral Hotel Lobby COLORS booth style with lip-sync, rhyme, and original beats.
            </p>
            <p className="text-gray-500 text-[11px]">
              © {new Date().getFullYear()} PhotoToRap AI. All rights reserved.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#generator" className="hover:text-white">Make a Video</Link></li>
              <li><Link href="/#featured" className="hover:text-white">Sound Previews</Link></li>
              <li><Link href="/hotel-lobby-ai" className="hover:text-white">Hotel Lobby AI</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Guides & SEO</h4>
            <ul className="space-y-2">
              <li><Link href="/guides/how-to-do-the-hotel-lobby-trend" className="hover:text-white">Hotel Lobby Tutorial</Link></li>
              <li><Link href="/guides/funny-rap-lyrics-and-prompts" className="hover:text-white">Funny Rap Lyrics</Link></li>
              <li><Link href="/guides/best-ai-rap-video-generators" className="hover:text-white">Top 5 AI Rap Makers</Link></li>
              <li><Link href="/guides" className="hover:text-white">All Guides Hub</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Legal & Safety</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              <li><Link href="/ethics" className="hover:text-white">AI Ethics & Consent</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#181B26] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>Photos are deleted within 24 hours. We never train public models on your personal selfies.</p>
          <p className="flex items-center gap-1">
            Built for creators worldwide with <Heart className="h-3 w-3 text-[#FF6A00] fill-[#FF6A00]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
