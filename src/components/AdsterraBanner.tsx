'use client';

import { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
}

export function AdsterraNativeBanner({ className = '' }: AdsterraNativeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.adLoaded) return;
    containerRef.current.dataset.adLoaded = 'true';

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31605628.profitableratecpmnetwork.com/53e75dcf934546cc9b26bce8d7f377e0/invoke.js';

      containerRef.current.appendChild(script);
    } catch (e) {
      console.error('Adsterra Native load error', e);
    }
  }, []);

  return (
    <div className={`mx-auto w-full max-w-5xl px-4 my-8 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">
            Sponsored Recommendations
          </span>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">Adsterra Verified</span>
      </div>
      <div
        ref={containerRef}
        className="w-full min-h-[160px] bg-[#12141C]/80 border border-[#222533] rounded-2xl p-4 shadow-xl overflow-hidden"
      >
        <div id="container-53e75dcf934546cc9b26bce8d7f377e0" />
      </div>
    </div>
  );
}
