import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage, StepList } from '@/components/site/marketing-page';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.account.title} body={t.account.body} nodeId="5:46">
      <div className="mt-6">
        <StatusBanner tone="warning">{t.adaptersOff}</StatusBanner>
      </div>
      <StepList steps={t.account.steps} />
      <BusinessInquiryForm locale={locale} />
    </MarketingPage>
  );
}
