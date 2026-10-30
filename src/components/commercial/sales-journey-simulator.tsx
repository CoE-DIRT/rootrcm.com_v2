'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronRight, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import {
  createSalesState, qualificationScore, milestoneDescriptions, milestoneNames,
  salesEntitlements, salesMilestones, salesScenarios, scenarioFor, transitionSales,
  type SalesAction, type SalesOffer, type SalesScenario, type SalesState,
} from '@/domain/sales-simulator';

const labels = {
  en: {
    title: 'Client acquisition to service activation',
    intro: 'Run the complete ROOT commercial and onboarding journey with one linked fictional organization.',
    preview: 'SIMULATED WORKSPACE · No CRM records, signatures, payments or customer accounts are created',
    scenario: 'Practice', offer: 'Service offer', step: 'Current step', journey: 'Commercial journey',
    forward: 'Advance stage', back: 'Previous stage', reset: 'Reset journey',
    inject: 'Simulate blocker', resolve: 'Resolve blocker',
    blocked: 'Action paused: resolve the simulated exception before continuing.',
    boundary: 'The workflow has reached its start or end.',
    score: 'Illustrative qualification score', entitlements: 'Plan capabilities',
    history: 'Event history', empty: 'No events yet. Advance the scenario to create an auditable transition.',
    locked: 'Not included in selected offer', enabled: 'Included', noClaims: 'No live tenant or external system action',
    workspace: 'Explore the operational dashboard', complete: 'All demonstration stages completed',
    provider: 'Clinicians', route: 'NEXT ACTION', scope: 'Configured feature scope',
  },
  es: {
    title: 'De adquisición de clientes a activación del servicio',
    intro: 'Explore el recorrido comercial e incorporación de una organización ficticia.',
    preview: 'SIMULADOR · No se crean registros CRM, firmas, pagos ni cuentas reales',
    scenario: 'Práctica', offer: 'Servicio', step: 'Etapa actual', journey: 'Recorrido comercial',
    forward: 'Avanzar etapa', back: 'Etapa anterior', reset: 'Restablecer',
    inject: 'Simular bloqueo', resolve: 'Resolver bloqueo',
    blocked: 'Acción pausada: resuelva la excepción simulada.',
    boundary: 'El flujo llegó a su inicio o final.',
    score: 'Puntuación ilustrativa', entitlements: 'Capacidades del plan',
    history: 'Historial de eventos', empty: 'Sin eventos. Avance para registrar una transición.',
    locked: 'No incluido en esta oferta', enabled: 'Incluido', noClaims: 'Sin acciones en sistemas externos',
    workspace: 'Explorar panel operativo', complete: 'Recorrido de demostración completado',
    provider: 'Profesionales', route: 'SIGUIENTE ACCIÓN', scope: 'Capacidades configuradas',
  },
} as const;

const offerLabels: Record<SalesOffer, { en: string; es: string }> = {
  'free-account-consultation': { en: 'Free account and consultation', es: 'Cuenta y consulta gratuitas' },
  'revenue-diagnostic': { en: 'Revenue Diagnostic ($2,500)', es: 'Diagnóstico de ingresos ($2,500)' },
  'managed-rcm': { en: 'Managed RCM (scoped)', es: 'RCM administrado (según alcance)' },
  'custom-mso': { en: 'Custom MSO partnership', es: 'Alianza MSO personalizada' },
};

const featureLabels: Record<string, { en: string; es: string }> = {
  basic_workspace: { en: 'Basic workspace', es: 'Espacio básico' },
  consultation: { en: 'Consultation workflow', es: 'Proceso de consultas' },
  diagnostic_report: { en: 'Diagnostic reporting', es: 'Informes de diagnóstico' },
  rcm_dashboard: { en: 'RCM operations dashboard', es: 'Panel de ingresos' },
  credentialing_tracker: { en: 'Credentialing tracker', es: 'Seguimiento de credencialización' },
  managed_requests: { en: 'Managed service requests', es: 'Solicitudes de servicios administrados' },
  enterprise_reporting: { en: 'Enterprise reporting', es: 'Informes empresariales' },
  multi_location: { en: 'Multi-location controls', es: 'Controles de múltiples ubicaciones' },
};

const card = 'rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5';
const control = 'min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold focus-visible:outline-offset-2';
const allFeatures = Object.keys(featureLabels);

