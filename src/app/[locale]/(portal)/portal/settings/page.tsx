import type { Metadata } from 'next';
import { RbacSimulator } from '@/features/portal/settings/rbac-simulator';
import { copy } from '@/content/messages';
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

export default async function PracticeSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const flags = getFeatureFlags();
  const s = t.portalSettings;
  const es = locale === 'es';

  const labels = {
    eyebrow: s.eyebrow,
    title: s.title,
    body: s.body,
    personaLabel: s.personaLabel,
    auditTitle: s.auditTitle,
    addEvent: s.addEvent,
    syntheticNote: s.syntheticNote,
    panels: {
      physician: {
        title: s.panelPhysicianTitle,
        body: s.panelPhysicianBody,
        items: s.panelPhysicianItems,
      },
      admin: {
        title: s.panelAdminTitle,
        body: s.panelAdminBody,
        items: s.panelAdminItems,
      },
      specialist: {
        title: s.panelSpecialistTitle,
        body: s.panelSpecialistBody,
        items: s.panelSpecialistItems,
      },
    },
  };

  const adapterRows = [
    { name: 'Auth', enabled: flags.auth, on: es ? 'Activado' : 'Enabled', off: es ? 'Desactivado' : 'Disabled' },
    { name: 'CRM', enabled: flags.crm, on: es ? 'Activado' : 'Enabled', off: es ? 'Desactivado' : 'Disabled' },
    { name: 'Billing', enabled: flags.billing, on: es ? 'Activado' : 'Enabled', off: es ? 'Desactivado' : 'Disabled' },
    {
      name: 'Prospecting',
      enabled: flags.prospecting,
      on: es ? 'Activado' : 'Enabled',
      off: es ? 'Desactivado' : 'Disabled',
    },
    {
      name: 'Live claims',
      enabled: flags.liveClaims,
      on: es ? 'Activado' : 'Enabled',
      off: es ? 'Desactivado' : 'Disabled',
    },
  ] as const;

  return <RbacSimulator labels={labels} adapterRows={adapterRows} />;
}
