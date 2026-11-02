import type { Metadata } from 'next';
import { PriorAuthTracker } from '@/features/portal/prior-auth/prior-auth-tracker';
import { copy } from '@/content/messages';
import { portalLabels } from '@/content/portal-demo';
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
  const t = copy(locale).portalPriorAuth;
  return <PriorAuthTracker labels={t} />;
}
