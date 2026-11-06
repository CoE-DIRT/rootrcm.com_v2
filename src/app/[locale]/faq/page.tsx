import type { Metadata } from 'next';
import { FaqDirectory } from '@/components/commercial/faq-section';
import { MarketingPage } from '@/components/site/marketing-page';
import { Button } from '@/components/ui/Button';
import { allFaqItems } from '@/content/faq';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(
    locale,
    es ? 'Preguntas frecuentes' : 'Frequently asked questions',
    es ? 'Respuestas sobre software, responsables, visibilidad, costos y seguridad.' : 'Answers about software, ownership, visibility, cost and security.',
    'faq',
  );
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqItems().map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.a[locale] },
    })),
  };
  return (
    <MarketingPage
      locale={locale}
      eyebrow={es ? 'Preguntas frecuentes' : 'FAQ'}
      title={es ? '¿Qué preguntan los líderes de práctica antes de cambiar?' : 'What do practice leaders ask before switching?'}
      body={es ? 'Respuestas directas sobre software, responsables, visibilidad, costos y seguridad.' : 'Straight answers about software, ownership, visibility, cost and security.'}
      cta={es ? 'Revisión gratuita de fugas' : 'Get a free revenue leak review'}
      ctaHref={localizedPath(locale, '/diagnostic')}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FaqDirectory locale={locale} />
      <div className="cluster">
        <Button href={localizedPath(locale, '/contact')} variant="secondary" size="lg">
          {es ? '¿Otra pregunta? Contáctenos' : 'Another question? Contact us'}
        </Button>
      </div>
    </MarketingPage>
  );
}
