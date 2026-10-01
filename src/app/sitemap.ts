import { MetadataRoute } from 'next';
import { GUIDES } from '@/data/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://phototorap.com';
  const now = new Date();

  const languages = ['zh', 'es', 'fr', 'pt', 'de', 'ja', 'ko'];

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          zh: `${baseUrl}/zh`,
          es: `${baseUrl}/es`,
          fr: `${baseUrl}/fr`,
          pt: `${baseUrl}/pt`,
          de: `${baseUrl}/de`,
          ja: `${baseUrl}/ja`,
          ko: `${baseUrl}/ko`,
        },
      },
    },
    {
      url: `${baseUrl}/hotel-lobby-ai`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
  ];

  // Language versions of home
  const langRoutes: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // Guide detail pages
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...langRoutes, ...guideRoutes];
}
