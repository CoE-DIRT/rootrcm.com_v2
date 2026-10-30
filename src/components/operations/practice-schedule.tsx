'use client';

import { CalendarDays, ShieldCheck, Stethoscope } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { formatMetric, localize, type OpsAppointment, type OpsEligibility } from '@/lib/ops-client';
import { opsCard, opsSubtle } from './ui';

function Flag({ label, value, onLabel, offLabel, unknownLabel }: {
  label: string;
  value: boolean | null;
  onLabel: string;
  offLabel: string;
  unknownLabel: string;
}) {
  const text = value === true ? onLabel : value === false ? offLabel : unknownLabel;
  return (
    <p className="mt-2 text-xs font-semibold">
      {label}: <span className="text-[var(--cyan)]">{text}</span>
    </p>
  );
}

export function PracticeSchedule({
  locale,
  appointments,
  eligibility,
}: {
  locale: Locale;
  appointments: readonly OpsAppointment[];
  eligibility: readonly OpsEligibility[];
}) {
  const t = workspaceDemoText[locale];
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]" data-testid="practice-schedule">
      <section className={opsCard}>
        <h3 className="flex items-center gap-2 font-extrabold">
          <CalendarDays className="size-5 text-[var(--cyan)]" aria-hidden="true" />
          {t.scheduleBoard}
        </h3>
        {appointments.length === 0 ? (
          <p className={`mt-5 text-sm ${opsSubtle}`}>{t.noResults}</p>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {appointments.map((block) => (
              <article
                key={block.id}
                data-testid="schedule-block"
                className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
              >
                <p className="wrap-break-word text-xs font-bold text-[var(--cyan)]">{block.id}</p>
                <p className="mt-2 wrap-break-word font-bold">{localize(block.session, locale)}</p>
                <p className="mt-3 text-3xl font-extrabold tabular-nums">
                  {formatMetric(block.load)}
                </p>
                <p className={`mt-2 text-xs ${opsSubtle}`}>{t.appointmentLoad}</p>
                <Flag
                  label={t.eligibilityFlag}
                  value={block.eligibilityFlag}
                  onLabel={t.flagOn}
                  offLabel={t.flagOff}
                  unknownLabel={t.flagUnknown}
                />
                <Flag
                  label={t.authFlag}
                  value={block.authFlag}
                  onLabel={t.flagOn}
                  offLabel={t.flagOff}
                  unknownLabel={t.flagUnknown}
                />
                <p className={`mt-2 wrap-break-word text-xs ${opsSubtle}`}>{localize(block.note, locale)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className={opsCard}>
        <h3 className="flex items-center gap-2 font-extrabold">
          <Stethoscope className="size-5 text-[var(--cyan)]" aria-hidden="true" />
          {t.pendingChecks}
        </h3>
        {eligibility.length === 0 ? (
          <p className={`mt-5 text-sm ${opsSubtle}`}>{t.noResults}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {eligibility.map((item) => (
              <li key={item.id} className="rounded-xl bg-[var(--surface-2)] p-3">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck className="size-4 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
                  {item.payer} · {localize(item.label, locale)}
                </p>
                <p className={`mt-1 wrap-break-word text-xs ${opsSubtle}`}>{localize(item.next, locale)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
