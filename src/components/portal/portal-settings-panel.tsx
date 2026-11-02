'use client';

import { copy } from '@/content/messages';
import { portalLabels } from '@/content/portal-demo';
import type { FeatureFlags } from '@/lib/flags';
import { usePortalDemo } from './portal-frame';
import { PortalOrgScope } from './portal-org-scope';

export function PortalSettingsPanel({ flags }: { flags: FeatureFlags }) {
  const { locale } = usePortalDemo();
  const t = copy(locale);
  const es = locale === 'es';
  const rows = [
    ['Auth', flags.auth],
    ['CRM', flags.crm],
    ['Billing', flags.billing],
    ['Prospecting', flags.prospecting],
    ['Live claims', flags.liveClaims],
  ] as const;

  return (
    <PortalOrgScope>
      <p className="overline">{es ? 'Nada se guarda' : 'Nothing is saved'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.settings[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {portalLabels.personaNote[locale]} {t.adaptersOff}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(([name, enabled]) => (
          <li key={name} className="surface flex items-center justify-between p-4 text-sm">
            <span className="font-bold">{name}</span>
            <span className="status-badge" data-tone={enabled ? 'good' : 'warn'}>
              {enabled ? (es ? 'Activado' : 'Enabled') : es ? 'Desactivado' : 'Disabled'}
            </span>
          </li>
        ))}
      </ul>
    </PortalOrgScope>
  );
}
