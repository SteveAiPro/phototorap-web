import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Refund Policy | PhotoToRap AI',
  description: 'Understand the refund policies and automated credit protection guarantees of PhotoToRap AI.',
  alternates: {
    canonical: 'https://phototorap.com/refund',
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Refund Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert text-gray-300 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Automated Failed-Render Refund Guarantee</h2>
            <p>
              Due to the compute-intensive nature of GPU video rendering, failures may rarely occur. If a video generation task fails to render or errors out on our servers, <strong>all consumed credits are instantly and automatically refunded</strong> back to your account balance with zero deductions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Unused Credit Purchases</h2>
            <p>
              If you purchase a credit pack and have not used any credits from that order, you may request a full monetary refund within <strong>14 days of purchase</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Partially Used Credits</h2>
            <p>
              Once credits have been consumed for completed video generation tasks, we generally cannot offer cash refunds for those specific rendered outputs, as actual cloud compute resources have already been expended.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. How to Request a Refund</h2>
            <p>
              To request a refund, please send an email to <a href="mailto:support@phototorap.com" className="text-[#FF6A00] underline">support@phototorap.com</a> with your account email and transaction ID. We process qualifying requests within 3 to 5 business days.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
