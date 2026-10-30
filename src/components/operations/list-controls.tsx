'use client';

import type { Locale } from '@/i18n/locales';
import { translateOpsAction } from '@/content/ops-actions';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize } from '@/lib/ops-client';
import type { OpsSortDir, OpsSortKey } from '@/lib/ops-query';
import { opsControl } from './ui';

export function ListControls({
  locale,
  idPrefix,
  search,
  onSearch,
  searchLabel,
  filter,
  onFilter,
  filterLabel,
  filterOptions,
  allLabel,
  sortKey,
  onSortKey,
  sortDir,
  onSortDir,
  sortKeys,
}: {
  locale: Locale;
  idPrefix: string;
  search: string;
  onSearch: (value: string) => void;
  searchLabel: string;
  filter: string;
  onFilter: (value: string) => void;
  filterLabel: string;
  filterOptions: readonly string[];
  allLabel: string;
  sortKey: OpsSortKey;
  onSortKey: (value: OpsSortKey) => void;
  sortDir: OpsSortDir;
  onSortDir: (value: OpsSortDir) => void;
  sortKeys: readonly { id: OpsSortKey; label: string }[];
}) {
  const t = workspaceDemoText[locale];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
        {searchLabel}
        <input
          id={`${idPrefix}-search`}
          data-testid={`${idPrefix}-search`}
          className={opsControl}
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </label>
      <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
        {filterLabel}
        <select
          id={`${idPrefix}-filter`}
          data-testid={`${idPrefix}-filter`}
          className={opsControl}
          value={filter}
          onChange={(event) => onFilter(event.target.value)}
        >
          <option value="">{allLabel}</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {localize(translateOpsAction(option), locale)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
        {t.sort}
        <select
          id={`${idPrefix}-sort`}
          data-testid={`${idPrefix}-sort`}
          className={opsControl}
          value={sortKey}
          onChange={(event) => onSortKey(event.target.value as OpsSortKey)}
        >
          {sortKeys.map((key) => (
            <option key={key.id} value={key.id}>
              {key.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
        {sortDir === 'asc' ? t.sortAsc : t.sortDesc}
        <select
          id={`${idPrefix}-dir`}
          data-testid={`${idPrefix}-dir`}
          className={opsControl}
          value={sortDir}
          onChange={(event) => onSortDir(event.target.value as OpsSortDir)}
        >
          <option value="asc">{t.sortAsc}</option>
          <option value="desc">{t.sortDesc}</option>
        </select>
      </label>
    </div>
  );
}
