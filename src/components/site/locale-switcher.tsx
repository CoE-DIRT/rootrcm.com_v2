'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const pathname = usePathname() || `/${locale}`;
  const next: Locale = locale === 'en' ? 'es' : 'en';
  const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`) || `/${next}`;
  return (
    <Link className="btn-ghost" href={href} hrefLang={next} aria-label={t.locale.switchTo}>
      {next === 'es' ? 'ES' : 'EN'}
    </Link>
  );
}
