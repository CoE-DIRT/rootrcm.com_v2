'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList,
  Clock3, FileCheck2, Layers3, ShieldCheck, Wallet,
} from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import {
  phaseLabels, revenueStages, workspaceDemoText,
  type CredentialingApplication, type CredentialingPhase,
} from '@/content/operations-demo';
import { AuditPanel } from '@/components/operations/audit-panel';
import { ClaimsBoard } from '@/components/operations/claims-board';
import { DemoOperator } from '@/components/operations/demo-operator';
import { DirtMetricsPanel } from '@/components/operations/dirt-metrics-panel';
import { ListControls } from '@/components/operations/list-controls';
import { NotificationsPanel } from '@/components/operations/notifications-panel';
import { PracticeSchedule } from '@/components/operations/practice-schedule';
import { RecordDrawer } from '@/components/operations/record-drawer';
import { useOpsState } from '@/components/operations/use-ops-state';
import {
  OPS_DEMO_ORG_ID, formatMetric, localize,
  type OpsApplication, type OpsClaim, type OpsHistoryEntry, type OpsPersona, type OpsState,
} from '@/lib/ops-client';
import { compareValues, matchesQuery, uniqueSorted, type OpsSortDir, type OpsSortKey } from '@/lib/ops-query';

type Tab = 'overview' | 'revenue' | 'credentialing' | 'practice';

const tabs: readonly { id: Tab; icon: typeof Activity }[] = [
  { id: 'overview', icon: Layers3 },
  { id: 'revenue', icon: Activity },
  { id: 'credentialing', icon: FileCheck2 },
  { id: 'practice', icon: CalendarDays },
];

const EMPTY_APPLICATIONS: OpsApplication[] = [];

const card = 'rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] md:p-5 min-w-0';
const subtle = 'text-[var(--muted)]';
const button = 'inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold transition hover:border-[var(--cyan)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const PIPELINE_KEYS: Record<string, readonly string[]> = {
  schedule: ['schedule', 'scheduling'],
  eligibility: ['eligibility'],
  auth: ['auth', 'authorization'],
  charges: ['charges', 'queued'],
  submit: ['submit', '837_submitted', '999_acknowledged', '277ca_accepted', '277ca_rejected'],
  payer: ['payer', 'payer_processing', '276_277_pending', '276_277_adjudicated'],
  remit: ['remit', '835_posted'],
  denials: ['denials', 'denied', 'appealed'],
  ar: ['ar'],
};

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
      <p className="mt-3 break-words text-3xl font-extrabold tabular-nums tracking-tight">{value}</p>
      <p className={`mt-2 text-xs ${subtle}`}>{note}</p>
    </div>
  );
}

function toDemoApplication(app: OpsApplication): CredentialingApplication {
  const known = phaseLabels.some((phase) => phase.id === app.phase);
  const current = app.stages.find((stage) => stage.state === 'current');
  const phase = (known ? app.phase : current?.id ?? 'intake') as CredentialingPhase;
  return {
    id: app.id,
    organizationId: 'demo-bayview',
    providerAlias: app.providerAlias,
    payer: app.payer,
    applicationType: app.applicationType,
    phase,
    nextAction: app.nextAction,
    owner: app.owner,
    externalStatus: app.externalStatus,
    updatedAt: null,
    source: 'synthetic',
    sourceReference: null,
    verifiedAt: null,
    effectiveDate: null,
    stages: app.stages,
  };
}

function historyFor(state: OpsState, resourceId: string, local: readonly OpsHistoryEntry[]): OpsHistoryEntry[] {
  const extra = state.auditEvents
    .filter((event) => event.resourceId === resourceId)
    .map((event) => ({
      id: event.id,
      at: event.at,
      actor: event.actor,
      summary: event.summary,
      from: event.from,
      to: event.to,
    }));
  const seen = new Set(local.map((entry) => entry.id));
  return [...local, ...extra.filter((entry) => !seen.has(entry.id))];
}

function pipelineCount(stageId: string, counts: Record<string, number>): number {
  const aliases = PIPELINE_KEYS[stageId] ?? [stageId];
  let total = 0;
  for (const [key, value] of Object.entries(counts)) {
    if (aliases.some((alias) => alias.toLowerCase() === key.toLowerCase())) total += value;
  }
  if (counts[stageId] != null) return counts[stageId];
  return total;
}

function scheduleVolume(state: OpsState): string {
  const loads = state.appointments.map((item) => item.load).filter((value): value is number => value !== null);
  if (loads.length > 0) return String(loads.reduce((sum, value) => sum + value, 0));
  return state.appointments.length ? String(state.appointments.length) : '—';
}

