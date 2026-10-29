import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SkipLink } from '@/components/site/skip-link';
import { localeStaticParams, requireLocale } from '@/lib/locale';

export const generateStaticParams = localeStaticParams;

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
    </>
  );
}
