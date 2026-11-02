import type { Metadata } from 'next';
import Link from 'next/link';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage } from '@/components/site/marketing-page';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';
import {
  CALCULATOR_QUERY_SOURCE,
  parseCalculatorSearchParams,
  type PracticeType,
} from '@/lib/revenue-calculator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.onboarding.title, t.onboarding.body);
}

function money(locale: string, value: number): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function practiceLabel(locale: 'en' | 'es', type: PracticeType): string {
  return copy(locale).calculator.practiceTypes[type];
}

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const query = await searchParams;
  const prefill = parseCalculatorSearchParams(query);
  const fromCalculator = prefill.source === CALCULATOR_QUERY_SOURCE;

  const summaryMessage = [
    `${t.calculator.collectionsLabel}: ${money(locale, prefill.monthlyCollections)}`,
    `${t.calculator.denialLabel}: ${prefill.denialRate}%`,
    `${t.calculator.practiceLabel}: ${practiceLabel(locale, prefill.practiceType)}`,
    `${t.calculator.annualLostLabel}: ${money(locale, prefill.annualLost)}`,
    `${t.calculator.recoverableLabel}: ${money(locale, prefill.recoverable)}`,
    `${t.calculator.cleanClaimLabel}: ${prefill.cleanClaim}%`,
  ].join('\n');

  return (
    <MarketingPage locale={locale} title={t.onboarding.title} body={t.onboarding.body} nodeId="5:92">
      <div className="mt-6">
        <StatusBanner tone="warning">{t.adaptersOff}</StatusBanner>
      </div>
      <section className="surface mt-6 p-5" aria-labelledby="calc-prefill-heading">
        <h2 id="calc-prefill-heading" className="text-lg font-bold">
          {t.onboarding.summaryTitle}
        </h2>
        {!fromCalculator ? <p className="muted mt-2 text-sm">{t.onboarding.emptyNote}</p> : null}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="muted text-xs">{t.calculator.collectionsLabel}</dt>
            <dd className="font-semibold">{money(locale, prefill.monthlyCollections)}</dd>
          </div>
          <div>
            <dt className="muted text-xs">{t.calculator.denialLabel}</dt>
            <dd className="font-semibold">{prefill.denialRate}%</dd>
          </div>
          <div>
            <dt className="muted text-xs">{t.calculator.practiceLabel}</dt>
            <dd className="font-semibold">{practiceLabel(locale, prefill.practiceType)}</dd>
          </div>
          <div>
            <dt className="muted text-xs">{t.calculator.annualLostLabel}</dt>
            <dd className="font-semibold">{money(locale, prefill.annualLost)}</dd>
          </div>
          <div>
            <dt className="muted text-xs">{t.calculator.recoverableLabel}</dt>
            <dd className="font-semibold">{money(locale, prefill.recoverable)}</dd>
          </div>
          <div>
            <dt className="muted text-xs">{t.calculator.cleanClaimLabel}</dt>
            <dd className="font-semibold">{prefill.cleanClaim}%</dd>
          </div>
        </dl>
        <p className="muted mt-3 text-xs">{t.calculator.disclaimer}</p>
      </section>
      <BusinessInquiryForm
        locale={locale}
        defaultConcern="diagnostic"
        defaultMessage={summaryMessage}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn-secondary" href={localizedPath(locale, '/diagnostic')}>
          {t.onboarding.continueDiagnostic}
        </Link>
        <Link className="btn-outline" href={localizedPath(locale)}>
          {t.onboarding.backHome}
        </Link>
      </div>
    </MarketingPage>
  );
}
