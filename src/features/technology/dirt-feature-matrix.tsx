'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { copy } from '@/content/messages';

type FeatureKey = 'underpayment' | 'timelyFiling' | 'implantCarveOut';

const keys: readonly FeatureKey[] = ['underpayment', 'timelyFiling', 'implantCarveOut'];

export function DirtFeatureMatrix({ locale }: { locale: Locale }) {
  const t = copy(locale).technology;
  const [active, setActive] = useState<FeatureKey>('underpayment');
  const feature = t.features[active];

  return (
    <section className="mt-10" aria-labelledby="dirt-matrix-heading" data-testid="dirt-feature-matrix">
      <p className="eyebrow">{t.matrixEyebrow}</p>
      <h2 id="dirt-matrix-heading" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
        {t.matrixTitle}
      </h2>
      <p className="muted mt-3 max-w-3xl text-sm">{t.matrixBody}</p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={t.matrixTitle}>
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`dirt-tab-${key}`}
            aria-selected={active === key}
            aria-controls={`dirt-panel-${key}`}
            tabIndex={active === key ? 0 : -1}
            onClick={() => setActive(key)}
            className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-offset-2 ${
              active === key
                ? 'border-[var(--cyan)] bg-[var(--surface-2)] text-[var(--cyan)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--cyan)]'
            }`}
          >
            {t.features[key].label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`dirt-panel-${active}`}
        aria-labelledby={`dirt-tab-${active}`}
        className="surface mt-4 p-5 md:p-6"
      >
        <h3 className="text-lg font-bold">{feature.title}</h3>
        <p className="muted mt-2 text-sm">{feature.body}</p>
        <ul className="mt-4 grid gap-2">
          {feature.signals.map((signal) => (
            <li key={signal} className="flex gap-2 text-sm">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
