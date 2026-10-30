'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import {
  OPS_ORG_IDS,
  type OpsApplication,
  type OpsClaim,
  type OpsOrganization,
  type OpsPersona,
} from '@/lib/ops-client';
import { opsButton, opsCard, opsControl, opsSubtle } from './ui';

const TERMINAL = new Set(['effective', 'rejected', 'withdrawn']);

export function DemoOperator({
  locale,
  orgId,
  persona,
  tier,
  origin,
  organizations,
  claims,
  applications,
  pending,
  onAdvance,
  onDeny,
  onReset,
  onAdvanceTimeline,
  onSetPersona,
  onSetTier,
  onSelectPractice,
}: {
  locale: Locale;
  orgId: string;
  persona: OpsPersona;
  tier: string;
  origin: string;
  organizations: readonly OpsOrganization[];
  claims: readonly OpsClaim[];
  applications: readonly OpsApplication[];
  pending: boolean;
  onAdvance: (applicationId: string) => void;
  onDeny: (claimId: string) => void;
  onReset: () => void;
  onAdvanceTimeline: () => void;
  onSetPersona: (persona: OpsPersona) => void;
  onSetTier: () => void;
  onSelectPractice: (orgId: string) => void;
}) {
  const t = workspaceDemoText[locale];
  const preferredApp =
    applications.find((item) => item.id === 'cred-bv-004') ??
    applications.find((item) => !TERMINAL.has(item.status)) ??
    applications[0];
  const preferredClaim =
    claims.find((item) => item.id === 'clm-bv-1001') ??
    claims.find((item) => item.status !== 'denied') ??
    claims[0];
  const [applicationId, setApplicationId] = useState(preferredApp?.id ?? '');
  const [claimId, setClaimId] = useState(preferredClaim?.id ?? '');
  const selectedApp = applications.some((item) => item.id === applicationId)
    ? applicationId
    : (preferredApp?.id ?? '');
  const selectedClaim = claims.some((item) => item.id === claimId) ? claimId : (preferredClaim?.id ?? '');
  const nextPersona: OpsPersona = persona === 'staff' ? 'client' : 'staff';
  const practiceOptions = useMemo(() => {
    const names = new Map(organizations.map((org) => [org.id, org.legalName]));
    return OPS_ORG_IDS.map((id) => ({ id, name: names.get(id) ?? id }));
  }, [organizations]);

  return (
    <aside data-testid="demo-operator" className={opsCard} aria-label={t.demoOperator}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{t.demoOperator}</p>
          <p className={`mt-1 max-w-xl text-xs ${opsSubtle}`}>{t.demoOperatorHint}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          {origin || t.syntheticTag}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          {t.selectPractice}
          <select
            data-testid="select-practice"
            className={opsControl}
            value={orgId}
            onChange={(event) => onSelectPractice(event.target.value)}
          >
            {practiceOptions.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          {t.selectApplication}
          <select
            className={opsControl}
            value={selectedApp}
            onChange={(event) => setApplicationId(event.target.value)}
          >
            {applications.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} · {item.payer}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          {t.selectClaim}
          <select
            className={opsControl}
            value={selectedClaim}
            onChange={(event) => setClaimId(event.target.value)}
          >
            {claims.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} · {item.payer}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={opsButton}
          disabled={pending || !selectedApp}
          onClick={() => selectedApp && onAdvance(selectedApp)}
        >
          {t.operatorAdvance}
        </button>
        <button
          type="button"
          className={opsButton}
          disabled={pending || !selectedClaim}
          onClick={() => selectedClaim && onDeny(selectedClaim)}
        >
          {t.operatorDeny}
        </button>
        <button
          type="button"
          data-testid="advance-timeline"
          className={opsButton}
          disabled={pending}
          onClick={onAdvanceTimeline}
        >
          {t.advanceTimeline}
        </button>
        <button
          type="button"
          data-testid="set-persona"
          className={opsButton}
          disabled={pending}
          onClick={() => onSetPersona(nextPersona)}
        >
          {t.setPersona}: {nextPersona}
        </button>
        <button
          type="button"
          data-testid="set-tier"
          className={opsButton}
          disabled={pending}
          onClick={onSetTier}
        >
          {t.setTier}: {tier}
        </button>
        <button
          type="button"
          data-testid="reset-demo"
          className={opsButton}
          disabled={pending}
          onClick={onReset}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t.resetDemo}
        </button>
      </div>
    </aside>
  );
}
