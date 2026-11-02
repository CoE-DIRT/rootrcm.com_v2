import type { Metadata } from 'next';
import { RbacSimulator } from '@/features/portal/settings/rbac-simulator';
import { copy } from '@/content/messages';
import { RbacSimulator } from '@/features/portal/settings/rbac-simulator';
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
  const portal = t.portal;

  const adapterRows = (
    [
      ['Auth', flags.auth],
      ['CRM', flags.crm],
      ['Billing', flags.billing],
      ['Prospecting', flags.prospecting],
      ['Live claims', flags.liveClaims],
    ] as const
  ).map(([name, enabled]) => ({
    name,
    enabled,
    on: es ? 'Activado' : 'Enabled',
    off: es ? 'Desactivado' : 'Disabled',
  }));

  return (
    <RbacSimulator
      labels={{
        eyebrow: portal.portalSettingsEyebrow,
        title: portal.portalSettingsTitle,
        body: `${portal.portalSettingsBody} ${t.adaptersOff}`,
        personaLabel: portal.portalSettingsPersona,
        auditTitle: portal.portalSettingsAuditTitle,
        addEvent: portal.portalSettingsAuditAdd,
        syntheticNote: portalLabels.personaNote[locale],
        panels: {
          physician: {
            title: portal.portalSettingsPanelPhysicianTitle,
            body: portal.portalSettingsPanelPhysicianBody,
            items: portal.portalSettingsPanelPhysicianItems,
          },
          admin: {
            title: portal.portalSettingsPanelAdminTitle,
            body: portal.portalSettingsPanelAdminBody,
            items: portal.portalSettingsPanelAdminItems,
          },
          specialist: {
            title: portal.portalSettingsPanelSpecialistTitle,
            body: portal.portalSettingsPanelSpecialistBody,
            items: portal.portalSettingsPanelSpecialistItems,
          },
        },
      }}
      adapterRows={adapterRows}
    />
  );
}
