import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'Birthday Rap Song Generator: a personal rap video gift';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="A BIRTHDAY GIFT THEY WILL ACTUALLY KEEP"
        title="Birthday Rap Song"
        titleAccent="Generator"
        subtitle="Turn their photo into a custom birthday rap video with their name in the lyrics. Ready in about 3 minutes."
      />
    ),
    size
  );
}
