'use client';

import { useEffect, useRef } from 'react';

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
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="surface w-[min(100%-32px,420px)] p-6"
      onClose={onClose}
      data-node-id="3:38"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
      <form method="dialog" className="mt-6">
        <button className="btn-secondary" type="submit">
          Close
        </button>
      </form>
    </dialog>
  );
}
