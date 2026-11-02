'use client';

import { portalLabels, priorAuthRows } from '@/content/portal-demo';
import { usePortalDemo } from './portal-frame';
import { PortalOrgScope } from './portal-org-scope';

export function PortalPriorAuthPanel() {
  const { locale } = usePortalDemo();
  const es = locale === 'es';

  return (
    <PortalOrgScope showKpis>
      <p className="overline">{es ? 'Sin conectividad de pagador' : 'No payer connectivity'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.authorizations[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {es
          ? 'Estas filas no se enviaron. El adaptador de pagador permanece desactivado.'
          : 'These rows were not submitted. The payer adapter stays disabled.'}
      </p>
      <ul className="mt-4 grid gap-3">
        {priorAuthRows.map((row) => (
          <li key={row.id} className="surface p-4">
            <h2 className="font-bold">{row.label[locale]}</h2>
            <p className="mt-2 text-sm">
              <span className="status-badge" data-tone="warn">{row.state[locale]}</span>
            </p>
          </li>
        ))}
      </ul>
    </PortalOrgScope>
  );
}
