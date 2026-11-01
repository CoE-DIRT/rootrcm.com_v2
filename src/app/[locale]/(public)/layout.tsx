import type { ReactNode } from 'react';
import { RootGuide } from '@/components/site/root-guide';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { requireLocale } from '@/lib/locale';

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  return (
    <>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
      <RootGuide key={locale} locale={locale} />
    </>
  );
}
