'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface RapDuoExample {
  id: string;
  title: string;
  videoSrc: string;
  posterSrc: string;
}

// Exactly 4 canonical demo videos from rapduo.ai
const RAPDUO_EXAMPLES: RapDuoExample[] = [
  {
    id: 'friends',
    title: 'Best friends',
    videoSrc: '/examples/friends.mp4',
    posterSrc: '/examples/friends.jpg',
  },
  {
    id: 'couple',
    title: 'Couple · one photo',
    videoSrc: '/examples/couple.mp4',
    posterSrc: '/examples/couple.jpg',
  },
  {
    id: 'grandpas',
    title: 'Grandpa duo',
    videoSrc: '/examples/grandpas.mp4',
    posterSrc: '/examples/grandpas.jpg',
  },
  {
    id: 'roast',
    title: 'Birthday roast',
    videoSrc: '/examples/roast.mp4',
    posterSrc: '/examples/roast.jpg',
  },
];

export default function SoundPreviews() {
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  const toggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnmutedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full">
      {/* 2x2 四宫格布局 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {RAPDUO_EXAMPLES.map((item) => {
          const isUnmuted = unmutedId === item.id;
          return (
            <div
              key={item.id}
              className="relative w-full overflow-hidden rounded-2xl bg-black border border-[#222533] shadow-lg group hover:border-[#FF6A00]/60 transition-all duration-300"
            >
              {/* 9:16 竖屏视频卡片 */}
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <video
                  src={item.videoSrc}
                  poster={item.posterSrc}
                  autoPlay
                  loop
                  playsInline
                  muted={!isUnmuted}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />

                {/* 右上角静音小喇叭按钮 */}
                <button
                  type="button"
                  onClick={(e) => toggleSound(item.id, e)}
                  aria-label={isUnmuted ? 'Mute' : 'Play with sound'}
                  className={`absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                    isUnmuted
                      ? 'bg-[#FF6A00] text-black shadow-lg shadow-[#FF6A00]/50 scale-110'
                      : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                >
                  {isUnmuted ? (
                    <Volume2 className="h-3.5 w-3.5 fill-black stroke-black animate-pulse" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* 底部标题条 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pt-6 pb-2.5 text-left">
                  <span className="text-xs font-semibold text-white leading-tight block truncate">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
