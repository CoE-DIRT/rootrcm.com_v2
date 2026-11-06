import type { Metadata } from 'next';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { MarketingPage } from '@/components/site/marketing-page';
import { Card } from '@/components/ui/Card';
import { priceCatalog } from '@/content/catalog';
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
  return publicPageMetadata(locale, t.plans.title, t.plans.body, 'pricing');
}

export default async function PlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.plans.title}
      body={t.plans.body}
      cta={t.plans.cta}
      ctaHref={localizedPath(locale, '/consultation')}
      bands={t.plans.bands}
      nodeId="4:88"
    >
      <ul className="ui-grid">
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
      <CommercialNextActions locale={locale} />
    </MarketingPage>
  );
}
