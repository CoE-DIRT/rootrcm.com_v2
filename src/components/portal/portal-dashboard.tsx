'use client';

import Link from 'next/link';
import { useState } from 'react';
import { illustrativeAr, portalLabels, portalOrganizations } from '@/content/portal-demo';
import { localizedPath } from '@/lib/paths';
import { usePortalDemo } from './portal-frame';

export function PortalDashboard() {
  const { locale, orgId, persona } = usePortalDemo();
  const [note, setNote] = useState('');
  const org = portalOrganizations.find((item) => item.id === orgId);
  const figures = illustrativeAr(orgId);
  const es = locale === 'es';
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const cards = [
    { label: es ? 'CxC total' : 'Total A/R', value: money.format(figures.total) },
    { label: es ? 'CxC > 90 días' : '>90 day A/R', value: `${figures.over90}%` },
    { label: es ? 'Limpieza en primer paso' : 'First-pass clean claim', value: `${figures.clean}%` },
    { label: es ? 'Tasa de denegación' : 'Denial rate', value: `${figures.denial}%` },
    { label: es ? 'Ingreso no mapeado' : 'Unmapped revenue', value: money.format(figures.unmapped) },
  ];

  return (
    <div data-testid="portal-dashboard">
      <p className="overline">{es ? 'Cifras ilustrativas de demostración' : 'Illustrative demo figures'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">
        {es ? 'Operaciones de ingresos, en vista de muestra' : 'Revenue operations, in a sample view'}
      </h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {org?.name ?? orgId}. {portalLabels.synthetic[locale]}{' '}
        {persona === 'operations-lead'
          ? es
            ? 'La vista de líder solo cambia esta etiqueta. No abre trabajo de otro inquilino.'
            : 'The lead view only changes this label. It does not open another tenant’s work.'
          : es
            ? 'La vista de administración es la misma cola sintética.'
            : 'The admin view is the same synthetic queue.'}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="surface p-4">
            <p className="muted text-xs">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{card.value}</p>
            <p className="mt-1 text-[11px] text-[var(--amber)]">{es ? 'No verificado' : 'Not verified'}</p>
          </article>
        ))}
      </div>
      <section className="mt-6" aria-labelledby="aging-heading">
        <h2 id="aging-heading" className="text-lg font-bold">{es ? 'Bandas de antigüedad de CxC' : 'A/R aging bands'}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {figures.bands.map((band) => (
            <article key={band.key} className="surface p-3">
              <p className="overline">{band.key}</p>
              <p className="mt-2 font-bold">{money.format(band.amount)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-6" aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-lg font-bold">{es ? 'Acciones de demostración' : 'Demo-only actions'}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="btn-secondary btn-sm" href={localizedPath(locale, '/portal/denials')}>
            {es ? 'Abrir cola sintética' : 'Open synthetic queue'}
          </Link>
          <Link className="btn-secondary btn-sm" href={localizedPath(locale, '/portal/credentialing')}>
            {es ? 'Ver plantilla' : 'View roster'}
          </Link>
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() =>
              setNote(
                es
                  ? 'La conectividad con pagadores está desactivada. Esta acción no contacta a un pagador.'
                  : 'Payer connectivity is disabled. This action does not contact a payer.',
              )
            }
          >
            {es ? 'Estado del pagador' : 'Payer status'}
          </button>
        </div>
        {note ? <p className="status-banner mt-3" role="status">{note}</p> : null}
      </section>
    </div>
  );
}
