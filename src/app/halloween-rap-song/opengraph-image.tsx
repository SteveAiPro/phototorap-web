import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'Halloween Rap Song Generator: a spooky video of you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="THE HALLOWEEN PARTY TRICK PEOPLE REPLAY"
        title="Halloween Rap Song"
        titleAccent="Generator"
        subtitle="Drop in a photo, pick a spooky stage, and get a Halloween rap video of you performing. Share it before October ends."
      />
    ),
    size
  );
}
