import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'Diss Track Generator: make a friendly diss rap video';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="ONE TARGET, ONE TOPIC"
        title="Diss Track"
        titleAccent="Generator"
        subtitle="Write a friendly diss about anyone, then render it as a lip-synced rap video. Original beat, no copyright issues."
      />
    ),
    size
  );
}
