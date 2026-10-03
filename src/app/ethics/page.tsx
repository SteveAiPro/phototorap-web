import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AI Ethics, Safety & Consent Guidelines | PhotoToRap AI',
  description: 'Our ethical principles, safety safeguards, and consent guidelines for responsible AI video creation.',
  alternates: {
    canonical: 'https://phototorap.com/ethics',
  },
};

export default function EthicsPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
          AI Ethics & Safety Guidelines
        </h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert text-gray-300 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Our Commitment to Responsible AI</h2>
            <p>
              PhotoToRap AI is engineered for joyful creativity, musical expression, and friendly entertainment (such as celebrating birthdays, rap duo roasts between friends, and creative parodies). We hold a zero-tolerance policy towards malicious impersonation, harassment, or defamatory deepfakes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Explicit Consent Required</h2>
            <p>
              Users must possess express consent from individuals whose photos are uploaded for video generation. You may not upload photos of unconsenting third parties, acquaintances, or public figures to portray them in compromising, misleading, or offensive scenarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Content Safety Filters & Acceptable Use</h2>
            <p>
              We implement multi-stage automated moderation filters and strictly prohibit the following content categories:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Rejection of NSFW, sexually explicit, or violent imagery;</li>
              <li>Filter blocks on hate speech, racial slurs, and defamatory lyric inputs;</li>
              <li>Protection of minors: uploads identified as containing minors without explicit legal authority are strictly blocked;</li>
              <li>Unauthorized deepfakes, non-consensual likeness, or impersonation of real individuals;</li>
              <li><strong className="text-white">Third-Party Intellectual Property:</strong> Users may not upload, prompt, or generate content that infringes any third-party copyright, trademark, trade dress, or proprietary rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Reporting Violations & Takedown Requests</h2>
            <p>
              If you discover an unauthorized video created with your likeness, please notify our safety compliance desk at <a href="mailto:safety@phototorap.com" className="text-[#FF6A00] underline">safety@phototorap.com</a> with the generation URL. We immediately review and purge offending creations within 24 hours.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
