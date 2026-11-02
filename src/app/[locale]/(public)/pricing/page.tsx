import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
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
  return publicPageMetadata(locale, t.pricingPage.title, t.pricingPage.body);
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.pricingPage.title} body={t.pricingPage.body} nodeId="4:88">
      <RevenueCalculator locale={locale} />
      <p className="mt-8">
        <Link className="btn-secondary inline-flex" href={localizedPath(locale, '/plans')}>
          {t.pricingPage.catalogCta}
        </Link>
      </p>
      <p className="muted mt-4 text-sm">{t.plans.sow}</p>
    </MarketingPage>
  );
}
