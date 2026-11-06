import type { Metadata } from 'next';
import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import { RootGuide } from '@/components/site/root-guide';
import { SkipLink } from '@/components/site/skip-link';
import { MobileConversionDock } from '@/components/site/mobile-dock';
import { MotionController } from '@/components/site/motion-controller';
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
  return publicPageMetadata(locale, t.brandLong, t.home.body);
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
      <Navbar locale={locale} />
      {children}
      <Footer locale={locale} />
      <MobileConversionDock locale={locale} />
      <RootGuide key={locale} locale={locale} />
      <MotionController />
    </>
  );
}
