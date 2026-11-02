import type { Metadata } from 'next';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

export function publicPageMetadata(locale: Locale, title: string, description: string): Metadata {
  const t = copy(locale);
  return {
    title,
    description,
    applicationName: t.brand,
    robots: { index: false, follow: false },
  };
}
