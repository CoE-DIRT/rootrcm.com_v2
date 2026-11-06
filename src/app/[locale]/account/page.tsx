import type { Metadata } from 'next';
import { CommercialNextActions } from '@/components/commercial/next-actions';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage, StepList } from '@/components/site/marketing-page';
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
  return publicPageMetadata(locale, t.account.title, t.account.body);
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.account.title} body={t.account.body} nodeId="5:46">
      <StepList steps={t.account.steps} />
      <div className="surface relative mt-8 overflow-hidden p-6 sm:p-10 shadow-[var(--shadow)]">
        <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />
        <div className="mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
          <span className="inline-block size-2 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
          <span>
            {locale === 'es'
              ? 'Solicitud de cuenta y consulta · Solo contactos de empresa · Sin datos médicos'
              : 'Account & Consultation Inquiry · Business Contacts Only · No Patient Information'}
          </span>
        </div>
        <BusinessInquiryForm locale={locale} />
      </div>
      <CommercialNextActions locale={locale} offerId="free-account-consultation" />
    </MarketingPage>
  );
}
