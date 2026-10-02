'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const { user, addCredits, openAuthModal } = useAuth();
  // 监听从 Waffo / Stripe 返回的支付成功重定向 (?payment=success&credits=10)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const creditsToAdd = Number(params.get('credits') || 10);
      addCredits(creditsToAdd);
      alert(`🎉 Payment Successful! ${creditsToAdd} Credits added to your account.`);
      // 清除 URL 查询参数避免重复触发
      window.history.replaceState({}, '', '/pricing');
    }
  }, [addCredits]);

  const handleCheckout = async (planId: string, credits: number) => {
    if (!user) {
      openAuthModal();
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, email: user.email, userId: user.id }),
      });
      const data = await res.json();
      const checkoutUrl = data.checkoutUrl || data.url;
      if (checkoutUrl && !checkoutUrl.startsWith('/pricing?payment=simulation')) {
        // Waffo 官方集成关键规则：新标签页打开收银台，保留主站上下文
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      } else if (data.success && data.mode === 'simulation') {
        // 模拟模式直接充值
        addCredits(credits);
        alert(`🎉 Payment Successful! ${credits} Credits added to your account.`);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      alert('Checkout error');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <AuthModal />

      <main className="py-16 px-4 sm:px-6 mx-auto max-w-6xl text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
          Always watch your free preview first. Pay only when you love the result.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-6 flex flex-col">
            <h3 className="font-display text-lg font-bold text-white">Single Track</h3>
            <p className="text-xs text-gray-400 mt-1">Perfect for a 1-time gift or joke</p>
            <div className="my-6">
              <span className="text-4xl font-black text-white">$9.99</span>
              <span className="text-xs text-gray-400 ml-1">/ 10 Credits (1 video)</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-300 flex-1 mb-6">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> 1 Full HD 1080p Export</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> No Watermark</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> Commercial Social Rights</li>
            </ul>
            <button
              onClick={() => handleCheckout('single', 10)}
              disabled={loadingPlan === 'single'}
              className="rounded-xl border border-[#222533] bg-[#181B26] py-3 text-center text-xs font-bold text-white hover:border-[#FF6A00] transition-colors"
            >
              {loadingPlan === 'single' ? 'Processing...' : 'Buy 10 Credits ($9.99)'}
            </button>
          </div>

          {/* Card 2: Most Popular */}
          <div className="rounded-2xl border-2 border-[#FF6A00] bg-[#12141C] p-6 flex flex-col relative shadow-2xl shadow-[#FF6A00]/15">
            <span className="absolute -top-3 right-6 rounded-full bg-[#FF6A00] px-3 py-0.5 text-[10px] font-black uppercase text-black">
              Most Popular
            </span>
            <h3 className="font-display text-lg font-bold text-white">Creator 5-Pack</h3>
            <p className="text-xs text-gray-400 mt-1">For birthdays, friends & social posts</p>
            <div className="my-6">
              <span className="text-4xl font-black text-white">$29</span>
              <span className="text-xs text-gray-400 ml-1">/ 50 Credits (5 videos)</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-300 flex-1 mb-6">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> 5 Full HD 1080p Exports</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> Credits NEVER expire</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> All 4 Stage Templates Included</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> Priority Cloud GPU Rendering</li>
            </ul>
            <button
              onClick={() => handleCheckout('pack', 50)}
              disabled={loadingPlan === 'pack'}
              className="rounded-xl bg-[#FF6A00] py-3 text-center text-xs font-bold text-black shadow-lg hover:bg-[#FF7D1A] transition-colors"
            >
              {loadingPlan === 'pack' ? 'Processing...' : 'Buy 50 Credits ($29.00)'}
            </button>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-6 flex flex-col">
            <h3 className="font-display text-lg font-bold text-white">Pro Monthly</h3>
            <p className="text-xs text-gray-400 mt-1">For TikTok creators & influencers</p>
            <div className="my-6">
              <span className="text-4xl font-black text-white">$29.90</span>
              <span className="text-xs text-gray-400 ml-1">/ 100 Credits Monthly</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-300 flex-1 mb-6">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> 10 HD Videos each month</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> Fastest VIP GPU queue</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6A00]" /> Cancel anytime with 1-click</li>
            </ul>
            <button
              onClick={() => handleCheckout('monthly', 100)}
              disabled={loadingPlan === 'monthly'}
              className="rounded-xl border border-[#222533] bg-[#181B26] py-3 text-center text-xs font-bold text-white hover:border-[#FF6A00] transition-colors"
            >
              {loadingPlan === 'monthly' ? 'Processing...' : 'Subscribe ($29.90/mo)'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
