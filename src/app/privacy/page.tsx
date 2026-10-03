import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | PhotoToRap AI',
  description: 'Learn how PhotoToRap AI handles your data, uploaded photos, and protects user privacy.',
  alternates: {
    canonical: 'https://phototorap.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert text-gray-300 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Introduction</h2>
            <p>
              PhotoToRap AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates phototorap.com. We respect your privacy and are committed to protecting the personal data and media assets you share with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Uploaded Photos:</strong> Facial photos and selfies uploaded to generate AI rap duo and solo videos. These images are processed transiently and automatically purged from temporary inference buffers within 24 hours.
              </li>
              <li>
                <strong>Account & Authentication:</strong> Email addresses and basic profile information provided during authentication.
              </li>
              <li>
                <strong>Usage & Analytics:</strong> Privacy-friendly analytics (via Plausible Analytics) tracking anonymous pageviews without persistent cross-site tracking cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. How We Use Your Data</h2>
            <p>
              Your uploaded images are strictly utilized for video generation and lip-synchronization inference. We do NOT sell, lease, or use your facial likeness to train public foundational AI models without explicit opt-in consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Data Retention & Deletion</h2>
            <p>
              Generated video previews and source photos are retained only as long as necessary to serve your creations in your user session. Users may request full account and media deletion at any time by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Third-Party Services</h2>
            <p>
              Payment processing is securely handled by Stripe. We do not store full credit card credentials on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Contact Us</h2>
            <p>
              For privacy-related inquiries, data deletion requests, or concerns, please email us at <a href="mailto:support@phototorap.com" className="text-[#FF6A00] underline">support@phototorap.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
