import type { Metadata } from 'next';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage } from '@/components/site/marketing-page';
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
  return publicPageMetadata(locale, t.consultation.title, t.consultation.body);
}

export default async function ConsultationPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.consultation.title} body={t.consultation.body} nodeId="5:69">
      <BusinessInquiryForm locale={locale} defaultConcern="consultation" />
      <CommercialNextActions locale={locale} offerId="free-account-consultation" />
    </MarketingPage>
  );
}
