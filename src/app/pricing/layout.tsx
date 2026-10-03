import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Credit Packages | PhotoToRap AI',
  description: 'Simple, transparent pricing for PhotoToRap AI. Watch free previews first, pay only when you love the video.',
  alternates: {
    canonical: 'https://phototorap.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
