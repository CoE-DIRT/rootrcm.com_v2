import { MarketingPage, PendingFaq } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.company.title} body={t.company.body} nodeId="6:34">
      <PendingFaq locale={locale} />
    </MarketingPage>
  );
}
