'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/locales';

const stages = [
  ['Discover', 'Descubrir', 'Understand practice reality', 'Entender la realidad de la práctica'],
  ['Assess', 'Evaluar', 'Establish a credible baseline', 'Definir una línea base fiable'],
  ['Scope', 'Definir alcance', 'Set boundaries and owners', 'Definir límites y responsables'],
  ['Onboard', 'Incorporar', 'Validate people and documentation', 'Validar equipos y documentos'],
  ['Connect', 'Conectar', 'Map systems before integration', 'Mapear sistemas antes de integrar'],
  ['Execute', 'Ejecutar', 'Deliver controlled workstreams', 'Ejecutar flujos controlados'],
  ['Monitor', 'Monitorear', 'Track accountable action', 'Supervisar acciones responsables'],
  ['Optimize', 'Optimizar', 'Measure and refine the work', 'Medir y afinar el trabajo'],
] as const;

export function TimelineSection({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const es = locale === 'es';
  const current = stages[index] ?? stages[0];
  return (
    <section className="mt-10" aria-labelledby="timeline-heading">
      <p className="overline">{es ? 'Transición operativa' : 'Operational transition'}</p>
      <h2 id="timeline-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'Ocho etapas. Sin reemplazo forzado del EHR.' : 'Eight stages. No forced EHR replacement.'}
      </h2>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage, stageIndex) => (
          <li key={stage[0]}>
            <button
              type="button"
              className="surface min-h-11 w-full p-3 text-left"
              aria-pressed={index === stageIndex}
              onClick={() => setIndex(stageIndex)}
            >
              <span className="overline">{String(stageIndex + 1).padStart(2, '0')}</span>
              <span className="mt-1 block font-bold">{es ? stage[1] : stage[0]}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="muted mt-3 text-sm" aria-live="polite">
        {es ? current[3] : current[2]}{' '}
        {es
          ? 'Modelo orientativo; integraciones y plazos dependen del alcance escrito.'
          : 'A guided delivery model. Integrations and timelines depend on written scope.'}
      </p>
    </section>
  );
}
