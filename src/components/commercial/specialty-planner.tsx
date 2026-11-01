'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { specialties } from '@/content/specialties';

const states = [
  ['TX', 'Texas'],
  ['CA', 'California'],
  ['FL', 'Florida'],
  ['NY', 'New York'],
  ['AZ', 'Arizona'],
  ['ID', 'Idaho'],
  ['PA', 'Pennsylvania'],
  ['IL', 'Illinois'],
] as const;

const payers = ['Medicare', 'Medicaid', 'BCBS', 'Commercial'] as const;

export function SpecialtyPlanner({ locale }: { locale: Locale }) {
  const [stateCode, setStateCode] = useState<(typeof states)[number][0]>('TX');
  const [slug, setSlug] = useState(specialties[0]?.slug ?? 'internal-family-medicine');
  const [payer, setPayer] = useState<(typeof payers)[number]>('Medicare');
  const es = locale === 'es';
  const specialty = useMemo(
    () => specialties.find((item) => item.slug === slug) ?? specialties[0],
    [slug],
  );
  const stateName = states.find((item) => item[0] === stateCode)?.[1] ?? stateCode;
  if (!specialty) return null;
  const asc = specialty.slug === 'ambulatory-surgery';

  return (
    <section className="mt-8" aria-labelledby="planner-heading">
      <p className="overline">{es ? 'Especialidades / pagadores' : 'Specialties / payers'}</p>
      <h2 id="planner-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'Mapee la relación. No prometa la regla.' : 'Map the relationship. Do not promise the rule.'}
      </h2>
      <p className="muted mt-2 max-w-3xl text-sm">
        {es
          ? 'El estado, la especialidad y la clase de pagador cambian lo que hay que verificar antes de facturar o inscribir. Esto es una demo educativa, no una regla universal ni asesoría de facturación.'
          : 'State, specialty and payer class change what must be verified before billing or enrollment. This is an educational demo, not a universal rule or billing advice.'}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="field">
          <span>{es ? 'Estado' : 'State'}</span>
          <select value={stateCode} onChange={(event) => setStateCode(event.target.value as (typeof states)[number][0])}>
            {states.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{es ? 'Especialidad' : 'Specialty'}</span>
          <select value={specialty.slug} onChange={(event) => setSlug(event.target.value)}>
            {specialties.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{es ? 'Clase de pagador' : 'Payer class'}</span>
          <select value={payer} onChange={(event) => setPayer(event.target.value as (typeof payers)[number])}>
            {payers.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <article className="surface p-4">
          <p className="overline">01 / {es ? 'Estado' : 'State'}</p>
          <h3 className="mt-2 font-bold">{stateName}</h3>
          <p className="muted mt-2 text-sm">
            {es
              ? 'La licencia, Medicaid y el registro local afectan la preparación de inscripción. Confirme la fuente estatal.'
              : 'Licensure, Medicaid administration and local registration affect enrollment readiness. Confirm the state source.'}
          </p>
        </article>
        <article className="surface p-4">
          <p className="overline">02 / {es ? 'Especialidad' : 'Specialty'}</p>
          <h3 className="mt-2 font-bold">{specialty.name[locale]}</h3>
          <p className="muted mt-2 text-sm">{specialty.summary[locale]}</p>
        </article>
        <article className="surface p-4">
          <p className="overline">03 / {es ? 'Pagador' : 'Payer'}</p>
          <h3 className="mt-2 font-bold">{payer}</h3>
          <p className="muted mt-2 text-sm">
            {payer === 'Medicaid'
              ? es
                ? 'Medicaid varía por estado. Esta ficha no afirma un directorio de planes.'
                : 'Medicaid varies by state. This card does not claim a plan directory.'
              : es
                ? 'La clase de pagador cambia formularios y plazos. No hay conexión en vivo.'
                : 'Payer class changes forms and timing. There is no live connection.'}
          </p>
        </article>
      </div>
      {asc ? (
        <aside className="surface mt-4 p-4">
          <h3 className="font-bold">{es ? 'Enfoque ASC · demo educativa' : 'ASC focus · educational demo'}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {specialty.focus[locale].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="muted mt-3 text-sm">
            {es
              ? 'Modificador bilateral, carve-out de implante y la división centro versus profesional se revisan como trabajo administrativo. No garantizan un pago.'
              : 'Bilateral modifier, implant carve-out and the facility versus professional split are reviewed as administrative work. They do not guarantee payment.'}
          </p>
        </aside>
      ) : null}
    </section>
  );
}
