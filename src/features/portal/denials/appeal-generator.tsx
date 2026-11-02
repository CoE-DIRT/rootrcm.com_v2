'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { buildAppealLetter } from './load-denials.ts';
import type { PortalDenialRow } from './types.ts';

type AppealGeneratorProps = {
  open: boolean;
  locale: Locale;
  row: PortalDenialRow | null;
  onClose: () => void;
  labels: {
    title: string;
    close: string;
    copy: string;
    copied: string;
    resubmit: string;
    resubmitted: string;
    failClosed: string;
    letterLabel: string;
  };
};

export function AppealGenerator({ open, locale, row, onClose, labels }: AppealGeneratorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const letterId = useId();
  const sessionKey = `${row?.id ?? 'none'}:${open ? 'open' : 'closed'}`;
  const [copied, setCopied] = useState(false);
  const [resubmitted, setResubmitted] = useState(false);
  const [activeSession, setActiveSession] = useState(sessionKey);

  if (activeSession !== sessionKey) {
    setActiveSession(sessionKey);
    setCopied(false);
    setResubmitted(false);
  }

  const letter = row ? buildAppealLetter(row, locale) : '';

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      queueMicrotask(() => closeRef.current?.focus());
    }
    if (!open && node.open) node.close();
  }, [open]);

  async function copyLetter() {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function simulateResubmit() {
    // Fail-closed: never call a clearinghouse. Local UI acknowledgement only.
    setResubmitted(true);
  }

  return (
    <dialog
      ref={dialogRef}
      className="surface w-[min(100%-24px,640px)] max-h-[min(90dvh,720px)] overflow-y-auto p-6 text-[var(--text)]"
      aria-labelledby={titleId}
      aria-modal="true"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={titleId} className="text-xl font-bold">
            {labels.title}
          </h2>
          {row ? (
            <p className="muted mt-1 text-sm">
              {row.claimId} · {row.patientRef} · {row.formType}
            </p>
          ) : null}
        </div>
        <button ref={closeRef} type="button" className="btn-ghost" onClick={onClose} aria-label={labels.close}>
          {labels.close}
        </button>
      </div>

      <p className="muted mt-3 text-xs">{labels.failClosed}</p>

      <label className="mt-4 block text-sm font-bold" htmlFor={letterId}>
        {labels.letterLabel}
      </label>
      <textarea
        id={letterId}
        className="mt-2 min-h-64 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-xs leading-relaxed"
        readOnly
        value={letter}
        aria-readonly="true"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => void copyLetter()} disabled={!row}>
          {copied ? labels.copied : labels.copy}
        </button>
        <button type="button" className="btn-secondary" onClick={simulateResubmit} disabled={!row || resubmitted}>
          {resubmitted ? labels.resubmitted : labels.resubmit}
        </button>
      </div>
      {resubmitted ? (
        <p className="mt-3 text-sm" role="status">
          {labels.failClosed}
        </p>
      ) : null}
    </dialog>
  );
}
