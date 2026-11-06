import type { Metadata } from 'next';
import { HomeJourney } from '@/components/commercial/journey-sections';
import { RevenueControlRoom } from '@/components/commercial/revenue-control-room';
import { PageHero } from '@/components/site/page-hero';
import { BandList, TileGrid } from '@/components/site/tile-grid';
import { copy } from '@/content/messages';
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
      {/* Exactly one single H1 hero in the DOM with responsive styling */}
      <PageHero
        locale={locale}
        eyebrow={t.home.eyebrow}
        title={t.home.titleDesktop}
        body={t.home.bodyDesktop}
        cta={t.home.ctaDesktop}
        ctaHref={localizedPath(locale, '/consultation')}
        nodeId="4:153"
      />

      {/* Revenue Control Room with Trust Bullets, Metaphor & Shared Visibility */}
      <RevenueControlRoom locale={locale} />

      <p className="eyebrow mt-12">{t.home.explore}</p>
      <TileGrid locale={locale} tiles={t.home.tiles} hint={t.home.tileHint} />
      <BandList items={t.home.bands} />
      <HomeJourney locale={locale} />
    </main>
  );
}
