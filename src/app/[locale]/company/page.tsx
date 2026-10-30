import type { Metadata } from 'next';
import { ProofUnpublished } from '@/components/commercial/proof-unpublished';
import { MarketingPage, PendingFaq } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.company.title, t.company.body);
}

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.company.title}
      body={t.company.body}
      sections={t.company.sections}
      nodeId="6:34"
    >
      <ProofUnpublished locale={locale} />
      <PendingFaq locale={locale} faqs={t.company.faqs} />
    </MarketingPage>
  );
}
