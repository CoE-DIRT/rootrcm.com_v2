'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { Button } from './Button';

export type LanguageToggleProps = { locale: Locale };

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const t = copy(locale);
  // Root layouts persist across client navigation; keep <html lang> in sync.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const pathname = usePathname() || `/${locale}`;
  const next: Locale = locale === 'en' ? 'es' : 'en';
  const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`) || `/${next}`;
  return (
    <Button
      href={href}
      hrefLang={next}
      lang={next}
      variant="ghost"
      size="md"
      iconOnly
      aria-label={`${t.locale.switchTo}: ${next === 'es' ? t.locale.es : t.locale.en}`}
    >
      {next.toUpperCase()}
    </Button>
  );
}
