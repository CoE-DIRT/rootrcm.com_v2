import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroOrbit } from '@/components/commercial/hero-orbit';
import { HomeJourney } from '@/components/commercial/journey-sections';
import { PainPointSelector } from '@/components/commercial/pain-point-selector';
import { ServicesBento } from '@/components/commercial/services-bento';
import { TimelineSection } from '@/components/commercial/timeline-section';
import { TrustEvidence } from '@/components/commercial/trust-evidence';
import { PageHero } from '@/components/site/page-hero';
import { BandList, TileGrid } from '@/components/site/tile-grid';
import { copy } from '@/content/messages';
import { RevenueCalculator } from '@/features/home/revenue-calculator';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.home.titleDesktop, t.home.bodyDesktop);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <div className="hidden lg:block">
        <PageHero
          locale={locale}
          eyebrow={t.home.eyebrow}
          title={t.home.titleDesktop}
          body={t.home.bodyDesktop}
          cta={t.home.ctaDesktop}
          ctaHref={localizedPath(locale, '/consultation')}
          nodeId="4:2"
        />
      </div>
      <div className="hidden md:block lg:hidden">
        <PageHero
          locale={locale}
          eyebrow={t.home.eyebrow}
          title={t.home.titleTablet}
          body={t.home.bodyTablet}
          cta={t.home.ctaTablet}
          ctaHref={localizedPath(locale, '/consultation')}
          nodeId="4:153"
        />
      </div>
      <div className="md:hidden">
        <PageHero
          locale={locale}
          eyebrow={t.home.eyebrow}
          title={t.home.titleMobile}
          body={t.home.bodyMobile}
          cta={t.home.ctaMobile}
          ctaHref={localizedPath(locale, '/consultation')}
          nodeId="4:126"
        />
      </div>
      <HeroOrbit locale={locale} />
      <PainPointSelector locale={locale} />
      <ServicesBento locale={locale} />
      <TimelineSection locale={locale} />
      <TrustEvidence locale={locale} />
      <RevenueCalculator locale={locale} />
      <p className="eyebrow mt-10">{t.home.explore}</p>
      <div className="md:hidden">
        <TileGrid locale={locale} tiles={t.home.mobileTiles} hint={t.home.tileHint} />
      </div>
      <div className="hidden md:block lg:hidden">
        <TileGrid locale={locale} tiles={t.home.tabletTiles} hint={t.home.tileHint} />
      </div>
      <div className="hidden lg:block">
        <TileGrid locale={locale} tiles={t.home.tiles} hint={t.home.tileHint} />
      </div>
      <BandList items={t.home.bands} />
      <HomeJourney locale={locale} />
      <p className="muted mt-8 text-sm">
        {t.adaptersOff}{' '}
        <Link href={localizedPath(locale, '/preview/client')} className="underline">
          {t.preview}
        </Link>
      </p>
    </main>
  );
}
