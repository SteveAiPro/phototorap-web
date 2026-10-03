import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GuidesSection from '@/components/GuidesSection';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { AdsterraNativeBanner } from '@/components/AdsterraBanner';

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
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://phototorap.com/guides?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://phototorap.com/#organization',
        name: 'PhotoToRap AI',
        url: 'https://phototorap.com',
        logo: 'https://phototorap.com/icon.png',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@phototorap.com',
          contactType: 'customer service',
          availableLanguage: ['English', 'Chinese', 'Spanish', 'French', 'German', 'Japanese'],
        },
        sameAs: [
          'https://x.com/phototorap',
          'https://www.producthunt.com/products/phototorap',
          'https://www.saashub.com/phototorap-alternatives',
          'https://www.uneed.best/tool/phototorap'
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://phototorap.com/#software',
        name: 'PhotoToRap AI Video Studio',
        url: 'https://phototorap.com',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, iOS, Android, macOS, Windows',
        description: 'Automated AI rap video generator converting 1 or 2 portrait photos into 1080p lip-synced rap performances in Hotel Lobby style.',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0.00',
          highPrice: '29.90',
          offerCount: '3',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '2840',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'HowTo',
        name: 'How to Make an AI Rap Video from Photos in 3 Minutes',
        description: 'Step-by-step tutorial on generating a viral lip-synced rap video using PhotoToRap AI.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Photos',
            text: 'Upload 1 selfie for solo freestyle or 2 selfies for a duo rap battle performance.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Select Virtual Stage & Model',
            text: 'Pick from 4 cinematic stages including the orange Hotel Lobby booth, Luxury Lobby, Studio Booth, or Street Cypher.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Customize Beats & Lyrics',
            text: 'Optionally enter an occasion (Birthday, Best Friends, Roast) or custom lyrics topic.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Generate & Export 1080p Video',
            text: 'Preview with 10 free credits and export unwatermarked 1080p MP4 ready for TikTok and Reels in under 3 minutes.',
          },
        ],
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
            name: 'What is PhotoToRap AI?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PhotoToRap AI is a specialized cloud AI video maker that converts 1 or 2 static portrait selfies into 1080p lip-synced rap music videos in under 3 minutes, featuring authentic trap beats, original freestyle lyrics, and viral stages like the Hotel Lobby booth.',
            },
          },
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
              text: 'Yes! The Hotel Lobby Orange Booth is our default viral stage. It recreates the famous Quavo & Takeoff COLORS show studio setup with high quality audio and animation without copyright takedowns.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there a free preview before paying?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, every user receives 10 Free Credits upon sign-in to test and preview full rap video rendering before choosing paid packages starting at $9.99.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is PhotoToRap different from Higgsfield or CapCut templates?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Unlike Higgsfield which requires complex motion transfer setups, or CapCut templates which paste one face over copyrighted tracks, PhotoToRap allows 2 real faces to trade verses in one tap with original royalty-free music and custom lyrics.',
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

      <AdsterraNativeBanner />

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
              <h3 className="font-display text-base font-bold text-white mb-2">How is PhotoToRap different from Higgsfield or CapCut?</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Unlike Higgsfield which requires complex motion transfer setups, or CapCut templates which paste one face over copyrighted tracks, PhotoToRap allows 2 real faces to trade verses in one tap with original royalty-free music and custom lyrics in under 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
