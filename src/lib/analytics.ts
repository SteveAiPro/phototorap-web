/**
 * Google Analytics 4 (GA4) Custom Event & Funnel Tracking Utility
 * Safely dispatches events to window.gtag
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GA4 Event] ${eventName}:`, params);
      }
    } catch (err) {
      console.warn(`[GA4] Failed to dispatch event ${eventName}:`, err);
    }
  }
}

/**
 * Funnel Step 1: User clicks "Generate Rap Video" in Studio
 */
export function trackGenerateClick(params: {
  mode: 'solo' | 'duo';
  stage?: string;
  hasCustomLyrics?: boolean;
}) {
  trackEvent('generate_clicked', {
    event_category: 'engagement',
    event_label: `Generate ${params.mode} rap video`,
    mode: params.mode,
    stage: params.stage || 'colors_orange',
    has_custom_lyrics: Boolean(params.hasCustomLyrics),
  });
}

/**
 * Funnel Step 2: Generation finished & preview player ready
 */
export function trackPreviewReady(params: {
  mode?: string;
  generationDurationMs?: number;
}) {
  trackEvent('preview_ready', {
    event_category: 'engagement',
    event_label: 'Video Preview Completed',
    mode: params.mode || 'duo',
    duration_ms: params.generationDurationMs || 0,
  });
}

/**
 * Funnel Step 3: User opens pricing or clicks a plan tier
 */
export function trackBeginCheckout(params: {
  planId: string;
  planName: string;
  priceUsd: number;
  credits: number;
}) {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: params.priceUsd,
    items: [
      {
        item_id: params.planId,
        item_name: params.planName,
        price: params.priceUsd,
        quantity: 1,
      },
    ],
    credits_amount: params.credits,
  });
}

/**
 * Funnel Step 4: Purchase completed
 */
export function trackPurchaseSuccess(params: {
  orderId?: string;
  planId: string;
  planName?: string;
  priceUsd: number;
  credits: number;
}) {
  trackEvent('purchase', {
    transaction_id: params.orderId || `order_${Date.now()}`,
    currency: 'USD',
    value: params.priceUsd,
    items: [
      {
        item_id: params.planId,
        item_name: params.planName || params.planId,
        price: params.priceUsd,
        quantity: 1,
      },
    ],
    credits_amount: params.credits,
  });
}

/**
 * Guide / Blog CTA Click
 */
export function trackGuideCtaClick(params: {
  guideSlug: string;
  ctaText: string;
  destination: string;
}) {
  trackEvent('guide_cta_clicked', {
    event_category: 'conversion',
    guide_slug: params.guideSlug,
    cta_text: params.ctaText,
    destination: params.destination,
  });
}

/**
 * 用户注册（新账号首次出现）
 */
export function trackSignUp(params: { method?: string }) {
  trackEvent('sign_up', {
    method: params.method || 'unknown',
  });
}

/**
 * 用户登录（回访）
 */
export function trackLogin(params: { method?: string }) {
  trackEvent('login', {
    method: params.method || 'unknown',
  });
}

/**
 * 生成成功（关键转化事件，此前缺失导致 GA4 关键事件数 = 0）
 */
export function trackGenerateSuccess(params: {
  mode?: string;
  resolution?: string;
  duration?: string;
  credits?: number;
}) {
  trackEvent('generate_succeeded', {
    event_category: 'conversion',
    mode: params.mode || 'duo',
    resolution: params.resolution || '480p',
    duration: params.duration || '5s',
    credits: params.credits || 0,
  });
}
