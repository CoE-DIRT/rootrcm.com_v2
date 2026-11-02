'use client';

import { useEffect, useId, useRef } from 'react';

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      queueMicrotask(() => closeRef.current?.focus());
    }
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="surface w-[min(100%-32px,420px)] p-6 text-[var(--text)]"
      aria-labelledby={titleId}
      aria-modal="true"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      data-node-id="3:38"
    >
      <h2 id={titleId} className="text-xl font-bold">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
      <form method="dialog" className="mt-6">
        <button ref={closeRef} className="btn-secondary focus-visible:outline-offset-2" type="submit">
          Close
        </button>
      </form>
    </dialog>
  );
}
