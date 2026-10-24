import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';

export const alt = 'Rap Duo Name Generator: free stage names for duos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <OgCard
        badge="FREE DUO NAME IDEAS"
        title="Rap Duo Name"
        titleAccent="Generator"
        subtitle="Instant stage name ideas in four styles — then turn your duo into a real rap video from two photos."
        footerNote="No sign-up needed to brainstorm"
      />
    ),
    size
  );
}
