'use client';

import { useMemo, useState } from 'react';
import { usePortalDemo } from '@/components/portal/portal-frame';
import { loadPortalAuditLog } from './load-audit-log';
import { rbacPersonaLabel, type PortalRbacPersona } from './types';

const seedEvents = loadPortalAuditLog();

type RbacSimulatorProps = {
  labels: {
    eyebrow: string;
    title: string;
    body: string;
    personaLabel: string;
    auditTitle: string;
    addEvent: string;
    panels: {
      physician: { title: string; body: string; items: readonly string[] };
      admin: { title: string; body: string; items: readonly string[] };
      specialist: { title: string; body: string; items: readonly string[] };
    };
    syntheticNote: string;
  };
  adapterRows: readonly { name: string; enabled: boolean; on: string; off: string }[];
};

export function RbacSimulator({ labels, adapterRows }: RbacSimulatorProps) {
  const { locale, persona, setPersona } = usePortalDemo();
  const [events, setEvents] = useState(() => [...seedEvents]);
  const es = locale === 'es';

  const panel = useMemo(() => {
    if (persona === 'practice-physician') return labels.panels.physician;
    if (persona === 'root-rcm-specialist') return labels.panels.specialist;
    return labels.panels.admin;
  }, [persona, labels.panels]);

  function appendSimulatedEvent() {
    const next: (typeof events)[number] = {
      id: `syn-aud-live-${events.length + 1}`,
      at: new Date().toISOString(),
      actorRole: persona,
      summary: {
        en: 'Persona switch simulated',
        es: 'Cambio de persona simulado',
      },
      detail: {
        en: `Interactive audit ping as ${rbacPersonaLabel[persona].en}. Server entitlements unchanged.`,
        es: `Ping de auditoría interactivo como ${rbacPersonaLabel[persona].es}. Autorizaciones del servidor sin cambio.`,
      },
    };
    setEvents((prev) => [next, ...prev]);
  }

  return (
    <div>
      <p className="overline">{labels.eyebrow}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{labels.title}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">{labels.body}</p>

      <label className="field mt-4 max-w-md">
        <span>{labels.personaLabel}</span>
        <select
          value={persona}
          onChange={(event) => setPersona(event.target.value as PortalRbacPersona)}
          aria-label={labels.personaLabel}
        >
          {(Object.keys(rbacPersonaLabel) as PortalRbacPersona[]).map((key) => (
            <option key={key} value={key}>
              {rbacPersonaLabel[key][locale]}
            </option>
          ))}
        </select>
      </label>
      <p className="muted mt-2 text-xs">{labels.syntheticNote}</p>

      <section className="surface mt-4 p-4" aria-labelledby="rbac-panel-title">
        <h2 id="rbac-panel-title" className="text-lg font-bold">
          {panel.title}
        </h2>
        <p className="muted mt-2 text-sm">{panel.body}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {panel.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6" aria-labelledby="adapter-flags-title">
        <h2 id="adapter-flags-title" className="text-lg font-bold">
          {es ? 'Adaptadores (solo lectura)' : 'Adapters (read-only)'}
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {adapterRows.map((row) => (
            <li key={row.name} className="surface flex items-center justify-between p-4 text-sm">
              <span className="font-bold">{row.name}</span>
              <span className="status-badge" data-tone={row.enabled ? 'good' : 'warn'}>
                {row.enabled ? row.on : row.off}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6" aria-labelledby="audit-log-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="audit-log-title" className="text-lg font-bold">
            {labels.auditTitle}
          </h2>
          <button type="button" className="btn-secondary btn-sm" onClick={appendSimulatedEvent}>
            {labels.addEvent}
          </button>
        </div>
        <ol className="mt-3 space-y-2">
          {events.map((event) => (
            <li key={event.id} className="surface p-3 text-sm">
              <p className="font-bold">{event.summary[locale]}</p>
              <p className="muted mt-1 text-xs">
                {rbacPersonaLabel[event.actorRole][locale]} · {formatStamp(event.at, locale)}
              </p>
              <p className="mt-2">{event.detail[locale]}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function formatStamp(iso: string, locale: 'en' | 'es') {
  try {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
