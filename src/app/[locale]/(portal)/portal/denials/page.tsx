import type { Metadata } from 'next';
import { PortalDenials } from '@/components/portal/portal-denials';
import { portalLabels } from '@/content/portal-demo';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.denials[locale], portalLabels.synthetic[locale]);
}

export default function DenialsPage() {
  return <PortalDenials />;
}