function metricSum(counts: Record<string, number>): string {
  const values = Object.values(counts);
  if (values.length === 0) return '—';
  return String(values.reduce((sum, count) => sum + count, 0));
}

function CredentialTimeline({
  item, locale, compact = false, canOperate = false, pending = false, onOpen, onAdvance,
}: {
  item: CredentialingApplication;
  locale: Locale;
  compact?: boolean;
  canOperate?: boolean;
  pending?: boolean;
  onOpen?: () => void;
  onAdvance?: () => void;
}) {
  const t = workspaceDemoText[locale];
  const current = item.stages.findIndex((stage) => stage.state === 'current');
  const progress = Math.round(((current + 1) / item.stages.length) * 100);
  return (
    <article data-testid="credentialing-card" data-application-id={item.id} className={card} aria-label={`${item.providerAlias[locale]} — ${item.payer}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button type="button" className="min-h-[48px] min-w-0 flex-1 rounded-xl text-left" onClick={onOpen}>
          <p className="break-words text-xs font-bold tracking-wider text-[var(--cyan)]">{item.id}</p>
          <h3 className="mt-1 break-words text-lg font-extrabold">{item.providerAlias[locale]}</h3>
          <p className={`break-words text-sm ${subtle}`}>{item.payer} · {item.applicationType[locale]}</p>
        </button>
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
      {canOperate && onAdvance ? (
        <button type="button" data-testid="advance-credentialing" className={`${button} mt-4`} disabled={pending} onClick={onAdvance}>
          {t.advanceCredentialing}
        </button>
      ) : null}
    </article>
  );
}

function RevenuePipeline({ locale, counts }: { locale: Locale; counts: Record<string, number> }) {
  const t = workspaceDemoText[locale];
  const values = revenueStages.map((stage) => pipelineCount(stage.id, counts));
  const max = Math.max(1, ...values);
  return (
    <section className={card} aria-label={t.claimPipeline}>
      <div className="flex items-center gap-2"><Activity className="size-5 text-[var(--cyan)]" /><h3 className="font-extrabold">{t.claimPipeline}</h3></div>
      <div className="mt-5 space-y-3">
        {revenueStages.map((stage, index) => (
          <div key={stage.id} className="grid grid-cols-[minmax(110px,1fr)_minmax(100px,1.5fr)_36px] items-center gap-3 text-xs">
            <span className="font-semibold">{stage.label[locale]}</span>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]" title={stage.action[locale]}>
              <div className="h-full rounded-full bg-[var(--cyan)]/80" style={{ width: `${(values[index] / max) * 100}%` }} />
            </div>
            <span className="text-right font-bold tabular-nums">{values[index]}</span>
          </div>
        ))}
      </div>
      <p className={`mt-5 text-xs ${subtle}`}>{t.disclaimer}</p>
    </section>
  );
}

export function OperationsCommandCenter({
  locale,
  initialTab = 'overview',
  role = 'client',
  orgId = OPS_DEMO_ORG_ID,
}: {
  locale: Locale;
  initialTab?: Tab;
  role?: OpsPersona;
  orgId?: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [sortKey, setSortKey] = useState<OpsSortKey>('id');
  const [sortDir, setSortDir] = useState<OpsSortDir>('asc');
  const [selected, setSelected] = useState<{ kind: 'claim' | 'application'; id: string } | null>(null);
  const [activeOrgId, setActiveOrgId] = useState(orgId);
  const [activePersona, setActivePersona] = useState<OpsPersona>(role);
  const t = workspaceDemoText[locale];
  const { state, loading, error, pending, refresh, runAction } = useOpsState(activeOrgId, activePersona);
  const canOperate = role === 'staff';

  const applications = useMemo(
    () => state?.applications ?? EMPTY_APPLICATIONS,
    [state?.applications],
  );
  const phases = useMemo(() => uniqueSorted(applications.map((item) => item.phase || item.status)), [applications]);
  const visibleApps = useMemo(() => {
    return applications
      .filter((item) => (phaseFilter ? item.phase === phaseFilter || item.status === phaseFilter : true))
      .filter((item) =>
        matchesQuery(search, [
          item.id,
          item.payer,
          item.phase,
          item.status,
          localize(item.providerAlias, locale),
          localize(item.nextAction, locale),
        ]),
      )
      .slice()
      .sort((a, b) => {
        const value = (item: OpsApplication) => {
          if (sortKey === 'payer') return item.payer;
          if (sortKey === 'phase' || sortKey === 'status') return item.phase || item.status;
          return item.id;
        };
        return compareValues(value(a), value(b), sortDir);
      });
  }, [applications, locale, phaseFilter, search, sortDir, sortKey]);

  const selectedClaim = selected?.kind === 'claim' ? state?.claims.find((item) => item.id === selected.id) ?? null : null;
  const selectedApp = selected?.kind === 'application' ? applications.find((item) => item.id === selected.id) ?? null : null;

  const advance = async (applicationId: string) => {
    try {
      await runAction({ type: 'advance_credentialing', applicationId });
    } catch {
      /* Error copy is surfaced in the ops-error banner. */
    }
  };
  const deny = async (claimId: string) => {
    try {
      await runAction({ type: 'deny_claim', claimId });
    } catch {
      /* Error copy is surfaced in the ops-error banner. */
    }
  };
  const resetDemo = async () => {
    try {
      await runAction({ type: 'reset' });
    } catch {
      /* Error copy is surfaced in the ops-error banner. */
    }
  };
  const runQuiet = async (action: Parameters<typeof runAction>[0]) => {
    try {
      await runAction(action);
    } catch {
      /* Error copy is surfaced in the ops-error banner. */
    }
  };

  const shownApps = activeTab === 'overview' ? visibleApps.slice(0, 2) : visibleApps;

  return (
    <div className="min-w-0 space-y-5 overflow-x-clip" data-testid="rcm-command-center">
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

      {loading || (!state && !error) ? (
        <p data-testid="ops-loading" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-semibold" role="status">{t.loadingOps}</p>
      ) : null}
      {error ? (
        <div data-testid="ops-error" className="rounded-xl border border-[var(--danger)] bg-[var(--surface)] p-4" role="alert">
          <p className="font-bold text-[var(--danger)]">{state ? t.actionError : t.loadError}</p>
          <p className="mt-2 break-words text-sm">{error}</p>
          <button type="button" className={`${button} mt-3`} onClick={() => void refresh()}>{t.retry}</button>
        </div>
      ) : null}

      <div role="tablist" aria-label={t.title} className="flex gap-2 overflow-x-auto rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-2" style={{ scrollbarWidth: 'thin' }}>
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} type="button" role="tab" id={`rcm-tab-${id}`} aria-controls="rcm-panel" aria-selected={activeTab === id}
            className={`${button} shrink-0 ${activeTab === id ? 'border-[var(--cyan)] bg-[var(--surface-2)] text-[var(--cyan)]' : 'text-[var(--muted)]'}`}
            onClick={() => setActiveTab(id)}>
            <Icon className="size-4" aria-hidden="true" />{t[id]}
          </button>
        ))}
      </div>

      {state ? (
        <div data-testid="ops-ready" className="space-y-5">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric title={t.claims} value={metricSum(state.metrics.claimCountsByStage)} note={t.synthetic} icon={ClipboardList} />
            <Metric title={t.activeCredentials} value={formatMetric(state.metrics.openEnrollments)} note={state.metrics.openEnrollments === null ? t.metricUnavailable : t.synthetic} icon={FileCheck2} />
            <Metric title={t.schedule} value={scheduleVolume(state)} note={t.synthetic} icon={CalendarDays} />
            <Metric title={t.exceptions} value={formatMetric(state.metrics.exceptionCount)} note={state.metrics.exceptionCount === null ? t.metricUnavailable : t.synthetic} icon={Wallet} />
          </div>

          <div role="tabpanel" id="rcm-panel" aria-labelledby={`rcm-tab-${activeTab}`} className="min-w-0 space-y-5">
            {(activeTab === 'overview' || activeTab === 'credentialing') && (
              <section className="space-y-4" aria-label={t.enrollmentStatus}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-wide text-[var(--cyan)]">{t.enrollmentStatus}</p><h3 className="mt-1 text-xl font-extrabold">{t.details}</h3></div>
                  <Link className={button} href={localizedPath(locale, '/preview/credentialing')}>{t.viewCredentialing}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                </div>
                {activeTab === 'credentialing' ? (
                  <ListControls
                    locale={locale}
                    idPrefix="credentialing"
                    search={search}
                    onSearch={setSearch}
                    searchLabel={t.searchApplications}
                    filter={phaseFilter}
                    onFilter={setPhaseFilter}
                    filterLabel={t.filterApplications}
                    filterOptions={phases}
                    allLabel={t.allPhases}
                    sortKey={sortKey}
                    onSortKey={setSortKey}
                    sortDir={sortDir}
                    onSortDir={setSortDir}
                    sortKeys={[
                      { id: 'id', label: t.sortById },
                      { id: 'payer', label: t.sortByPayer },
                      { id: 'phase', label: t.sortByPhase },
                    ]}
                  />
                ) : null}
                {shownApps.length === 0 ? (
                  <p className={`text-sm ${subtle}`}>{t.noResults}</p>
                ) : (
                  <div className="grid gap-4 2xl:grid-cols-2">
                    {shownApps.map((item) => (
                      <CredentialTimeline
                        key={item.id}
                        item={toDemoApplication(item)}
                        locale={locale}
                        compact={activeTab === 'overview'}
                        canOperate={canOperate && activeTab === 'credentialing'}
                        pending={pending}
                        onOpen={() => setSelected({ kind: 'application', id: item.id })}
                        onAdvance={() => void advance(item.id)}
                      />
                    ))}
                  </div>
                )}
                {activeTab === 'credentialing' ? (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <NotificationsPanel locale={locale} notifications={state.notifications} />
                    <AuditPanel locale={locale} events={state.auditEvents} />
                  </div>
                ) : null}
              </section>
            )}
            {(activeTab === 'overview' || activeTab === 'revenue') && (
              <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
                <RevenuePipeline locale={locale} counts={state.metrics.claimCountsByStage} />
                <ClaimsBoard
                  locale={locale}
                  claims={state.claims}
                  canOperate={canOperate}
                  pending={pending}
                  onOpen={(claim: OpsClaim) => setSelected({ kind: 'claim', id: claim.id })}
                  onDeny={(claimId) => void deny(claimId)}
                />
              </div>
            )}
            {activeTab === 'overview' && (
              <>
                <DirtMetricsPanel locale={locale} metrics={state.metrics} />
                <div className="grid gap-5 lg:grid-cols-2">
                  <NotificationsPanel locale={locale} notifications={state.notifications} />
                  <AuditPanel locale={locale} events={state.auditEvents} />
                </div>
              </>
            )}
            {activeTab === 'practice' && (
              <PracticeSchedule locale={locale} appointments={state.appointments} eligibility={state.eligibility} />
            )}
          </div>

          {canOperate ? (
            <DemoOperator
              locale={locale}
              orgId={activeOrgId}
              persona={activePersona}
              tier={state.preview.tier}
              origin={state.origin}
              organizations={state.organizations}
              claims={state.claims}
              applications={state.applications}
              pending={pending}
              onAdvance={(applicationId) => void advance(applicationId)}
              onDeny={(claimId) => void deny(claimId)}
              onReset={() => void resetDemo()}
              onAdvanceTimeline={() => void runQuiet({ type: 'advance_timeline' })}
              onSetPersona={(next) => {
                setActivePersona(next);
                void runQuiet({ type: 'set_persona', persona: next });
              }}
              onSetTier={() => void runQuiet({ type: 'set_tier' })}
              onSelectPractice={(nextOrgId) => {
                setActiveOrgId(nextOrgId);
                void runQuiet({ type: 'set_persona', orgId: nextOrgId, persona: activePersona });
              }}
            />
          ) : null}

          <RecordDrawer
            open={Boolean(selectedClaim || selectedApp)}
            locale={locale}
            title={selectedClaim?.id ?? selectedApp?.id ?? t.recordDetail}
            subtitle={
              selectedClaim
                ? `${selectedClaim.payer} · ${localize(selectedClaim.state, locale)}`
                : selectedApp
                  ? `${selectedApp.payer} · ${localize(selectedApp.providerAlias, locale)}`
                  : ''
            }
            nextAction={selectedClaim ? localize(selectedClaim.next, locale) : selectedApp ? localize(selectedApp.nextAction, locale) : ''}
            owner={selectedClaim ? localize(selectedClaim.owner, locale) : selectedApp ? localize(selectedApp.owner, locale) : ''}
            provenance={selectedClaim?.origin ?? selectedApp?.origin ?? t.syntheticTag}
            history={
              state && selectedClaim
                ? historyFor(state, selectedClaim.id, selectedClaim.history)
                : state && selectedApp
                  ? historyFor(state, selectedApp.id, selectedApp.history)
                  : []
            }
            onClose={() => setSelected(null)}
          />
        </div>
      ) : null}

      <footer className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-2 font-bold"><ShieldCheck className="size-4 text-[var(--success)]" aria-hidden="true" />{t.ready} · {t.compliance}</div>
        <p className="mt-2">{t.disclaimer}</p>
        <p className="mt-1">{t.refresh} {t.visibility}</p>
      </footer>
    </div>
  );
}
