import { MarketingPage, PendingFaq } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.resources.title} body={t.resources.body} nodeId="6:49">
      <PendingFaq locale={locale} />
    </MarketingPage>
  );
}
