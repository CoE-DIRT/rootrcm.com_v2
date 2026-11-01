'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import {
  CALCULATOR_BOUNDS,
  CALCULATOR_DEFAULTS,
  PRACTICE_TYPES,
  calculatorQueryString,
  clampCollections,
  clampDenialRate,
  computeLeakage,
  type PracticeType,
} from '@/lib/revenue-calculator';

function money(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value / 100);
}

export function RevenueCalculator({ locale }: { locale: Locale }) {
  const t = copy(locale).calculator;
  const [monthlyCollections, setMonthlyCollections] = useState<number>(
    CALCULATOR_DEFAULTS.monthlyCollections,
  );
  const [denialRate, setDenialRate] = useState<number>(CALCULATOR_DEFAULTS.denialRate);
  const [practiceType, setPracticeType] = useState<PracticeType>(
    CALCULATOR_DEFAULTS.practiceType,
  );

  const output = useMemo(
    () => computeLeakage({ monthlyCollections, denialRate, practiceType }),
    [monthlyCollections, denialRate, practiceType],
  );

  const onboardingHref = useMemo(() => {
    const qs = calculatorQueryString({ monthlyCollections, denialRate, practiceType });
    return `${localizedPath(locale, '/onboarding')}?${qs}`;
  }, [locale, monthlyCollections, denialRate, practiceType]);

  const practiceLabel = (id: PracticeType) => t.practiceTypes[id];

  return (
    <section
      className="surface mt-10 p-5 md:p-7"
      aria-labelledby="revenue-calculator-heading"
      data-testid="revenue-calculator"
    >
      <p className="overline">{t.eyebrow}</p>
      <h2 id="revenue-calculator-heading" className="enterprise-title mt-2 font-extrabold">
        {t.title}
      </h2>
      <p className="muted mt-2 max-w-3xl text-sm">{t.body}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <div>
            <label htmlFor="calc-collections" className="block text-sm font-semibold">
              {t.collectionsLabel}
            </label>
            <p id="calc-collections-hint" className="muted mt-1 text-xs">
              {t.collectionsHint}
            </p>
            <input
              id="calc-collections"
              type="range"
              className="mt-3 w-full accent-[var(--cyan)]"
              min={CALCULATOR_BOUNDS.monthlyCollections.min}
              max={CALCULATOR_BOUNDS.monthlyCollections.max}
              step={CALCULATOR_BOUNDS.monthlyCollections.step}
              value={monthlyCollections}
              aria-valuemin={CALCULATOR_BOUNDS.monthlyCollections.min}
              aria-valuemax={CALCULATOR_BOUNDS.monthlyCollections.max}
              aria-valuenow={monthlyCollections}
              aria-valuetext={money(locale, monthlyCollections)}
              aria-describedby="calc-collections-hint"
              onChange={(event) =>
                setMonthlyCollections(clampCollections(Number(event.target.value)))
              }
            />
            <p className="mt-2 text-lg font-extrabold tracking-tight">
              {money(locale, monthlyCollections)}
            </p>
          </div>

          <div>
            <label htmlFor="calc-denial" className="block text-sm font-semibold">
              {t.denialLabel}
            </label>
            <p id="calc-denial-hint" className="muted mt-1 text-xs">
              {t.denialHint}
            </p>
            <input
              id="calc-denial"
              type="range"
              className="mt-3 w-full accent-[var(--cyan)]"
              min={CALCULATOR_BOUNDS.denialRate.min}
              max={CALCULATOR_BOUNDS.denialRate.max}
              step={CALCULATOR_BOUNDS.denialRate.step}
              value={denialRate}
              aria-valuemin={CALCULATOR_BOUNDS.denialRate.min}
              aria-valuemax={CALCULATOR_BOUNDS.denialRate.max}
              aria-valuenow={denialRate}
              aria-valuetext={percent(locale, denialRate)}
              aria-describedby="calc-denial-hint"
              onChange={(event) => setDenialRate(clampDenialRate(Number(event.target.value)))}
            />
            <p className="mt-2 text-lg font-extrabold tracking-tight">
              {percent(locale, denialRate)}
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">{t.practiceLabel}</legend>
            <p id="calc-practice-hint" className="muted mt-1 text-xs">
              {t.practiceHint}
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-describedby="calc-practice-hint"
            >
              {PRACTICE_TYPES.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  data-active={practiceType === id}
                  aria-pressed={practiceType === id}
                  onClick={() => setPracticeType(id)}
                >
                  {practiceLabel(id)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="surface-2 grid gap-3 self-start rounded-[var(--radius-card)] p-4">
          <article>
            <p className="muted text-xs">{t.annualLostLabel}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {money(locale, output.annualLost)}
            </p>
          </article>
          <article>
            <p className="muted text-xs">{t.recoverableLabel}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {money(locale, output.recoverable)}
            </p>
            <p className="muted mt-1 text-xs">{t.recoverableHint}</p>
          </article>
          <article>
            <p className="muted text-xs">{t.cleanClaimLabel}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              {percent(locale, output.cleanClaim)}
            </p>
            <p className="muted mt-1 text-xs">{t.cleanClaimHint}</p>
          </article>
          <p className="muted text-xs">{t.disclaimer}</p>
          <Link className="btn-primary mt-1 inline-flex justify-center" href={onboardingHref}>
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
