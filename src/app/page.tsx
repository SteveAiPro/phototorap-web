import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GuidesSection from '@/components/GuidesSection';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://phototorap.com/#website',
        name: 'PhotoToRap AI',
        url: 'https://phototorap.com',
        description: 'Photo to Rap: AI Rap Video Generator from Photos. Turn selfies into viral rap duo and solo clips in the Hotel Lobby style in 3 minutes.',
      },
      {
        '@type': 'WebApplication',
        name: 'PhotoToRap AI',
        url: 'https://phototorap.com',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '9.99',
          highPrice: '99.00',
        },
      },
      {
        '@type': 'VideoObject',
        name: 'Hotel Lobby Best Friends Anthem',
        description: 'AI Rap Video generated from two selfies in the viral orange booth COLORS style.',
        thumbnailUrl: 'https://phototorap.com/examples/friends.jpg',
        contentUrl: 'https://phototorap.com/examples/friends.mp4',
        uploadDate: '2026-09-30',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does Photo to Rap AI work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Upload one or two clear photos, choose your stage like the viral orange Hotel Lobby booth, optionally add a birthday or friendship topic, and AI generates custom rap vocals, original beats, and lip-synced video in under 3 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I do the viral Hotel Lobby Quavo & Takeoff trend?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! The Hotel Lobby Orange Booth is our default viral stage. It recreates the famous Quavo & Takeoff COLORS show studio setup with high quality audio and animation.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there a free preview before paying?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, every user gets 10 Free Credits on sign-in to render and watch their rap video free before unlocking full HD downloads.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] selection:bg-[#FF6A00] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <AuthModal />
      <HeroSection />
      <GuidesSection />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdBanner slot="home-mid" />
      </div>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-[#222533] bg-[#090A0F] py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="mt-2 text-gray-400 text-sm">Everything you need to know about PhotoToRap AI.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5">
              <h3 className="font-display text-base font-bold text-white mb-2">What is PhotoToRap AI?</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                PhotoToRap AI is an online AI rap video generator. It transforms static selfies into an energetic rap performance with original lyrics, hip-hop beats, and realistic face lip-syncing.
              </p>
            </div>

            <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5">
              <h3 className="font-display text-base font-bold text-white mb-2">Can I do the Hotel Lobby trend here?</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Yes! The orange COLORS studio booth is our most popular default stage, faithfully recreating the Quavo & Takeoff Hotel Lobby style.
              </p>
            </div>

            <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5">
              <h3 className="font-display text-base font-bold text-white mb-2">How do Credits work?</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Every new user gets 10 Free Credits upon sign-in. Each 12-second rap video render consumes 10 Credits. If a generation ever fails, all credits are instantly refunded to your balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'PhotoToRap AI',
              url: 'https://phototorap.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://phototorap.com/guides?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'PhotoToRap AI Generator',
              operatingSystem: 'All',
              applicationCategory: 'MultimediaApplication',
              offers: {
                '@type': 'Offer',
                price: '0.00',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '2840',
              },
            },
          ]),
        }}
      />

      <Footer />
    </div>
  );
}
