'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/locales';
import {
  serviceBands,
  serviceCapabilities,
  type ServiceBandFilter,
} from '@/content/service-catalog';

const bandLabel: Record<ServiceBandFilter, { en: string; es: string }> = {
  all: { en: 'All', es: 'Todas' },
  revenue: { en: 'Revenue', es: 'Ingresos' },
  operations: { en: 'Operations', es: 'Operaciones' },
  technology: { en: 'Technology', es: 'Tecnología' },
  strategy: { en: 'Strategy', es: 'Estrategia' },
};

export function ServiceExplorer({ locale }: { locale: Locale }) {
  const [band, setBand] = useState<ServiceBandFilter>('all');
  const [selectedId, setSelectedId] = useState(serviceCapabilities[0]?.id ?? 'rcm');
  const es = locale === 'es';
  const visible = useMemo(
    () => serviceCapabilities.filter((item) => band === 'all' || item.band === band),
    [band],
  );
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? serviceCapabilities[0];
  if (!selected) return null;

  return (
    <section className="mt-10" aria-labelledby="service-explorer-heading" data-testid="service-explorer">
      <p className="overline">{es ? 'Catálogo de capacidades' : 'Capability catalog'}</p>
      <h2 id="service-explorer-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'Dieciséis capacidades. Un recorrido de cuatro pasos.' : 'Sixteen capabilities. A four-step journey.'}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={es ? 'Categoría de servicios' : 'Service category'}>
        {serviceBands.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            data-active={band === item}
            aria-pressed={band === item}
            onClick={() => {
              setBand(item);
              const next = serviceCapabilities.find((capability) => item === 'all' || capability.band === item);
              if (next) setSelectedId(next.id);
            }}
          >
            {bandLabel[item][locale]}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <ul className="grid gap-2" aria-label={es ? 'Capacidades' : 'Capabilities'}>
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="surface min-h-11 w-full px-3 py-3 text-left text-sm font-bold"
                aria-pressed={selected.id === item.id}
                onClick={() => setSelectedId(item.id)}
              >
                {item.name[locale]}
              </button>
            </li>
          ))}
        </ul>
        <article className="surface p-5">
          <p className="overline">{bandLabel[selected.band][locale]}</p>
          <h3 className="mt-2 text-2xl font-extrabold">{selected.name[locale]}</h3>
          <p className="muted mt-2 text-sm">{selected.summary[locale]}</p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {selected.steps[locale].map((step, index) => (
              <li key={step} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm">
                <span className="overline">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-1 block font-semibold">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm">
            <span className="status-badge" data-tone="warn">
              {selected.kpi[locale]}
            </span>
          </p>
        </article>
      </div>
    </section>
  );
}
