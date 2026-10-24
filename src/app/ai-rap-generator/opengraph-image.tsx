import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'AI Rap Generator: make a rap video from your photos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="AI RAP GENERATOR FROM PHOTOS"
        title="AI Rap"
        titleAccent="Generator"
        subtitle="Upload 1 or 2 photos. Get an original, lip-synced rap video ready for TikTok and Reels in about 3 minutes."
      />
    ),
    size
  );
}
