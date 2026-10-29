import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function ConsultationPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.consultation.title} body={t.consultation.body} nodeId="6:78">
      <BusinessInquiryForm locale={locale} />
    </MarketingPage>
  );
}
