import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage, StepList } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function CustomPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.custom.title} body={t.custom.body} nodeId="5:115">
      <StepList steps={t.custom.steps} />
      <BusinessInquiryForm locale={locale} />
    </MarketingPage>
  );
}
