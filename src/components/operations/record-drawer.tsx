'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize, type OpsHistoryEntry } from '@/lib/ops-client';
import { opsButton, opsSubtle } from './ui';

export function RecordDrawer({
  open,
  locale,
  title,
  subtitle,
  nextAction,
  owner,
  provenance,
  history,
  onClose,
  children,
}: {
  open: boolean;
  locale: Locale;
  title: string;
  subtitle: string;
  nextAction: string;
  owner: string;
  provenance: string;
  history: readonly OpsHistoryEntry[];
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = workspaceDemoText[locale];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      data-testid="record-drawer"
      className="fixed inset-y-0 right-0 m-0 h-[100dvh] w-full max-w-[min(100vw,420px)] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text)]"
      onClose={onClose}
      aria-labelledby="ops-record-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wide ${opsSubtle}`}>{t.recordDetail}</p>
          <h2 id="ops-record-title" className="mt-1 wrap-break-word text-xl font-extrabold">
            {title}
          </h2>
          <p className={`mt-1 wrap-break-word text-sm ${opsSubtle}`}>{subtitle}</p>
        </div>
        <button type="button" className={opsButton} onClick={onClose} aria-label={t.closeRecord}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-4 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        {t.syntheticTag}
      </p>
      <p className={`mt-2 text-xs ${opsSubtle}`}>
        {t.provenance}: {provenance}
      </p>
      <div className="mt-4 grid gap-3 rounded-xl bg-[var(--surface-2)] p-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-wide ${opsSubtle}`}>{t.nextAction}</p>
          <p className="mt-1 text-sm font-semibold">{nextAction || '—'}</p>
        </div>
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-wide ${opsSubtle}`}>{t.owner}</p>
          <p className="mt-1 text-sm font-semibold">{owner || '—'}</p>
        </div>
      </div>
      {children}
      <section className="mt-5" aria-label={t.history}>
        <h3 className="font-extrabold">{t.history}</h3>
        {history.length === 0 ? (
          <p className={`mt-2 text-sm ${opsSubtle}`}>{t.emptyHistory}</p>
        ) : (
          <ol className="mt-3 space-y-3" data-testid="record-history">
            {history.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-sm font-bold">{localize(entry.summary, locale)}</p>
                <p className={`mt-1 wrap-break-word text-xs ${opsSubtle}`}>
                  {entry.actor}
                  {entry.at ? ` · ${entry.at}` : ''}
                  {entry.from || entry.to ? ` · ${entry.from ?? '—'} → ${entry.to ?? '—'}` : ''}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </dialog>
  );
}
