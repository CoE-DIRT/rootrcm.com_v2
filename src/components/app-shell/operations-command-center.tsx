'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList,
  Clock3, FileCheck2, Layers3, ShieldCheck, Stethoscope, Wallet,
} from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import {
  credentialingApplications, phaseLabels, revenueStages, sampleClaimStatuses,
  sampleEligibility, sampleSchedule, workspaceDemoText,
  type CredentialingApplication,
} from '@/content/operations-demo';

type Tab = 'overview' | 'revenue' | 'credentialing' | 'practice';

const tabs: readonly { id: Tab; icon: typeof Activity }[] = [
  { id: 'overview', icon: Layers3 },
  { id: 'revenue', icon: Activity },
  { id: 'credentialing', icon: FileCheck2 },
  { id: 'practice', icon: CalendarDays },
];

const card = 'rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] md:p-5';
const subtle = 'text-[var(--muted)]';
const button = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold transition hover:border-[var(--cyan)] focus-visible:outline-offset-2';

function DataTag({ text }: { text: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{text}</span>;
}

function Metric({ title, value, note, icon: Icon }: { title: string; value: string; note: string; icon: typeof Activity }) {
  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-bold uppercase tracking-[0.08em] ${subtle}`}>{title}</span>
        <Icon className="size-5 text-[var(--cyan)]" aria-hidden="true" />
      </div>
      <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight">{value}</p>
      <p className={`mt-2 text-xs ${subtle}`}>{note}</p>
    </div>
  );
}

function CredentialTimeline({ item, locale, compact = false }: { item: CredentialingApplication; locale: Locale; compact?: boolean }) {
  const t = workspaceDemoText[locale];
  const current = item.stages.findIndex((stage) => stage.state === 'current');
  const progress = Math.round(((current + 1) / item.stages.length) * 100);
  return (
    <article data-testid="credentialing-card" className={card} aria-label={`${item.providerAlias[locale]} — ${item.payer}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-[var(--cyan)]">{item.id}</p>
          <h3 className="mt-1 text-lg font-extrabold">{item.providerAlias[locale]}</h3>
          <p className={`text-sm ${subtle}`}>{item.payer} · {item.applicationType[locale]}</p>
        </div>
        <DataTag text={t.synthetic} />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-bold">{phaseLabels[current]?.label[locale]}</p>
        <span className="text-xs font-bold tabular-nums text-[var(--cyan)]">{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`${item.payer} ${t.stages}`}>
        <div className="h-full rounded-full bg-[var(--cyan)]" style={{ width: `${progress}%` }} />
      </div>
      <p className={`mt-2 text-xs ${subtle}`}>{t.stageCaption}</p>
      {!compact ? (
        <ol className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {item.stages.map((stage, index) => (
            <li key={stage.id} className="flex min-h-[50px] items-center gap-2 rounded-xl border border-[var(--border)] p-2.5">
              {stage.state === 'complete' ? (
                <CheckCircle2 className="size-5 shrink-0 text-[var(--success)]" aria-hidden="true" />
              ) : stage.state === 'current' ? (
                <Clock3 className="size-5 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
              ) : (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[10px]">{index + 1}</span>
              )}
              <span className="text-xs font-medium">{stage.label[locale]}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="mt-4 grid gap-3 rounded-xl bg-[var(--surface-2)] p-3 md:grid-cols-2">
        <div><p className={`text-[11px] font-bold uppercase tracking-wide ${subtle}`}>{t.nextAction}</p><p className="mt-1 text-sm font-semibold">{item.nextAction[locale]}</p></div>
        <div><p className={`text-[11px] font-bold uppercase tracking-wide ${subtle}`}>{t.owner}</p><p className="mt-1 text-sm font-semibold">{item.owner[locale]}</p></div>
      </div>
      {!compact && (
        <p className={`mt-3 text-xs ${subtle}`}>
          {t.source}: {item.externalStatus[locale]} · {t.lastVerified}: {t.notVerified}
        </p>
      )}
    </article>
  );
}

function RevenuePanel({ locale }: { locale: Locale }) {
  const t = workspaceDemoText[locale];
  const max = Math.max(...revenueStages.map((stage) => stage.count));
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
      <section className={card} aria-label={t.claimPipeline}>
        <div className="flex items-center gap-2"><Activity className="size-5 text-[var(--cyan)]" /><h3 className="font-extrabold">{t.claimPipeline}</h3></div>
        <div className="mt-5 space-y-3">
          {revenueStages.map((stage) => (
            <div key={stage.id} className="grid grid-cols-[minmax(110px,1fr)_minmax(100px,1.5fr)_36px] items-center gap-3 text-xs">
              <span className="font-semibold">{stage.label[locale]}</span>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]" title={stage.action[locale]}>
                <div className="h-full rounded-full bg-[var(--cyan)]/80" style={{ width: `${(stage.count / max) * 100}%` }} />
              </div>
              <span className="text-right font-bold tabular-nums">{stage.count}</span>
            </div>
          ))}
        </div>
        <p className={`mt-5 text-xs ${subtle}`}>{t.disclaimer}</p>
      </section>
      <div className="grid gap-5">
        <section className={card}>
          <h3 className="flex items-center gap-2 font-extrabold"><ClipboardList className="size-5 text-[var(--cyan)]" />{t.payerActivity}</h3>
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {sampleClaimStatuses.map((claim) => (
              <li key={claim.id} className="flex flex-wrap justify-between gap-3 py-3">
                <div><p className="font-bold">{claim.id}</p><p className={`text-xs ${subtle}`}>{claim.payer} · {claim.state[locale]}</p></div>
                <p className="max-w-[220px] text-right text-xs font-semibold text-[var(--cyan)]">{claim.next[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={card}>
          <h3 className="flex items-center gap-2 font-extrabold"><ShieldCheck className="size-5 text-[var(--cyan)]" />{t.pendingChecks}</h3>
          <ul className="mt-4 space-y-3">{sampleEligibility.map((item) => (
            <li key={item.id} className="rounded-xl bg-[var(--surface-2)] p-3">
              <p className="text-sm font-bold">{item.payer} · {item.label[locale]}</p>
              <p className={`mt-1 text-xs ${subtle}`}>{item.next[locale]}</p>
            </li>
          ))}</ul>
        </section>
      </div>
    </div>
  );
}

function PracticePanel({ locale }: { locale: Locale }) {
  const t = workspaceDemoText[locale];
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <section className={card}>
        <h3 className="flex items-center gap-2 font-extrabold"><CalendarDays className="size-5 text-[var(--cyan)]" />{t.scheduleBoard}</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {sampleSchedule.map((block) => (
            <div key={block.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-xs font-bold text-[var(--cyan)]">{block.id}</p>
              <p className="mt-2 font-bold">{block.session[locale]}</p>
              <p className="mt-3 text-3xl font-extrabold tabular-nums">{block.load}</p>
              <p className={`mt-2 text-xs ${subtle}`}>{block.note[locale]}</p>
            </div>
          ))}
        </div>
      </section>
      <section className={card}>
        <h3 className="flex items-center gap-2 font-extrabold"><Stethoscope className="size-5 text-[var(--cyan)]" />{t.requests}</h3>
        <div className="mt-5 space-y-3">
          {[
            { n: 1, name: t.pendingChecks, detail: '270/271' },
            { n: 2, name: t.enrollmentStatus, detail: 'CAQH / PECOS / payer portals' },
            { n: 3, name: t.payerActivity, detail: '276/277 / 835' },
          ].map((item) => (
            <div key={item.n} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-sm font-bold text-[var(--cyan)]">0{item.n}</span>
              <div><p className="text-sm font-bold">{item.name}</p><p className={`text-xs ${subtle}`}>{item.detail}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function OperationsCommandCenter({ locale, initialTab = 'overview' }: { locale: Locale; initialTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const t = workspaceDemoText[locale];
  const activeEnrollments = credentialingApplications.length;
  const claimVolume = sampleClaimStatuses.length;
  return (
    <div className="space-y-5" data-testid="rcm-command-center">
      <header className="relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[var(--cyan)] opacity-[0.08] blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[var(--cyan)]"><Activity className="size-4" aria-hidden="true" />{t.eyebrow}</p>
            <DataTag text={t.liveState} />
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{t.title}</h2>
          <p className={`mt-2 max-w-2xl text-sm ${subtle}`}>{t.description}</p>
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-semibold text-[var(--warning)]">
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />{t.simulation}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric title={t.claims} value={String(claimVolume)} note={t.synthetic} icon={ClipboardList} />
        <Metric title={t.activeCredentials} value={String(activeEnrollments)} note={t.synthetic} icon={FileCheck2} />
        <Metric title={t.schedule} value={String(sampleSchedule.reduce((sum, block) => sum + block.load, 0))} note={t.synthetic} icon={CalendarDays} />
        <Metric title={t.exceptions} value="9" note={t.synthetic} icon={Wallet} />
      </div>

      <div role="tablist" aria-label={t.title} className="flex gap-2 overflow-x-auto rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-2" style={{ scrollbarWidth: 'thin' }}>
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} type="button" role="tab" id={`rcm-tab-${id}`} aria-controls="rcm-panel" aria-selected={activeTab === id}
            className={`${button} shrink-0 ${activeTab === id ? 'border-[var(--cyan)] bg-[var(--surface-2)] text-[var(--cyan)]' : 'text-[var(--muted)]'}`}
            onClick={() => setActiveTab(id)}>
            <Icon className="size-4" aria-hidden="true" />{t[id]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="rcm-panel" aria-labelledby={`rcm-tab-${activeTab}`} className="space-y-5">
        {(activeTab === 'overview' || activeTab === 'credentialing') && (
          <section className="space-y-4" aria-label={t.enrollmentStatus}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wide text-[var(--cyan)]">{t.enrollmentStatus}</p><h3 className="mt-1 text-xl font-extrabold">{t.details}</h3></div>
              <Link className={button} href={localizedPath(locale, '/preview/credentialing')}>{t.viewCredentialing}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="grid gap-4 2xl:grid-cols-2">
              {credentialingApplications.slice(0, activeTab === 'overview' ? 2 : undefined).map((item) => (
                <CredentialTimeline key={item.id} item={item} locale={locale} compact={activeTab === 'overview'} />
              ))}
            </div>
          </section>
        )}
        {(activeTab === 'overview' || activeTab === 'revenue') && <RevenuePanel locale={locale} />}
        {activeTab === 'practice' && <PracticePanel locale={locale} />}
      </div>

      <footer className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-2 font-bold"><ShieldCheck className="size-4 text-[var(--success)]" aria-hidden="true" />{t.ready} · {t.compliance}</div>
        <p className="mt-2">{t.disclaimer}</p>
        <p className="mt-1">{t.refresh} {t.visibility}</p>
      </footer>
    </div>
  );
}
