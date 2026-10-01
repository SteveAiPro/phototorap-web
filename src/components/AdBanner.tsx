'use client';

import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot = 'placeholder', format = 'horizontal', className = '' }: AdBannerProps) {
  // Only render when NEXT_PUBLIC_ADSENSE_CLIENT is set; otherwise return null so no mock placeholder is shown
  const isEnabled = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      className={`w-full overflow-hidden my-8 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-white/[0.04] p-4 text-center transition-all ${className}`}
      style={{ minHeight: format === 'horizontal' ? '100px' : '260px' }}
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[90px] text-xs text-gray-500">
        <span className="uppercase tracking-widest text-[10px] text-gray-600 font-semibold mb-1">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
