import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | PhotoToRap AI',
  description: 'Terms and Conditions governing the use of PhotoToRap AI services and generated content.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert text-gray-300 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using PhotoToRap AI at phototorap.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Acceptable Use & Content Standards</h2>
            <p>
              You represent and warrant that you own or have obtained all necessary rights, licenses, and express consent from any individual depicted in photos uploaded to PhotoToRap AI. You strictly agree not to upload, input, or generate:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Images or likeness of minors without verified parental or legal guardian authorization;</li>
              <li>Defamatory, obscene, harassing, violent, or sexually explicit content;</li>
              <li>Unauthorized likeness of public figures or third parties for malicious deepfakes or impersonation;</li>
              <li><strong>Infringing Material:</strong> Any content or prompts that infringe upon or violate third-party copyright, trademark, trade secret, or other intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Credits & Purchases</h2>
            <p>
              Generation renders consume virtual Credits. All purchases of credit packages and subscriptions are billed through our authorized global payment processing partners (including Waffo Pancake). Credits are non-transferable and subject to our Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Intellectual Property & Ownership</h2>
            <p>
              Subject to your compliance with these terms, you retain commercial and personal ownership of the resulting video clips generated through your account, within the scope permissible by applicable AI copyright regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind regarding synthesis accuracy or uninterrupted service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Contact</h2>
            <p>
              Questions regarding these Terms can be addressed to <a href="mailto:support@phototorap.com" className="text-[#FF6A00] underline">support@phototorap.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
