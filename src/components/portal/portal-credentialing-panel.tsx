'use client';

import { credentialingRoster, portalLabels } from '@/content/portal-demo';
import { usePortalDemo } from './portal-frame';
import { PortalOrgScope } from './portal-org-scope';

export function PortalCredentialingPanel() {
  const { locale } = usePortalDemo();
  const es = locale === 'es';

  return (
    <PortalOrgScope>
      <p className="overline">{es ? 'Datos sintéticos' : 'Synthetic data'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.credentialing[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {es
          ? 'Los identificadores NPI son marcadores de texto, no NPI reales. Las fechas de licencia y de privilegio ASC son de demostración.'
          : 'NPI identifiers are text placeholders, not real NPIs. License and ASC privilege dates are demonstration values.'}
      </p>
      <div className="data-table-wrap surface mt-4">
        <table className="data-table">
          <thead>
            <tr>
              <th>{es ? 'Profesional' : 'Provider'}</th>
              <th>NPI</th>
              <th>CAQH</th>
              <th>{es ? 'Licencia' : 'License'}</th>
              <th>{es ? 'Privilegio ASC' : 'ASC privilege'}</th>
            </tr>
          </thead>
          <tbody>
            {credentialingRoster.map((row) => (
              <tr key={row.id}>
                <td>{row.name[locale]}</td>
                <td>{row.npi}</td>
                <td>{row.caqh[locale]}</td>
                <td>{row.license[locale]}</td>
                <td>{row.privilege[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalOrgScope>
  );
}
