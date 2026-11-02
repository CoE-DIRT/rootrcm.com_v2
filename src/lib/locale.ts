import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/i18n/locales';

export async function requireLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function localeStaticParams() {
  return locales.map((locale) => ({ locale }));
}
