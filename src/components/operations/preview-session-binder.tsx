'use client';

import { useEffect } from 'react';

/**
 * Next.js can satisfy a staff click from the prefetch cache and skip middleware.
 * This posts only after a real document visit, including a back/forward cache restore.
 * The server ignores prefetch headers and will not lower an operator cookie.
 */
export function PreviewSessionBinder({ path }: { path: string }) {
  useEffect(() => {
    const bind = () => {
      void fetch('/api/v1/ops/preview-bind', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path }),
        credentials: 'same-origin',
      });
    };
    bind();
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) bind();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [path]);
  return null;
}
