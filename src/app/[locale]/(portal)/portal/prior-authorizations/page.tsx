import type { Metadata } from 'next';
import { portalLabels } from '@/content/portal-demo';
import { copy } from '@/content/messages';
import { PriorAuthTracker } from '@/features/portal/prior-auth/prior-auth-tracker';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.authorizations[locale], portalLabels.synthetic[locale]);
}

export default async function PriorAuthPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale).portal;
  return (
    <PriorAuthTracker
      labels={{
        eyebrow: t.portalPriorAuthEyebrow,
        title: t.portalPriorAuthTitle,
        body: t.portalPriorAuthBody,
        patientRef: t.portalPriorAuthPatientRef,
        physician: t.portalPriorAuthPhysician,
        cpt: t.portalPriorAuthCpt,
        payer: t.portalPriorAuthPayer,
        status: t.portalPriorAuthStatus,
        sla: t.portalPriorAuthSla,
      }}
    />
  );
}
