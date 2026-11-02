import type { Metadata } from 'next';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { MarketingPage } from '@/components/site/marketing-page';
import { Card } from '@/components/ui/card';
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
  return publicPageMetadata(locale, t.plans.title, t.plans.body);
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
      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {priceCatalog.map((offer) => (
          <Card
            key={offer.id}
            title={offer.name[locale]}
            body={offer.summary[locale]}
            kicker={offer.priceLabel[locale]}
            href={localizedPath(locale, offer.href)}
            nodeId={offer.figmaNodeId}
          />
        ))}
      </div>
      <CommercialNextActions locale={locale} />
    </MarketingPage>
  );
}
