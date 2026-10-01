import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { GUIDES, Guide } from '@/data/guides';
import { Clock, ArrowLeft, ArrowRight, Mic, Sparkles, BookOpen } from 'lucide-react';

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | PhotoToRap AI Guides`,
    description: guide.description,
  };
}

export default function GuidePost({ params }: { params: { slug: string } }) {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  const related = GUIDES.filter((g) => guide.relatedGuides.includes(g.slug));

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-white">Guides</Link>
          <span>/</span>
          <span className="text-[#FF6A00] truncate max-w-[200px]">{guide.title}</span>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <span className="inline-block rounded-full bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00] mb-3">
            {guide.category} · {guide.tag}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {guide.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{guide.readTime}</span>
            </span>
            <span>•</span>
            <span>Updated {guide.publishedAt}</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black mb-10 border border-[#222533]">
          <img src={guide.coverImage} alt={guide.title} className="h-full w-full object-cover" />
        </div>

        {/* Inline High-Converting Tool Card */}
        <div className="mb-10 rounded-2xl border border-[#FF6A00]/40 bg-gradient-to-r from-[#181B26] to-[#12141C] p-6 text-center shadow-lg">
          <h3 className="font-display text-lg font-bold text-white mb-2">
            Try the Viral AI Rap Duo Generator Now
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
            Upload two selfies of you and a friend to get your 12-second Hotel Lobby rap video in 3 minutes.
          </p>
          <Link
            href="/#generator"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6A00] px-6 py-2.5 text-xs font-black text-black shadow-lg hover:bg-[#FF7D1A] transition-transform hover:scale-105"
          >
            <Mic className="h-4 w-4" />
            <span>Make Your Rap Video Free</span>
          </Link>
        </div>

        {/* Post Content */}
        <article className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-5 text-sm sm:text-base border-b border-[#222533] pb-12">
          {guide.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="font-display text-2xl font-bold text-white mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-display text-lg font-bold text-white mt-6 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* In-content Advertisement Container */}
        <AdBanner slot="guide-detail-mid" />

        {/* Related Guides / Silo Linking */}
        {related.length > 0 && (
          <section className="mt-8">
            <h3 className="font-display text-xl font-bold text-white mb-6">Related Tutorials & Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guides/${r.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-[#222533] bg-[#12141C] p-3 hover:border-[#FF6A00] transition-colors"
                >
                  <img src={r.coverImage} alt={r.title} className="h-16 w-24 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 hover:text-[#FF6A00]">{r.title}</h4>
                    <span className="text-[10px] text-gray-500 mt-1 block">{r.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Article Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: guide.title,
              description: guide.description,
              image: `https://phototorap.com${guide.coverImage}`,
              datePublished: guide.publishedAt,
              author: {
                '@type': 'Organization',
                name: 'PhotoToRap AI Team',
                url: 'https://phototorap.com',
              },
              publisher: {
                '@type': 'Organization',
                name: 'PhotoToRap AI',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://phototorap.com/icon.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://phototorap.com/guides/${guide.slug}`,
              },
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
