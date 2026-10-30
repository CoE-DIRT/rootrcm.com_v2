'use client';

import { useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize, type OpsClaim } from '@/lib/ops-client';
import { compareValues, matchesQuery, uniqueSorted, type OpsSortDir, type OpsSortKey } from '@/lib/ops-query';
import { ListControls } from './list-controls';
import { opsButton, opsCard, opsSubtle } from './ui';

export function ClaimsBoard({
  locale,
  claims,
  canOperate,
  pending,
  onOpen,
  onDeny,
}: {
  locale: Locale;
  claims: readonly OpsClaim[];
  canOperate: boolean;
  pending: boolean;
  onOpen: (claim: OpsClaim) => void;
  onDeny: (claimId: string) => void;
}) {
  const t = workspaceDemoText[locale];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<OpsSortKey>('id');
  const [sortDir, setSortDir] = useState<OpsSortDir>('asc');
  const statuses = useMemo(() => uniqueSorted(claims.map((claim) => claim.status)), [claims]);

  const visible = useMemo(() => {
    return claims
      .filter((claim) => (filter ? claim.status === filter : true))
      .filter((claim) =>
        matchesQuery(search, [
          claim.id,
          claim.payer,
          claim.status,
          claim.queue,
          localize(claim.state, locale),
          localize(claim.next, locale),
          localize(claim.owner, locale),
        ]),
      )
      .slice()
      .sort((a, b) => {
        const value = (item: OpsClaim) => {
          if (sortKey === 'payer') return item.payer;
          if (sortKey === 'status') return item.status;
          return item.id;
        };
        return compareValues(value(a), value(b), sortDir);
      });
  }, [claims, filter, locale, search, sortDir, sortKey]);

  const denialCount = claims.filter((claim) => /denial|denied|appeal/i.test(`${claim.status} ${claim.queue}`)).length;

  return (
    <section className={opsCard} aria-label={t.payerActivity} data-testid="claims-board">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-extrabold">
          <ClipboardList className="size-5 text-[var(--cyan)]" aria-hidden="true" />
          {t.payerActivity}
        </h3>
        <p className="text-xs font-bold tabular-nums text-[var(--cyan)]" data-testid="denial-queue">
          {t.denialQueue}: {denialCount}
        </p>
      </div>
      <div className="mt-4">
        <ListControls
          locale={locale}
          idPrefix="claims"
          search={search}
          onSearch={setSearch}
          searchLabel={t.searchClaims}
          filter={filter}
          onFilter={setFilter}
          filterLabel={t.filterClaims}
          filterOptions={statuses}
          allLabel={t.allStatuses}
          sortKey={sortKey}
          onSortKey={setSortKey}
          sortDir={sortDir}
          onSortDir={setSortDir}
          sortKeys={[
            { id: 'id', label: t.sortById },
            { id: 'payer', label: t.sortByPayer },
            { id: 'status', label: t.sortByStatus },
          ]}
        />
      </div>
      {visible.length === 0 ? (
        <p className={`mt-4 text-sm ${opsSubtle}`}>{t.noResults}</p>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {visible.map((claim) => (
            <li
              key={claim.id}
              data-testid="claim-row"
              data-claim-id={claim.id}
              data-payer={claim.payer}
              data-status={claim.status}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                type="button"
                className="min-h-[48px] min-w-0 flex-1 rounded-xl px-1 text-left"
                onClick={() => onOpen(claim)}
              >
                <p className="wrap-break-word font-bold">{claim.id}</p>
                <p className={`wrap-break-word text-xs ${opsSubtle}`}>
                  {claim.payer} · {localize(claim.state, locale)}
                </p>
                <p className="mt-1 max-w-full wrap-break-word text-xs font-semibold text-[var(--cyan)]">
                  {localize(claim.next, locale)}
                </p>
              </button>
              {canOperate ? (
                <button
                  type="button"
                  data-testid="deny-claim"
                  className={opsButton}
                  disabled={pending}
                  onClick={() => onDeny(claim.id)}
                >
                  {t.denyClaim}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
