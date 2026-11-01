'use client';

import { useMemo, useState, useTransition } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { copy } from '@/content/messages';

type Scenario = 'bundled' | 'distinct' | 'bilateral';

type SimResult = {
  elapsedMicros: number;
  accepted: boolean;
  recommendations: string[];
};

const scenarios: Record<
  Scenario,
  { primary: string; primaryLabel: string; secondary: string; secondaryLabel: string; modifiers: string[] }
> = {
  bundled: {
    primary: '29881',
    primaryLabel: 'Meniscectomy',
    secondary: '29877',
    secondaryLabel: 'Debridement',
    modifiers: [],
  },
  distinct: {
    primary: '29881',
    primaryLabel: 'Meniscectomy',
    secondary: '29877',
    secondaryLabel: 'Debridement',
    modifiers: ['59'],
  },
  bilateral: {
    primary: '29881',
    primaryLabel: 'Meniscectomy',
    secondary: '',
    secondaryLabel: '',
    modifiers: ['50'],
  },
};

function simulate(scenario: Scenario): SimResult {
  const started = performance.now();
  const config = scenarios[scenario];
  const recommendations: string[] = [];
  let accepted = true;

  if (scenario === 'bundled') {
    accepted = false;
    recommendations.push('Add Modifier -59 / Check payer unbundling guidelines');
    recommendations.push('CPT 29877 is typically bundled into 29881 in the same compartment');
  } else if (scenario === 'distinct') {
    recommendations.push('Distinct-procedure modifier present — verify separate compartment documentation');
    recommendations.push('MPPR 50% discount applied to subordinate surgical CPT 29877');
  } else {
    recommendations.push('CPT 29881 with -50: ASC facility claims often report RT/LT or units=2');
  }

  // Deterministic synthetic latency in the microsecond display band (client-side only).
  const elapsedMicros = Math.max(12, Math.round((performance.now() - started) * 1000) + 40 + config.primary.length);

  return { elapsedMicros, accepted, recommendations };
}

export function GoClaimPreview({ locale }: { locale: Locale }) {
  const t = copy(locale).technology.goPreview;
  const [scenario, setScenario] = useState<Scenario>('bundled');
  const [result, setResult] = useState<SimResult | null>(() => simulate('bundled'));
  const [pending, startTransition] = useTransition();

  const active = scenarios[scenario];
  const lines = useMemo(() => {
    const rows = [
      { cpt: active.primary, label: active.primaryLabel, modifiers: scenario === 'bilateral' ? active.modifiers : [] },
    ];
    if (active.secondary) {
      rows.push({
        cpt: active.secondary,
        label: active.secondaryLabel,
        modifiers: scenario === 'distinct' ? active.modifiers : [],
      });
    }
    return rows;
  }, [active, scenario]);

  function run(next: Scenario) {
    setScenario(next);
    startTransition(() => {
      setResult(simulate(next));
    });
  }

  return (
    <section
      className="relative mt-10 overflow-hidden rounded-[23px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-8"
      aria-labelledby="go-claim-preview-heading"
      data-testid="go-claim-preview"
    >
      <div className="pointer-events-none absolute -right-14 -top-14 size-48 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" />
      <div className="relative">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="go-claim-preview-heading" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          {t.title}
        </h2>
        <p className="muted mt-3 max-w-3xl text-sm">{t.body}</p>

        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/40 bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--warning)]"
          role="status"
        >
          <ShieldAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {t.disclaimer}
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={t.scenariosLabel}>
          {(Object.keys(scenarios) as Scenario[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={scenario === key}
              onClick={() => run(key)}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-offset-2 ${
                scenario === key
                  ? 'border-[var(--cyan)] bg-[var(--surface-2)] text-[var(--cyan)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--cyan)]'
              }`}
            >
              {t.scenarios[key]}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {lines.map((line) => (
            <div key={`${line.cpt}-${line.modifiers.join(',')}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{t.cptLine}</p>
              <p className="mt-1 font-mono text-lg font-extrabold tracking-tight">
                {line.cpt}
                {line.modifiers.length > 0 ? (
                  <span className="ml-2 text-sm font-bold text-[var(--cyan)]">
                    -{line.modifiers.join(',-')}
                  </span>
                ) : null}
              </p>
              <p className="muted mt-1 text-sm">{line.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4" aria-live="polite">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Sparkles className="size-4 text-[var(--cyan)]" aria-hidden="true" />
            {pending ? t.running : t.responseTime.replace('{us}', String(result?.elapsedMicros ?? 0))}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {result?.accepted ? t.accepted : t.rejected}
          </p>
          <ul className="mt-3 grid gap-2">
            {(result?.recommendations ?? []).map((item) => (
              <li key={item} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
