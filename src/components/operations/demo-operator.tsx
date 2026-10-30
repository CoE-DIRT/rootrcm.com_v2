'use client';

import { useState } from 'react';
import { RotateCcw, ShieldAlert } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize, type OpsApplication, type OpsClaim } from '@/lib/ops-client';
import { opsButton, opsCard, opsControl, opsSubtle } from './ui';

export function DemoOperator({
  locale,
  claims,
  applications,
  pending,
  onAdvance,
  onDeny,
  onReset,
}: {
  locale: Locale;
  claims: readonly OpsClaim[];
  applications: readonly OpsApplication[];
  pending: boolean;
  onAdvance: (applicationId: string) => void;
  onDeny: (claimId: string) => void;
  onReset: () => void;
}) {
  const t = workspaceDemoText[locale];
  const [applicationId, setApplicationId] = useState(applications[0]?.id ?? '');
  const [claimId, setClaimId] = useState(claims[0]?.id ?? '');
  const selectedApp = applicationId || applications[0]?.id || '';
  const selectedClaim = claimId || claims[0]?.id || '';

  return (
    <aside data-testid="demo-operator" className={opsCard} aria-label={t.demoOperator}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[var(--warning)]">
            <ShieldAlert className="size-4" aria-hidden="true" />
            {t.demoOperator}
          </p>
          <p className={`mt-2 max-w-xl text-sm ${opsSubtle}`}>{t.demoOperatorHint}</p>
        </div>
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
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          {t.selectApplication}
          <select
            className={opsControl}
            value={selectedApp}
            onChange={(event) => setApplicationId(event.target.value)}
          >
            {applications.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} · {item.payer} · {localize(item.providerAlias, locale)}
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
                {item.id} · {item.payer} · {localize(item.state, locale)}
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
      </div>
    </aside>
  );
}
