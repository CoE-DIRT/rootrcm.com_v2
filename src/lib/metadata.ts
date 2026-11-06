import type { Metadata } from 'next';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

/** Routes with a generated 1200×630 card in public/imagery/og (see docs/media/manifest.md). */
export type OgSlug =
  | 'home'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'contact'
  | 'pricing'
  | 'faq'
  | 'services'
  | 'technology'
  | 'why-root'
  | 'specialties'
  | 'consultation'
  | 'diagnostic'
  | 'company'
  | 'resources'
  | 'solutions';

export function ogImage(slug: OgSlug) {
  return { url: `/imagery/og/${slug}.png`, width: 1200, height: 630, alt: 'ROOT — RCM and revenue operations' };
}

export function publicPageMetadata(locale: Locale, title: string, description: string, og: OgSlug = 'home'): Metadata {
  const t = copy(locale);
  const image = ogImage(og);
  return {
    title,
    description,
    applicationName: t.brand,
    robots: { index: true, follow: true },
    openGraph: { title, description, siteName: 'ROOT', type: 'website', locale: locale === 'es' ? 'es_US' : 'en_US', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
