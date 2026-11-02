'use client';

import { Gauge } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { OPS_DEMO_ORG_ID, formatMetric, formatRatio, type OpsMetrics } from '@/lib/ops-client';
import { useOpsState } from './use-ops-state';
import { opsButton, opsCard, opsSubtle } from './ui';

function MetricCell({
  title,
  value,
  note,
  testId,
}: {
  title: string;
  value: string;
  note: string;
  testId?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4" data-testid={testId}>
      <p className={`text-xs font-bold uppercase tracking-wide ${opsSubtle}`}>{title}</p>
      <p className="mt-2 wrap-break-word text-2xl font-extrabold tabular-nums">{value}</p>
      <p className={`mt-2 text-xs ${opsSubtle}`}>{note}</p>
    </div>
  );
}

/** DIRT route reads the same synthetic operations ledger as the command center. */
export function DirtLedgerPreview({ locale }: { locale: Locale }) {
  const t = workspaceDemoText[locale];
  const { state, loading, error, refresh } = useOpsState(OPS_DEMO_ORG_ID, 'client');
  if (loading || (!state && !error)) {
    return (
      <p role="status" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-semibold">
        {t.loadingOps}
      </p>
    );
  }
  if (!state) {
    return (
      <div role="alert" className="rounded-xl border border-[var(--danger)] bg-[var(--surface)] p-4">
        <p className="font-bold text-[var(--danger)]">{t.loadError}</p>
        <p className="mt-2 break-words text-sm">{error}</p>
        <button type="button" className={`${opsButton} mt-3`} onClick={() => void refresh()}>
          {t.retry}
        </button>
      </div>
    );
  }
  return <DirtMetricsPanel locale={locale} metrics={state.metrics} />;
}

export function DirtMetricsPanel({ locale, metrics }: { locale: Locale; metrics: OpsMetrics }) {
  const t = workspaceDemoText[locale];
  const unavailable = t.metricUnavailable;
  return (
    <section className={opsCard} aria-label={t.dirtMetrics} data-testid="dirt-metrics">
      <h3 className="flex items-center gap-2 font-extrabold">
        <Gauge className="size-5 text-[var(--cyan)]" aria-hidden="true" />
        {t.dirtMetrics}
      </h3>
      <p className={`mt-2 text-xs ${opsSubtle}`}>{t.metricsNote}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCell
          title={t.denialRate}
          value={formatRatio(metrics.denialRateRatio, metrics.denialRate)}
          note={metrics.denialRate === null ? unavailable : t.synthetic}
        />
        <MetricCell
          title={t.daysInAr}
          value={formatMetric(metrics.daysInAr)}
          note={metrics.daysInAr === null ? unavailable : t.synthetic}
          testId="days-in-ar"
        />
        <MetricCell
          title={t.openEnrollmentsMetric}
          value={formatMetric(metrics.openEnrollments)}
          note={metrics.openEnrollments === null ? unavailable : t.synthetic}
        />
        <MetricCell
          title={t.exceptionCount}
          value={formatMetric(metrics.exceptionCount)}
          note={metrics.exceptionCount === null ? unavailable : t.synthetic}
        />
      </div>
    </section>
  );
}
