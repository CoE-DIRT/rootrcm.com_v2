'use client';

import { useMemo, useState } from 'react';
import {
  appealTemplate,
  denialQueue,
  escalationChecklist,
  type DenialRow,
} from '@/content/portal-demo';
import { usePortalDemo } from './portal-frame';

type SortKey = 'payer' | 'status' | 'code' | 'priority';

export function PortalDenials() {
  const { locale } = usePortalDemo();
  const es = locale === 'es';
  const [payer, setPayer] = useState('all');
  const [status, setStatus] = useState('all');
  const [code, setCode] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [openId, setOpenId] = useState<string | null>(denialQueue[0]?.id ?? null);

  const payers = ['all', ...new Set(denialQueue.map((row) => row.payer))];
  const statuses = ['all', ...new Set(denialQueue.map((row) => row.status.en))];
  const codes = ['all', ...new Set(denialQueue.map((row) => row.code))];

  const rows = useMemo(() => {
    const filtered = denialQueue.filter((row) => {
      if (payer !== 'all' && row.payer !== payer) return false;
      if (status !== 'all' && row.status.en !== status) return false;
      if (code !== 'all' && row.code !== code) return false;
      if (priority !== 'all' && row.priority !== priority) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      const left = sortValue(a, sortKey, locale);
      const right = sortValue(b, sortKey, locale);
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    });
    return sorted;
  }, [payer, status, code, priority, sortKey, direction, locale]);

  const selected = rows.find((row) => row.id === openId) ?? rows[0] ?? null;

  function toggleSort(next: SortKey) {
    if (sortKey === next) setDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(next);
      setDirection('asc');
    }
  }

  return (
    <div>
      <p className="overline">{es ? 'Cola sintética ASC' : 'Synthetic ASC queue'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">
        {es ? 'Denegaciones de demostración' : 'Demonstration denials'}
      </h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {es
          ? 'Etiquetas sintéticas CO-4, CO-16 y PR-204. No son identificadores de reclamos reales ni consejos de facturación.'
          : 'Synthetic labels CO-4, CO-16 and PR-204. They are not real claim identifiers or billing advice.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Filter label={es ? 'Pagador' : 'Payer'} value={payer} options={payers} onChange={setPayer} />
        <Filter label={es ? 'Estado' : 'Status'} value={status} options={statuses} onChange={setStatus} />
        <Filter label={es ? 'Código' : 'Denial code'} value={code} options={codes} onChange={setCode} />
        <Filter label={es ? 'Prioridad' : 'Priority'} value={priority} options={['all', 'high', 'medium']} onChange={setPriority} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <div className="data-table-wrap surface">
          <table className="data-table">
            <thead>
              <tr>
                <SortHeader label={es ? 'Pagador' : 'Payer'} active={sortKey === 'payer'} direction={direction} onClick={() => toggleSort('payer')} />
                <SortHeader label={es ? 'Estado' : 'Status'} active={sortKey === 'status'} direction={direction} onClick={() => toggleSort('status')} />
                <SortHeader label={es ? 'Código' : 'Code'} active={sortKey === 'code'} direction={direction} onClick={() => toggleSort('code')} />
                <SortHeader label={es ? 'Prioridad' : 'Priority'} active={sortKey === 'priority'} direction={direction} onClick={() => toggleSort('priority')} />
                <th>{es ? 'Asunto' : 'Issue'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.payer}</td>
                  <td>{row.status[locale]}</td>
                  <td><span className="status-badge" data-tone={row.priority === 'high' ? 'bad' : 'warn'}>{row.code}</span></td>
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
          {rows.length === 0 ? <p className="p-4 text-sm">{es ? 'Ninguna fila coincide.' : 'No rows match.'}</p> : null}
        </div>
        {selected ? <DenialDrawer locale={locale} row={selected} /> : null}
      </div>
    </div>
  );
}

function sortValue(row: DenialRow, key: SortKey, locale: 'en' | 'es') {
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

function DenialDrawer({ locale, row }: { locale: 'en' | 'es'; row: DenialRow }) {
  const es = locale === 'es';
  return (
    <aside className="surface p-4" aria-label={row.issue[locale]}>
      <p className="overline">{row.id}</p>
      <h2 className="mt-2 text-lg font-bold">{row.issue[locale]}</h2>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Línea de tiempo sintética' : 'Synthetic timeline'}</h3>
      <ol className="mt-2 space-y-2 text-sm">
        {row.timeline[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <h3 className="mt-4 text-sm font-bold">{es ? 'Observación del pagador' : 'Payer remark'}</h3>
      <p className="muted mt-2 text-sm">{row.remark[locale]}</p>
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
