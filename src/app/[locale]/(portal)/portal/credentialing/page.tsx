import type { Metadata } from 'next';
import { PortalCredentialingPanel } from '@/components/portal/portal-credentialing-panel';
import { portalLabels } from '@/content/portal-demo';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.credentialing[locale], portalLabels.synthetic[locale]);
}

export default function CredentialingRosterPage() {
  return <PortalCredentialingPanel />;
}
