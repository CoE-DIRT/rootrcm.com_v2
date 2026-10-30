import type { Metadata } from 'next';
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
  return publicPageMetadata(locale, t.resources.title, t.resources.body);
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.resources.title}
      body={t.resources.body}
      sections={t.resources.sections}
      nodeId="6:49"
    >
      <PendingFaq locale={locale} faqs={t.resources.faqs} />
    </MarketingPage>
  );
}
