import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { EcosystemMarquees } from '@/components/commercial/ecosystem-marquees';
import { PayerStrip } from '@/components/commercial/payer-strip';
import { PracticeFaqSection } from '@/components/commercial/faq-section';
import { ProofPlaceholders } from '@/components/commercial/proof-placeholders';
import { SpecialtyGrid } from '@/components/commercial/specialty-grid';
import { DuotonePhoto, Illustration } from '@/components/site/media';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import { priceCatalog } from '@/content/catalog';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const icon = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

const bottleneckArt = ['claim-lifecycle', 'credentialing-pipeline', 'revenue-control-room'] as const;

export function HomeJourney({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const es = locale === 'es';
  return (
    <>
      {/* Problem → impact: buyer questions */}
      <Section labelledBy="bottleneck-heading" divider="slice" tone="raised">
        <SectionHeading id="bottleneck-heading" eyebrow={t.commercial.bottleneckEyebrow} title={t.commercial.bottleneckTitle} body={t.commercial.bottleneckBody} />
        <ul className="ui-grid">
          {t.commercial.bottleneckCards.map((card, index) => (
            <li key={card.title}>
              <Card
                href={localizedPath(locale, card.href)}
                title={card.title}
                body={card.body}
                headingLevel={3}
                footer={
                  <span className="cluster text-[var(--cyan)]">
                    {card.cta} <ArrowRight {...icon} />
                  </span>
                }
              >
                <Illustration name={bottleneckArt[index % bottleneckArt.length]} locale={locale} />
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* How it works: Reveal → Assign → Reconcile */}
      <Section labelledBy="method-heading">
        <div className="split">
          <div>
            <SectionHeading id="method-heading" eyebrow={t.home.methodEyebrow} title={t.home.methodTitle} body={t.home.methodBody} />
            <ol className="method">
              {t.home.method.map((step) => (
                <li key={step.title} className="method__step">
                  <h3 className="method__title">{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <Illustration name="exception-queue" locale={locale} />
        </div>
      </Section>

      {/* Services */}
      <Section labelledBy="services-teaser-heading" tone="raised">
        <SectionHeading id="services-teaser-heading" eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} body={t.services.body} />
        <ul className="ui-grid" data-min="sm">
          {t.services.tiles.slice(0, 6).map((tile) => (
            <li key={tile.title}>
              <Card title={tile.title} href={localizedPath(locale, tile.href)} footer={<ArrowUpRight {...icon} className="text-[var(--cyan)]" />} />
            </li>
          ))}
        </ul>
        <div className="cluster section-actions">
          <Button href={localizedPath(locale, '/services')} variant="secondary" rightIcon={<ArrowRight {...icon} />}>
            {t.commercial.servicesCta}
          </Button>
        </div>
      </Section>

      <SpecialtyGrid locale={locale} />

      {/* Shared visibility */}
      <Section labelledBy="same-heading" tone="inverse" divider="slice">
        <div className="split" data-flip="true">
          <div className="stack">
            <SectionHeading id="same-heading" eyebrow={t.home.sameEyebrow} title={t.home.sameTitle} body={t.home.sameBody} />
            <ul className="check-list">
              {t.home.samePoints.map((point) => (
                <li key={point}>
                  <Check {...icon} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="cluster section-actions">
              <Button href={localizedPath(locale, '/preview/client')} variant="primary" prefetch={false} rightIcon={<ArrowRight {...icon} />}>
                {t.home.secondaryCta}
              </Button>
            </div>
          </div>
          <DuotonePhoto
            name="analytics-review"
            alt={es ? 'Manos sobre un portátil junto a gráficos impresos durante una revisión de ingresos' : 'Hands on a laptop beside printed charts during a revenue review'}
          />
        </div>
      </Section>

      {/* Technology & ecosystem */}
      <Section labelledBy="dirt-teaser-heading">
        <div className="split">
          <div className="stack">
            <SectionHeading id="dirt-teaser-heading" eyebrow={t.commercial.dirtEyebrow} title={t.commercial.dirtTitle} body={t.commercial.dirtBody} />
            <div className="cluster">
              <Button href={localizedPath(locale, '/technology')} variant="secondary" rightIcon={<ArrowRight {...icon} />}>
                {t.commercial.dirtCta}
              </Button>
            </div>
          </div>
          <Illustration name="payer-mix-dashboard" locale={locale} />
        </div>
      </Section>

      <Section labelledBy="ecosystem-heading" spacing="compact">
        <EcosystemMarquees locale={locale} />
        <PayerStrip locale={locale} />
      </Section>

      <ProofPlaceholders locale={locale} />

      {/* Pricing */}
      <Section labelledBy="pricing-teaser-heading">
        <SectionHeading
          id="pricing-teaser-heading"
          eyebrow={t.commercial.pricingEyebrow}
          title={es ? '¿Cuánto cuesta empezar?' : 'What does it cost to start?'}
          body={t.plans.body}
        />
        <ul className="ui-grid">
          {priceCatalog.map((offer) => (
            <li key={offer.id}>
              <Card title={offer.name[locale]} body={offer.summary[locale]} kicker={offer.priceLabel[locale]} href={localizedPath(locale, offer.href)} nodeId={offer.figmaNodeId} />
            </li>
          ))}
        </ul>
        <div className="cluster section-actions">
          <Button href={localizedPath(locale, '/plans')} variant="secondary" rightIcon={<ArrowRight {...icon} />}>
            {t.plans.cta}
          </Button>
        </div>
      </Section>

      <PracticeFaqSection locale={locale} />

      {/* Conversion */}
      <Section labelledBy="conversion-heading" tone="raised" divider="wave">
        <SectionHeading id="conversion-heading" eyebrow={t.nav.consultation} title={t.commercial.conversionTitle} body={t.commercial.conversionBody} />
        <div className="cluster">
          <Button href={localizedPath(locale, '/diagnostic')} variant="primary" size="lg" rightIcon={<ArrowRight {...icon} />}>
            {t.home.primaryCta}
          </Button>
          <Button href={localizedPath(locale, '/consultation#book')} variant="secondary" size="lg">
            {t.commercial.conversionCta}
          </Button>
        </div>
        <CommercialNextActions locale={locale} offerId="free-account-consultation" />
      </Section>
    </>
  );
}
