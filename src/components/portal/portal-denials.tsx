'use client';

import { useMemo, useState } from 'react';
import {
  appealTemplate,
  denialQueue,
  escalationChecklist,
  type DenialRow,
} from '@/content/portal-demo';
import { copy } from '@/content/messages';
import { AppealGenerator } from '@/features/portal/denials/appeal-generator';
import { filterDenialsByTab } from '@/features/portal/denials/load-denials';
import type { DenialQueueTab } from '@/features/portal/denials/types';
import { usePortalDemo } from './portal-frame';

type SortKey = 'payer' | 'status' | 'code' | 'priority' | 'amount';

export function PortalDenials() {
  const { locale } = usePortalDemo();
  const t = copy(locale).portal;
  const es = locale === 'es';
  const [tab, setTab] = useState<DenialQueueTab>('all');
  const [payer, setPayer] = useState('all');
  const [status, setStatus] = useState('all');
  const [code, setCode] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [openId, setOpenId] = useState<string | null>(denialQueue[0]?.id ?? null);
  const [appealOpen, setAppealOpen] = useState(false);

  const tabbed = useMemo(() => filterDenialsByTab(denialQueue, tab), [tab]);

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
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'amount') {
        return direction === 'asc' ? a.amountUsd - b.amountUsd : b.amountUsd - a.amountUsd;
      }
      const left = sortValue(a, sortKey, locale);
      const right = sortValue(b, sortKey, locale);
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    });
    return sorted;
  }, [tabbed, payer, status, code, priority, sortKey, direction, locale]);

  const selected = rows.find((row) => row.id === openId) ?? rows[0] ?? null;

  function toggleSort(next: SortKey) {
    if (sortKey === next) setDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(next);
      setDirection('asc');
    }
  }

  function selectTab(next: DenialQueueTab) {
    setTab(next);
    setPayer('all');
    setStatus('all');
    setCode('all');
    setPriority('all');
  }

  const tabs: { id: DenialQueueTab; label: string }[] = [
    { id: 'all', label: t.portalDenialsTabAll },
    { id: 'appeal', label: t.portalDenialsTabAppeal },
    { id: 'resolved', label: t.portalDenialsTabResolved },
    { id: 'high', label: t.portalDenialsTabHigh },
  ];

  return (
    <div>
      <p className="overline">{t.portalDenialsEyebrow}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{t.portalDenialsTitle}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">{t.portalDenialsBody}</p>

      <div
        role="tablist"
        aria-label={t.portalDenialsTabsLabel}
        className="mt-4 flex flex-wrap gap-2"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`denials-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls="denials-panel"
            className={tab === item.id ? 'btn-primary' : 'btn-secondary'}
            onClick={() => selectTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div id="denials-panel" role="tabpanel" aria-labelledby={`denials-tab-${tab}`} className="mt-4">
        <div className="flex flex-wrap gap-2">
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
                  <th>{t.portalDenialsClaim}</th>
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
                  <SortHeader
                    label={t.portalDenialsAmount}
                    active={sortKey === 'amount'}
                    direction={direction}
                    onClick={() => toggleSort('amount')}
                  />
                  <th>{es ? 'Asunto' : 'Issue'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <code className="text-xs font-semibold">{row.claimId}</code>
                      <span className="muted mt-1 block text-xs">{row.patientRef}</span>
                    </td>
                    <td>{row.payer}</td>
                    <td>{row.status[locale]}</td>
                    <td>
                      <span className="status-badge" data-tone={row.priority === 'high' ? 'bad' : 'warn'}>
                        {row.code}
                      </span>
                    </td>
                    <td>{row.priority === 'high' ? (es ? 'Alta' : 'High') : es ? 'Media' : 'Medium'}</td>
                    <td>${row.amountUsd.toLocaleString('en-US')}</td>
                    <td>
                      <button type="button" className="btn-ghost" onClick={() => setOpenId(row.id)}>
                        {row.issue[locale]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? <p className="p-4 text-sm">{es ? 'Ninguna fila coincide.' : 'No rows match.'}</p> : null}
          </div>
          {selected ? (
            <DenialDrawer
              locale={locale}
              row={selected}
              onOpenAppeal={() => {
                setOpenId(selected.id);
                setAppealOpen(true);
              }}
              appealLabel={t.portalDenialsOpenAppeal}
            />
          ) : null}
        </div>
      </div>

      <AppealGenerator
        open={appealOpen}
        locale={locale}
        row={selected}
        onClose={() => setAppealOpen(false)}
        labels={{
          title: t.portalDenialsAppealTitle,
          close: t.portalDenialsAppealClose,
          copy: t.portalDenialsAppealCopy,
          copied: t.portalDenialsAppealCopied,
          resubmit: t.portalDenialsAppealResubmit,
          resubmitted: t.portalDenialsAppealResubmitted,
          failClosed: t.portalDenialsAppealFailClosed,
          letterLabel: t.portalDenialsAppealLetter,
        }}
      />
    </div>
  );
}

function sortValue(row: DenialRow, key: Exclude<SortKey, 'amount'>, locale: 'en' | 'es') {
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

/** ASC inspector drawer — timeline, remark, template, escalation preserved. */
function DenialDrawer({
  locale,
  row,
  onOpenAppeal,
  appealLabel,
}: {
  locale: 'en' | 'es';
  row: DenialRow;
  onOpenAppeal: () => void;
  appealLabel: string;
}) {
  const es = locale === 'es';
  return (
    <aside className="surface p-4" aria-label={row.issue[locale]}>
      <p className="overline">{row.id}</p>
      <p className="muted mt-1 text-xs">
        {row.claimId} · {row.patientRef} · {row.formType}
      </p>
      <h2 className="mt-2 text-lg font-bold">{row.issue[locale]}</h2>
      <p className="mt-2 text-sm font-semibold">
        ${row.amountUsd.toLocaleString('en-US')} · CPT {row.cpt}
        {row.modifier ? ` ${row.modifier}` : ''}
      </p>
      <button type="button" className="btn-primary mt-3" onClick={onOpenAppeal}>
        {appealLabel}
      </button>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Línea de tiempo sintética' : 'Synthetic timeline'}</h3>
      <ol className="mt-2 space-y-2 text-sm">
        {row.timeline[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Observación del pagador' : 'Payer remark'}</h3>
      <p className="muted mt-2 text-sm">{row.remark[locale]}</p>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Cita de codificación' : 'Coding citation'}</h3>
      <p className="muted mt-2 text-sm">{row.citation[locale]}</p>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Plantilla de apelación' : 'Appeal template'}</h3>
      <p className="muted mt-2 text-sm">{appealTemplate[locale]}</p>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Lista de escalamiento' : 'Escalation checklist'}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {escalationChecklist[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
