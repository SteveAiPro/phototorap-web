import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NameGenerator from '@/components/NameGenerator';
import Link from 'next/link';

export const metadata = {
  title: 'Rap Duo Name Generator: Free Stage Names for Duos',
  description:
    'Free rap duo name generator: get stage name ideas for your rap duo in four styles, then turn the duo into a real rap video from two photos with PhotoToRap AI.',
  openGraph: {
    title: 'Rap Duo Name Generator: Free Stage Names for Duos',
    description:
      'Free rap duo name generator: get stage name ideas for your rap duo in four styles, then turn the duo into a real rap video from two photos with PhotoToRap AI.',
    url: 'https://phototorap.com/rap-duo-name-generator',
  },
  twitter: {
    title: 'Rap Duo Name Generator: Free Stage Names for Duos',
    description:
      'Free rap duo name generator: get stage name ideas for your rap duo in four styles, then turn the duo into a real rap video from two photos with PhotoToRap AI.',
  },
  alternates: {
    canonical: 'https://phototorap.com/rap-duo-name-generator',
  },
};

const faqs = [
  {
    q: 'How do I pick a good rap duo name?',
    a: 'Say it out loud as an intro: "give it up for..." If it survives that test, check it is easy to spell from hearing it once, and search whether another act already uses it before you print it on anything.',
  },
  {
    q: 'Should a duo name reference both members?',
    a: 'It can, but the durable ones usually name the act, not the people: a place, a sound, a legend the two of you share. That is why the generator mixes styles instead of just gluing two first names together.',
  },
  {
    q: 'Can I use a generated name commercially?',
    a: 'These are ideas, not cleared trademarks. If you plan to release music under a name, do a proper trademark and artist-name search first.',
  },
];

export default function RapDuoNameGeneratorPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
      <main className="py-12 px-4 sm:px-6 mx-auto max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Rap Duo Name <span className="text-[#FF6A00]">Generator</span>
        </h1>
        <p className="mt-4 text-base text-gray-300 leading-relaxed">
          Every duo needs a name before the first track. Generate stage names in four styles,
          copy the one that sounds like a poster, then put the duo on an actual stage.
        </p>

        <div className="mt-8">
          <NameGenerator />
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-black text-white">Got a name? Make the video.</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
            A name is step one. Step two is a performance: upload one photo of each member of the
            duo and PhotoToRap renders the two of you trading verses in an original rap video, in
            about 3 minutes. Start with the{' '}
            <Link href="/ai-rap-generator" className="text-[#FF6A00] hover:underline">
              AI rap generator
            </Link>{' '}
            or the viral{' '}
            <Link href="/hotel-lobby-ai" className="text-[#FF6A00] hover:underline">
              Hotel Lobby stage
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-black text-white">Frequently Asked Questions</h2>
          <div className="mt-5 flex flex-col gap-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-base font-bold text-white">{f.q}</h3>
                <p className="mt-1 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