export function SalesJourneySimulator({ locale }: { locale: Locale }) {
  const [state, setState] = useState<SalesState>(() => createSalesState());
  const [notice, setNotice] = useState('');
  const l = labels[locale];
  const scenario = scenarioFor(state);
  const stageIndex = salesMilestones.indexOf(state.milestone);
  const currentFeatures = salesEntitlements(state.offer);
  const score = qualificationScore(state);

  function act(action: SalesAction, value?: SalesOffer) {
    const result = transitionSales(state, action, value);
    if (result.ok) {
      setState(result.state);
      setNotice('');
    } else {
      setNotice(result.reason === 'blocked' ? l.blocked : l.boundary);
    }
  }
  function chooseScenario(id: SalesScenario['id']) {
    setState(createSalesState(id));
    setNotice('');
  }

  return (
    <section data-testid="sales-journey-simulator" className="space-y-5">
      <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="eyebrow">{l.journey}</p>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--cyan)]">
            {l.preview}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{l.title}</h2>
        <p className="muted mt-2 max-w-3xl text-sm">{l.intro}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-bold">
            {l.scenario}
            <select className={`mt-2 block w-full ${control}`} value={state.scenarioId}
              onChange={(e) => chooseScenario(e.target.value as SalesScenario['id'])}>
              {salesScenarios.map((item) => <option key={item.id} value={item.id}>{item.organization}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">
            {l.offer}
            <select className={`mt-2 block w-full ${control}`} value={state.offer}
              onChange={(e) => act('select_offer', e.target.value as SalesOffer)}>
              {(Object.keys(offerLabels) as SalesOffer[]).map((item) =>
                <option key={item} value={item}>{offerLabels[item][locale]}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">{scenario.specialty}</span>
          <span className="muted">· {scenario.providerCount} {l.provider}</span>
          <span className="muted">· {l.score}: <strong>{score.score}/100</strong></span>
        </div>
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black">{l.journey}</h3>
          <span className="text-sm font-bold tabular-nums text-[var(--cyan)]">{stageIndex + 1}/{salesMilestones.length}</span>
        </div>
        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {salesMilestones.map((step, i) => (
            <li key={step} data-testid={`sales-stage-${step}`}
              aria-current={state.milestone === step ? 'step' : undefined}
              className={`min-h-[74px] rounded-xl border p-3 ${i === stageIndex ? 'border-[var(--cyan)] bg-[var(--surface-2)]' : 'border-[var(--border)]'}`}>
              <span className="flex items-center gap-2 text-xs font-black text-[var(--cyan)]">
                {i < stageIndex ? <Check className="size-4" aria-hidden="true" /> : String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-sm font-bold">{milestoneNames[step][locale]}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl bg-[var(--surface-2)] p-4">
          <p className="eyebrow">{l.route}</p>
          <p className="mt-2 font-bold">{milestoneDescriptions[state.milestone][locale]}</p>
          <p className="muted mt-2 text-xs">{l.noClaims}</p>
        </div>

        {notice ? <p role="alert" className="mt-3 text-sm font-bold text-[var(--warning)]">{notice}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <button className={control} onClick={() => act('back')} disabled={stageIndex === 0}>
            <ArrowLeft className="mr-1 inline size-4" aria-hidden="true" />{l.back}
          </button>
          <button className={`${control} border-[var(--cyan)] text-[var(--cyan)]`}
            data-testid="sales-advance" onClick={() => act('advance')} disabled={stageIndex === salesMilestones.length - 1 || state.blocked}>
            {l.forward}<ArrowRight className="ml-1 inline size-4" aria-hidden="true" />
          </button>
          <button className={control} onClick={() => act('toggle_blocker')}>
            {state.blocked ? l.resolve : l.inject}
          </button>
          <button className={control} onClick={() => act('reset')}>
            <RotateCcw className="mr-1 inline size-4" aria-hidden="true" />{l.reset}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className={card}>
          <h3 className="text-lg font-black">{l.scope}</h3>
          <p className="muted mt-1 text-sm">{offerLabels[state.offer][locale]}</p>
          <ul className="mt-4 space-y-2">
            {allFeatures.map((feature) => {
              const allowed = currentFeatures.includes(feature);
              return <li key={feature} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-2)] p-3">
                <span className="text-sm font-semibold">{featureLabels[feature][locale]}</span>
                <span className={`text-xs font-bold ${allowed ? 'text-[var(--cyan)]' : 'muted'}`}>
                  {allowed ? l.enabled : l.locked}
                </span>
              </li>;
            })}
          </ul>
        </section>
        <section className={card}>
          <h3 className="text-lg font-black">{l.history}</h3>
          {state.events.length ? (
            <ol className="mt-4 max-h-[450px] space-y-3 overflow-y-auto">
              {[...state.events].reverse().map((event) => (
                <li key={event.id} className="rounded-xl border border-[var(--border)] p-3">
                  <p className="text-xs font-bold text-[var(--cyan)]">{event.id}</p>
                  <p className="mt-1 text-sm font-semibold">{milestoneNames[event.from][locale]}
                    <ChevronRight className="mx-1 inline size-4" aria-hidden="true" />
                    {milestoneNames[event.to][locale]}</p>
                  <p className="muted mt-1 text-xs">{l.preview}</p>
                </li>
              ))}
            </ol>
          ) : <p className="muted mt-4 text-sm">{l.empty}</p>}
        </section>
      </div>

      {state.milestone === 'active' ? (
        <div className={card}>
          <div className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5 text-[var(--cyan)]" aria-hidden="true" />{l.complete}</div>
          <Link className="btn-primary mt-4 inline-flex gap-2" href={localizedPath(locale, '/preview/client')}>
            {l.workspace}<ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="muted mt-3 text-xs">{l.noClaims}</p>
        </div>
      ) : null}
    </section>
  );
}
