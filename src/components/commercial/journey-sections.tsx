import Link from 'next/link';
import { EcosystemMarquees } from '@/components/commercial/ecosystem-marquees';
import { PayerStrip } from '@/components/commercial/payer-strip';
import { ProofUnpublished } from '@/components/commercial/proof-unpublished';
import { SectionHeader } from '@/components/commercial/section-header';
import { SpecialtyGrid } from '@/components/commercial/specialty-grid';
import { Card } from '@/components/ui/card';
import { priceCatalog } from '@/content/catalog';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function HomeJourney({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <div className="mt-16 grid gap-16">
      <section className="commercial-section" aria-labelledby="services-teaser-heading">
        <SectionHeader
          id="services-teaser-heading"
          eyebrow={t.commercial.servicesEyebrow}
          title={t.services.title}
          body={t.services.body}
        />
        <ul className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {t.services.tiles.slice(0, 6).map((tile) => (
            <li key={tile.title}>
              <Card
                title={tile.title}
                body={t.home.tileHint}
                href={localizedPath(locale, tile.href)}
              />
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link className="btn-secondary" href={localizedPath(locale, '/services')}>
            {t.commercial.servicesCta} →
          </Link>
        </p>
      </section>

      <SpecialtyGrid locale={locale} />
      <EcosystemMarquees locale={locale} />
      <PayerStrip locale={locale} />

      <section className="commercial-section" aria-labelledby="dirt-teaser-heading">
        <SectionHeader
          id="dirt-teaser-heading"
          eyebrow={t.commercial.dirtEyebrow}
          title={t.commercial.dirtTitle}
          body={t.commercial.dirtBody}
        />
        <p className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-primary" href={localizedPath(locale, '/technology')}>
            {t.commercial.dirtCta} →
          </Link>
          <Link className="btn-secondary" href={localizedPath(locale, '/preview/dirt')}>
            {t.preview} →
          </Link>
        </p>
      </section>

      <ProofUnpublished locale={locale} />

      <section className="commercial-section" aria-labelledby="pricing-teaser-heading">
        <SectionHeader
          id="pricing-teaser-heading"
          eyebrow={t.commercial.pricingEyebrow}
          title={t.plans.title}
          body={t.plans.body}
        />
        <ul className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {priceCatalog.map((offer) => (
            <li key={offer.id}>
              <Card
                title={offer.name[locale]}
                body={offer.summary[locale]}
                kicker={offer.priceLabel[locale]}
                href={localizedPath(locale, offer.href)}
                nodeId={offer.figmaNodeId}
              />
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link className="btn-secondary" href={localizedPath(locale, '/plans')}>
            {t.plans.cta} →
          </Link>
        </p>
      </section>

      <section
        className="commercial-section surface p-8 md:p-10"
        aria-labelledby="conversion-heading"
      >
        <SectionHeader
          id="conversion-heading"
          eyebrow={t.nav.consultation}
          title={t.commercial.conversionTitle}
          body={t.commercial.conversionBody}
        />
        <p className="mt-6">
          <Link className="btn-primary btn-lg" href={localizedPath(locale, '/consultation')}>
            {t.commercial.conversionCta} →
          </Link>
        </p>
      </section>
    </div>
  );
}
