import type { Metadata } from 'next';
import { PortalPriorAuthPanel } from '@/components/portal/portal-prior-auth-panel';
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

export default function PriorAuthPage() {
  return <PortalPriorAuthPanel />;
}
