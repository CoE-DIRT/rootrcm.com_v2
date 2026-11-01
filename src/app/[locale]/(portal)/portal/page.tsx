import type { Metadata } from 'next';
import { PortalDashboard } from '@/components/portal/portal-dashboard';
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
  return publicPageMetadata(locale, t.nav.clientPortal, t.preview);
}

export default function PortalHomePage() {
  return <PortalDashboard />;
}
