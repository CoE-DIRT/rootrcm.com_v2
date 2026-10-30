import Link from 'next/link';
import Image from 'next/image';
import { CommercialNextActions } from '@/components/commercial/next-actions';
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

      <section
        className="commercial-section group relative isolate min-h-[370px] overflow-hidden rounded-[24px] border border-[#2b5c7e] bg-[#071c35] px-6 py-10 shadow-[0_22px_68px_rgba(0,8,25,.2)] sm:px-10 md:py-14"
        aria-labelledby="dirt-teaser-heading"
      >
        <Image
          src="/media/root-workflow-network.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 768px) 100vw, 1300px"
          className="pointer-events-none absolute inset-0 object-cover object-right opacity-85 transition-transform duration-700 motion-reduce:transform-none group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,35,.98)_0%,rgba(5,18,35,.95)_43%,rgba(5,18,35,.6)_73%,rgba(5,18,35,.15)_100%)]" />
        <div className="relative z-[1] max-w-2xl">
          <p className="eyebrow !text-[#7ff7ff]">{t.commercial.dirtEyebrow}</p>
          <h2 id="dirt-teaser-heading" className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-[#f5fbff] md:text-4xl">{t.commercial.dirtTitle}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#d2e6f5]">{t.commercial.dirtBody}</p>
          <p className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary shadow-[0_12px_28px_rgba(17,225,238,.15)]" href={localizedPath(locale, '/technology')}>
              {t.commercial.dirtCta} →
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-[#f5fbff] backdrop-blur-xl transition hover:bg-white/20 focus-visible:outline-offset-4" href={localizedPath(locale, '/preview/dirt')}>
              {t.preview} →
            </Link>
          </p>
        </div>
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
        <CommercialNextActions locale={locale} offerId="free-account-consultation" />
      </section>
    </div>
  );
}
