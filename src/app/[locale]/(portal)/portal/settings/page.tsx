import type { Metadata } from 'next';
import { PortalSettingsPanel } from '@/components/portal/portal-settings-panel';
import { portalLabels } from '@/content/portal-demo';
import { getFeatureFlags } from '@/lib/flags';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.settings[locale], portalLabels.synthetic[locale]);
}

export default function PracticeSettingsPage() {
  return <PortalSettingsPanel flags={getFeatureFlags()} />;
}
