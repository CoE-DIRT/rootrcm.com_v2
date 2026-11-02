'use client';

import { usePortalDemo } from '@/components/portal/portal-frame';
import { loadPortalPriorAuth } from './load-prior-auth';
import { priorAuthStatusLabel } from './types';

const rows = loadPortalPriorAuth();

export function PriorAuthTracker({
  labels,
}: {
  labels: {
    eyebrow: string;
    title: string;
    body: string;
    patientRef: string;
    physician: string;
    cpt: string;
    payer: string;
    status: string;
    sla: string;
  };
}) {
  const { locale } = usePortalDemo();
  const es = locale === 'es';

  return (
    <div>
      <p className="overline">{labels.eyebrow}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{labels.title}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">{labels.body}</p>
      <div className="data-table-wrap surface mt-4">
        <table className="data-table">
          <thead>
            <tr>
              <th>{labels.patientRef}</th>
              <th>{labels.physician}</th>
              <th>{labels.cpt}</th>
              <th>{labels.payer}</th>
              <th>{labels.status}</th>
              <th>{labels.sla}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const tone =
                row.status === 'approved' ? 'good' : row.urgency === 'urgent' ? 'bad' : 'warn';
              return (
                <tr key={row.id}>
                  <td>
                    <code className="text-sm font-semibold">{row.patientRef}</code>
                  </td>
                  <td>{row.orderingPhysician}</td>
                  <td>{row.cpt}</td>
                  <td>{row.payer}</td>
                  <td>
                    <span className="status-badge" data-tone={tone}>
                      {priorAuthStatusLabel[row.status][locale]}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge" data-tone={row.urgency === 'urgent' ? 'bad' : 'warn'}>
                      {row.slaRemaining[locale]}
                    </span>
                    <span className="muted mt-1 block text-xs">
                      {es ? 'Plantilla SLA' : 'SLA template'}: {row.slaLabel[locale]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
