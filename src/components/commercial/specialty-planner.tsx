'use client';

import { Suspense, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

function SpecialtyPlannerInner({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const specParam = searchParams.get('spec');
  const stateParam = searchParams.get('state');
  const payerParam = searchParams.get('payer');

  const stateCode = (states.find(([code]) => code === stateParam)?.[0] ?? 'TX') as (typeof states)[number][0];
  const payer = (payers.find((item) => item === payerParam) ?? 'Medicare') as (typeof payers)[number];

  const activeIndex = useMemo(() => {
    if (specParam == null || specParam === '') return 0;
    const index = Number(specParam);
    if (!Number.isInteger(index) || index < 0 || index >= specialties.length) return 0;
    return index;
  }, [specParam]);

  const specialty = specialties[activeIndex] ?? specialties[0];
  const es = locale === 'es';
  if (!specialty) return null;
  const asc = specialty.slug === 'ambulatory-surgery';
  const stateName = states.find((item) => item[0] === stateCode)?.[1] ?? stateCode;

  function patchParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value == null || value === '') params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <section className="mt-8" aria-labelledby="planner-heading" data-testid="specialty-planner">
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
          <select
            value={stateCode}
            onChange={(event) => patchParams({ state: event.target.value })}
          >
            {states.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{es ? 'Especialidad' : 'Specialty'}</span>
          <select
            value={specialty.slug}
            onChange={(event) => {
              const index = specialties.findIndex((item) => item.slug === event.target.value);
              patchParams({ spec: index >= 0 ? String(index) : '0' });
            }}
          >
            {specialties.map((item, index) => (
              <option key={item.slug} value={item.slug}>
                {index === activeIndex ? '• ' : ''}
                {item.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{es ? 'Clase de pagador' : 'Payer class'}</span>
          <select value={payer} onChange={(event) => patchParams({ payer: event.target.value })}>
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
        <article className="surface p-4" id={`specialty-${specialty.slug}`}>
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
                : 'Payer class changes forms and timelines. There is no live connection.'}
          </p>
          {asc ? (
            <p className="mt-2 text-xs text-[var(--amber)]">
              {es
                ? 'ASC: confirme privilegios de instalación y anexos de contrato de muestra.'
                : 'ASC: confirm facility privileges and sample contract exhibits.'}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}

export function SpecialtyPlanner({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<div className="surface mt-8 p-5 text-sm" aria-hidden="true" />}>
      <SpecialtyPlannerInner locale={locale} />
    </Suspense>
  );
}
