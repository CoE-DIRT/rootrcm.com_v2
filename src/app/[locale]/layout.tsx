import type { Metadata } from 'next';
import { CookieConsent } from '@/components/site/cookie-consent';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { RootGuide } from '@/components/site/root-guide';
import { SkipLink } from '@/components/site/skip-link';
import { copy } from '@/content/messages';
import { localeStaticParams, requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.brandLong, t.home.bodyDesktop);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
      <RootGuide key={locale} locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
