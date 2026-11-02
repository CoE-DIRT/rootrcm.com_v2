'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

function LocaleSwitcherControl({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const pathname = usePathname() || `/${locale}`;
  const searchParams = useSearchParams();
  const next: Locale = locale === 'en' ? 'es' : 'en';

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const swapped = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`) || `/${next}`;
  const query = searchParams.toString();
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const href = `${swapped}${query ? `?${query}` : ''}${hash}`;

  return (
    <Link
      className="btn-ghost"
      href={href}
      hrefLang={next}
      aria-label={`${t.locale.switchTo}. ${t.chrome.preserveRoute}`}
      data-testid="locale-switcher"
    >
      {next === 'es' ? 'ES' : 'EN'}
    </Link>
  );
}

function LocaleSwitcherFallback({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const next: Locale = locale === 'en' ? 'es' : 'en';
  return (
    <Link className="btn-ghost" href={`/${next}`} hrefLang={next} aria-label={t.locale.switchTo}>
      {next === 'es' ? 'ES' : 'EN'}
    </Link>
  );
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<LocaleSwitcherFallback locale={locale} />}>
      <LocaleSwitcherControl locale={locale} />
    </Suspense>
  );
}
