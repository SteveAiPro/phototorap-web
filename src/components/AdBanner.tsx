'use client';

import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot = 'placeholder', format = 'horizontal', className = '' }: AdBannerProps) {
  // In production, when NEXT_PUBLIC_ADSENSE_CLIENT is set, loads real Google AdSense ins
  const isEnabled = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <div
      className={`w-full overflow-hidden my-8 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-white/[0.04] p-4 text-center transition-all ${className}`}
      style={{ minHeight: format === 'horizontal' ? '100px' : '260px' }}
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[90px] text-xs text-gray-500">
        <span className="uppercase tracking-widest text-[10px] text-gray-600 font-semibold mb-1">Advertisement</span>
        {isEnabled ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex items-center gap-2 py-4 px-6 rounded-lg border border-dashed border-white/10 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Google AdSense Slot Ready · Non-intrusive Zero CLS Container</span>
          </div>
        )}
      </div>
    </div>
  );
}
