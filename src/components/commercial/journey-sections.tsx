import Link from 'next/link';
import Image from 'next/image';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { EcosystemMarquees } from '@/components/commercial/ecosystem-marquees';
import { PayerStrip } from '@/components/commercial/payer-strip';
import { PracticeFaqSection } from '@/components/commercial/faq-section';
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

      <section className="commercial-section" aria-labelledby="bottleneck-heading">
        <SectionHeader
          id="bottleneck-heading"
          eyebrow={t.commercial.bottleneckEyebrow}
          title={t.commercial.bottleneckTitle}
          body={t.commercial.bottleneckBody}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.commercial.bottleneckCards.map((card, idx) => (
            <Link
              key={card.title}
              href={localizedPath(locale, card.href)}
              className="card-hover surface group flex flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <span className="eyebrow">0{idx + 1}</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--cyan)]">
                  {card.title}
                </h3>
                <p className="muted mt-3 text-sm leading-relaxed">{card.body}</p>
              </div>
              <span className="mt-6 inline-flex items-center text-xs font-bold text-[var(--cyan)] transition-transform motion-reduce:transform-none group-hover:translate-x-1">
                {card.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SpecialtyGrid locale={locale} />

      <section className="commercial-section surface p-6 sm:p-10" aria-labelledby="transition-heading">
        <SectionHeader
          id="transition-heading"
          eyebrow={t.commercial.transitionEyebrow}
          title={t.commercial.transitionTitle}
          body={t.commercial.transitionBody}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.commercial.transitionSteps.map((step, idx) => (
            <div key={step.title} className="surface-2 flex flex-col p-6">
              <span className="eyebrow">0{idx + 1}</span>
              <h3 className="mt-2 text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="muted mt-2 text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs text-[var(--muted)]">
          <span className="inline-block size-2 shrink-0 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
          <span>{t.commercial.transitionAssurance}</span>
        </div>
      </section>

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

      <section
        className="commercial-section group relative isolate overflow-hidden rounded-[24px] border border-[#2b5c7e] bg-[#071c35] shadow-[0_22px_68px_rgba(0,8,25,.2)]"
        aria-labelledby="philosophy-heading"
      >
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative z-[1] p-8 sm:p-10 md:p-12">
            <p className="eyebrow !text-[#7ff7ff]">{t.commercial.philosophyEyebrow}</p>
            <h2 id="philosophy-heading" className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-[#f5fbff] md:text-3xl lg:text-4xl">
              {t.commercial.philosophyTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-[#d2e6f5]">
              {t.commercial.philosophyBody}
            </p>
            <p className="mt-8">
              <Link className="btn-primary" href={localizedPath(locale, '/why-root')}>
                {t.commercial.philosophyCta} →
              </Link>
            </p>
          </div>
          <div className="relative h-64 min-h-[300px] w-full overflow-hidden border-t border-[#2b5c7e] sm:h-80 lg:h-full lg:border-l lg:border-t-0">
            <Image
              src="/brand/story.webp"
              alt={locale === 'es' ? 'Ilustración original de ROOT para operaciones y continuidad' : 'Original ROOT practice intelligence and continuity visual'}
              fill
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-center opacity-85 transition-transform duration-700 motion-reduce:transform-none group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,35,.2)_0%,rgba(5,18,35,.75)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,18,35,.6)_0%,rgba(5,18,35,.15)_100%)]" />
          </div>
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

      <PracticeFaqSection locale={locale} />

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
