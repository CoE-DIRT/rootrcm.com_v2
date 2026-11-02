'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;
  const next: Locale = locale === 'en' ? 'es' : 'en';
  const pathOnly = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`) || `/${next}`;

  // Root layouts are preserved during client-side navigation; keep the
  // document language synchronized for screen readers on EN/ES changes.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <Link
      className="btn-ghost"
      href={pathOnly}
      hrefLang={next}
      aria-label={t.locale.switchTo}
      onClick={(event) => {
        // Preserve the current query string across EN/ES switches.
        const search = typeof window !== 'undefined' ? window.location.search : '';
        const href = `${pathOnly}${search}`;
        if (href !== pathOnly) {
          event.preventDefault();
          router.push(href);
        }
      }}
    >
      {next === 'es' ? 'ES' : 'EN'}
    </Link>
  );
}
