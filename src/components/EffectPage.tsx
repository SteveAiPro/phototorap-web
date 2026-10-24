import React from 'react';
import Navbar from '@/components/Navbar';
import GeneratorCard from '@/components/GeneratorCard';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Check, Flame } from 'lucide-react';

export interface EffectConfig {
  badge: string;
  h1Top: string;
  h1Accent: string;
  intro: string;
  bullets: string[];
  defaultStage: string;
  defaultOccasion: string;
  examples: { src: string; poster: string; label: string }[];
  aboutTitle: string;
  about: string[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
}

export default function EffectPage({ config }: { config: EffectConfig }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="py-12 px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00] mb-4">
              <Flame className="h-4 w-4" />
              <span>{config.badge}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              {config.h1Top} <span className="text-[#FF6A00]">{config.h1Accent}</span>
            </h1>
            <p className="mt-4 text-base text-gray-300 leading-relaxed">{config.intro}</p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-gray-400">
              {config.bullets.map((b) => (
                <span key={b} className="flex items-center gap-2 text-white">
                  <Check className="h-4 w-4 text-[#FF6A00]" /> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <GeneratorCard
              defaultStage={config.defaultStage}
              defaultOccasion={config.defaultOccasion}
            />
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Watch real examples first
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Actual videos rendered by this generator. Yours will be written around your own photos and topic.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {config.examples.map((ex) => (
              <figure key={ex.src} className="rounded-2xl border border-[#222533] bg-[#12141C] p-3">
                <video
                  className="w-full rounded-xl"
                  src={ex.src}
                  poster={ex.poster}
                  controls
                  preload="none"
                  playsInline
                />
                <figcaption className="mt-2 text-xs text-gray-400">{ex.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-20 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {config.aboutTitle}
          </h2>
          {config.about.map((p) => (
            <p key={p.slice(0, 32)} className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            {config.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-base font-bold text-white">{f.q}</h3>
                <p className="mt-1 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-xl font-black text-white">More generators</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {config.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-full border border-[#222533] bg-[#12141d] px-4 py-2 text-sm text-gray-200 hover:border-[#FF6A00] hover:text-white"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
