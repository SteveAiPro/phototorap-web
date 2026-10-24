import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'AI Rap Battle Generator: roast your friend in a video';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="FRIENDLY ROASTS ONLY"
        title="AI Rap Battle"
        titleAccent="Generator"
        subtitle="Two photos, one beat. Your duo trades roast verses on a virtual stage — original lyrics, no copyright strikes."
      />
    ),
    size
  );
}
