import Link from 'next/link';
import { PageHero } from '@/components/site/page-hero';
import { BandList, TileGrid } from '@/components/site/tile-grid';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <div className="hidden lg:block">
        <PageHero
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
          eyebrow={t.home.eyebrow}
          title={t.home.titleMobile}
          body={t.home.bodyMobile}
          cta={t.home.ctaMobile}
          ctaHref={localizedPath(locale, '/consultation')}
          nodeId="4:126"
        />
      </div>
      <p className="eyebrow mt-10">{t.home.explore}</p>
      <div className="md:hidden">
        <TileGrid locale={locale} tiles={t.home.mobileTiles} hint={t.home.tileHint} />
      </div>
      <div className="hidden md:block">
        <TileGrid locale={locale} tiles={t.home.tiles} hint={t.home.tileHint} />
      </div>
      <BandList items={t.home.bands} />
      <p className="muted mt-8 text-sm">
        {t.adaptersOff}{' '}
        <Link href={localizedPath(locale, '/preview/client')} className="underline">
          {t.preview}
        </Link>
      </p>
    </main>
  );
}
