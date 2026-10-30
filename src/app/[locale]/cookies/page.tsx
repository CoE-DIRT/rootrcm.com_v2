import type { Metadata } from 'next';
import { CookiePreferencesForm } from '@/components/site/cookie-preferences-form';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.legal.cookiesTitle, t.legal.cookiesBannerBody);
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.legal.cookiesTitle} body={t.legal.cookiesBannerBody} nodeId="6:175">
      <CookiePreferencesForm locale={locale} />
    </MarketingPage>
  );
}
