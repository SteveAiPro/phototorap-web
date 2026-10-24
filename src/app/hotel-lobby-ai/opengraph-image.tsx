import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'Hotel Lobby AI Rap Video Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="THE VIRAL ORANGE COLORS BOOTH"
        title="Hotel Lobby AI"
        titleAccent="Rap Generator"
        subtitle="Two photos, one orange booth. You and your friend trade verses on an original beat — no copyrighted track, ready in about 3 minutes."
      />
    ),
    size
  );
}
