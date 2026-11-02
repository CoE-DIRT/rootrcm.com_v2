'use client';

import { useMemo, useState } from 'react';
import { copy } from '@/content/messages';
import { AppealGenerator } from '@/features/portal/denials/appeal-generator';
import { filterDenialsByTab, loadPortalDenials } from '@/features/portal/denials/load-denials';
import type { DenialQueueTab, PortalDenialRow } from '@/features/portal/denials/types';
import { usePortalDemo } from './portal-frame';

type SortKey = 'payer' | 'status' | 'code' | 'priority';

const seedRows = loadPortalDenials();

const tabs: readonly DenialQueueTab[] = ['all', 'appeal', 'resolved', 'high'];

export function PortalDenials() {
  const { locale } = usePortalDemo();
  const t = copy(locale).portalDenials;
  const es = locale === 'es';
  const [tab, setTab] = useState<DenialQueueTab>('all');
  const [payer, setPayer] = useState('all');
  const [status, setStatus] = useState('all');
  const [code, setCode] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [openId, setOpenId] = useState<string | null>(seedRows[0]?.id ?? null);
  const [appealOpen, setAppealOpen] = useState(false);

  const tabbed = useMemo(() => filterDenialsByTab(seedRows, tab), [tab]);

  const payers = ['all', ...new Set(tabbed.map((row) => row.payer))];
  const statuses = ['all', ...new Set(tabbed.map((row) => row.status.en))];
  const codes = ['all', ...new Set(tabbed.map((row) => row.code))];

  const rows = useMemo(() => {
    const filtered = tabbed.filter((row) => {
      if (payer !== 'all' && row.payer !== payer) return false;
      if (status !== 'all' && row.status.en !== status) return false;
      if (code !== 'all' && row.code !== code) return false;
      if (priority !== 'all' && row.priority !== priority) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      const left = sortValue(a, sortKey, locale);
      const right = sortValue(b, sortKey, locale);
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    });
  }, [tabbed, payer, status, code, priority, sortKey, direction, locale]);

  const selected = rows.find((row) => row.id === openId) ?? rows[0] ?? null;

  function toggleSort(next: SortKey) {
    if (sortKey === next) setDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(next);
      setDirection('asc');
    }
  }

  const tabLabel = (value: DenialQueueTab) => {
    if (value === 'appeal') return t.tabAppeal;
    if (value === 'resolved') return t.tabResolved;
    if (value === 'high') return t.tabHigh;
    return t.tabAll;
  };

  return (
    <div>
      <p className="overline">{t.eyebrow}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{t.title}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">{t.body}</p>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t.title}>
        {tabs.map((value) => {
          const selectedTab = tab === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={selectedTab}
              className={selectedTab ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
              onClick={() => {
                setTab(value);
                setPayer('all');
                setStatus('all');
                setCode('all');
                setPriority('all');
              }}
            >
              {tabLabel(value)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Filter label={es ? 'Pagador' : 'Payer'} value={payer} options={payers} onChange={setPayer} />
        <Filter label={es ? 'Estado' : 'Status'} value={status} options={statuses} onChange={setStatus} />
        <Filter label={es ? 'Código' : 'Denial code'} value={code} options={codes} onChange={setCode} />
        <Filter
          label={es ? 'Prioridad' : 'Priority'}
          value={priority}
          options={['all', 'high', 'medium']}
          onChange={setPriority}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <div className="data-table-wrap surface">
          <table className="data-table">
            <thead>
              <tr>
                <SortHeader
                  label={es ? 'Pagador' : 'Payer'}
                  active={sortKey === 'payer'}
                  direction={direction}
                  onClick={() => toggleSort('payer')}
                />
                <SortHeader
                  label={es ? 'Estado' : 'Status'}
                  active={sortKey === 'status'}
                  direction={direction}
                  onClick={() => toggleSort('status')}
                />
                <SortHeader
                  label={es ? 'Código' : 'Code'}
                  active={sortKey === 'code'}
                  direction={direction}
                  onClick={() => toggleSort('code')}
                />
                <SortHeader
                  label={es ? 'Prioridad' : 'Priority'}
                  active={sortKey === 'priority'}
                  direction={direction}
                  onClick={() => toggleSort('priority')}
                />
                <th>{es ? 'Asunto' : 'Issue'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.payer}</td>
                  <td>{row.status[locale]}</td>
                  <td>
                    <span className="status-badge" data-tone={row.priority === 'high' ? 'bad' : 'warn'}>
                      {row.code}
                    </span>
                  </td>
                  <td>{row.priority === 'high' ? (es ? 'Alta' : 'High') : es ? 'Media' : 'Medium'}</td>
                  <td>
                    <button type="button" className="btn-ghost" onClick={() => setOpenId(row.id)}>
                      {row.issue[locale]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <p className="p-4 text-sm">{t.empty}</p> : null}
        </div>
        {selected ? (
          <DenialDrawer
            locale={locale}
            row={selected}
            openAppealLabel={t.openAppeal}
            onOpenAppeal={() => {
              setOpenId(selected.id);
              setAppealOpen(true);
            }}
          />
        ) : null}
      </div>

      <AppealGenerator
        open={appealOpen}
        locale={locale}
        row={selected}
        onClose={() => setAppealOpen(false)}
        labels={{
          title: t.appealTitle,
          close: t.appealClose,
          copy: t.appealCopy,
          copied: t.appealCopied,
          resubmit: t.appealResubmit,
          resubmitted: t.appealResubmitted,
          failClosed: t.appealFailClosed,
          letterLabel: t.appealLetterLabel,
        }}
      />
    </div>
  );
}

function sortValue(row: PortalDenialRow, key: SortKey, locale: 'en' | 'es') {
  if (key === 'status') return row.status[locale];
  if (key === 'priority') return row.priority;
  if (key === 'code') return row.code;
  return row.payer;
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="field min-w-36">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SortHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <th aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="btn-ghost" onClick={onClick}>
        {label}
      </button>
    </th>
  );
}

function DenialDrawer({
  locale,
  row,
  openAppealLabel,
  onOpenAppeal,
}: {
  locale: 'en' | 'es';
  row: PortalDenialRow;
  openAppealLabel: string;
  onOpenAppeal: () => void;
}) {
  const es = locale === 'es';
  return (
    <aside className="surface p-4" aria-label={row.issue[locale]}>
      <p className="overline">{row.claimId}</p>
      <h2 className="mt-2 text-lg font-bold">{row.issue[locale]}</h2>
      <p className="muted mt-1 text-xs">
        {row.patientRef} · {row.formType} · {row.cpt}
        {row.modifier ? ` ${row.modifier}` : ''}
      </p>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Línea de tiempo sintética' : 'Synthetic timeline'}</h3>
      <ol className="mt-2 space-y-2 text-sm">
        {row.timeline[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Observación del pagador' : 'Payer remark'}</h3>
      <p className="muted mt-2 text-sm">{row.remark[locale]}</p>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Cita educativa' : 'Educational citation'}</h3>
      <p className="muted mt-2 text-sm">{row.citation[locale]}</p>
      <button type="button" className="btn-primary mt-4" onClick={onOpenAppeal}>
        {openAppealLabel}
      </button>
    </aside>
  );
}
