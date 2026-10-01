import Stripe from 'stripe';

export interface PaymentPlan {
  id: 'single' | 'pack' | 'monthly';
  name: string;
  priceCents: number;
  priceFormatted: string;
  credits: number;
  description: string;
}

export const PAYMENT_PLANS: Record<string, PaymentPlan> = {
  single: {
    id: 'single',
    name: 'PhotoToRap Single Track',
    priceCents: 999, // $9.99
    priceFormatted: '$9.99',
    credits: 10,
    description: '10 AI Credits (1 Full 1080p Rap Video Export, No Watermark)',
  },
  pack: {
    id: 'pack',
    name: 'PhotoToRap Creator 5-Pack',
    priceCents: 2900, // $29.00
    priceFormatted: '$29.00',
    credits: 50,
    description: '50 AI Credits (5 Full 1080p Rap Video Exports, Priority GPU)',
  },
  monthly: {
    id: 'monthly',
    name: 'PhotoToRap Pro Monthly',
    priceCents: 2990, // $29.90
    priceFormatted: '$29.90',
    credits: 100,
    description: '100 AI Credits Monthly (10 HD Videos each month, VIP Queue)',
  },
};

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.includes('YOUR-STRIPE-KEY')) {
    return null;
  }
  if (!_stripe) {
    _stripe = new Stripe(secretKey, {
      apiVersion: '2024-04-10' as any,
      typescript: true,
    });
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return Boolean(secretKey && !secretKey.includes('YOUR-STRIPE-KEY'));
}
