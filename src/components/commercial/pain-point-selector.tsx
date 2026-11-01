'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/locales';

const pains = [
  {
    id: 'owners',
    en: 'Practice owners',
    es: 'Dueños de práctica',
    bodyEn: 'Outsourcing should stay auditable. Owners keep the next action visible. No recovery rate is claimed.',
    bodyEs: 'La externalización debe poder auditarse. Los dueños ven la siguiente acción. No se afirma una tasa de recobro.',
  },
  {
    id: 'asc',
    en: 'ASC directors',
    es: 'Dirección de ASC',
    bodyEn: 'Facility and professional work, implant carve-outs and modifiers are an operations calendar. This is educational demo copy, not billing advice.',
    bodyEs: 'El trabajo de centro y profesional, los carve-outs de implantes y los modificadores son un calendario operativo. Es una demo educativa, no asesoría de facturación.',
  },
  {
    id: 'mso',
    en: 'MSO executives',
    es: 'Ejecutivos de MSO',
    bodyEn: 'Multi-site work needs a named owner per exception. Live payer, EHR and payment connections stay disabled.',
    bodyEs: 'El trabajo multicentro necesita un responsable por excepción. Las conexiones a pagadores, EHR y pagos siguen desactivadas.',
  },
] as const;

export function PainPointSelector({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<(typeof pains)[number]['id']>('owners');
  const es = locale === 'es';
  const selected = pains.find((item) => item.id === active) ?? pains[0];
  return (
    <section className="mt-10" aria-labelledby="pain-heading">
      <p className="overline">{es ? 'A quién sirve el modelo' : 'Who the model is for'}</p>
      <h2 id="pain-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'Elija un punto de vista operativo' : 'Choose an operating point of view'}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={es ? 'Puntos de dolor' : 'Pain points'}>
        {pains.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            data-active={active === item.id}
            aria-pressed={active === item.id}
            onClick={() => setActive(item.id)}
          >
            {es ? item.es : item.en}
          </button>
        ))}
      </div>
      <p className="surface mt-4 p-4 text-sm">{es ? selected.bodyEs : selected.bodyEn}</p>
    </section>
  );
}
