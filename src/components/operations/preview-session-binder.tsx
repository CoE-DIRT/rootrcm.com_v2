'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type PreviewBindStatus = 'binding' | 'ready' | 'error';

type PreviewSessionValue = {
  status: PreviewBindStatus;
  retry: () => void;
};

const PreviewSessionContext = createContext<PreviewSessionValue | null>(null);

export function usePreviewSession(): PreviewSessionValue | null {
  return useContext(PreviewSessionContext);
}

function bindCopy(path: string) {
  const spanish = path === '/es' || path.startsWith('/es/');
  if (spanish) {
    return {
      failed:
        'No se pudo confirmar la sesión de vista previa. Las operaciones permanecen cerradas hasta que el vínculo tenga éxito.',
      retry: 'Reintentar',
    };
  }
  return {
    failed:
      'The preview session could not be confirmed. Operations stay closed until binding succeeds.',
    retry: 'Retry',
  };
}

type BindPayload = {
  data?: { bound?: boolean; reason?: string };
};

function bindSucceeded(payload: BindPayload): boolean {
  return payload.data?.bound === true || payload.data?.reason === 'operator_retained';
}

/**
 * Confirms the preview capability before child operations reads run.
 * A rejected or non-OK response stays visible and can be retried.
 * Prefetch and unscoped results are not treated as a successful bind.
 */
export function PreviewSessionBinder({ path, children }: { path: string; children?: ReactNode }) {
  const [status, setStatus] = useState<PreviewBindStatus>('binding');
  const requestRef = useRef(0);
  const copy = bindCopy(path);

  const requestBind = useCallback(async (requestId: number) => {
    try {
      const response = await fetch('/api/v1/ops/preview-bind', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path }),
        credentials: 'same-origin',
      });
      if (requestId !== requestRef.current) return;
      if (!response.ok) {
        setStatus('error');
        return;
      }
      const payload = (await response.json()) as BindPayload;
      if (requestId !== requestRef.current) return;
      setStatus(bindSucceeded(payload) ? 'ready' : 'error');
    } catch {
      if (requestId !== requestRef.current) return;
      setStatus('error');
    }
  }, [path]);

  const retry = useCallback(() => {
    const requestId = ++requestRef.current;
    setStatus('binding');
    void requestBind(requestId);
  }, [requestBind]);

  useEffect(() => {
    const requestId = ++requestRef.current;
    void requestBind(requestId);
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const nextId = ++requestRef.current;
      setStatus('binding');
      void requestBind(nextId);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [requestBind]);

  const value = useMemo<PreviewSessionValue>(() => ({ status, retry }), [retry, status]);

  return (
    <PreviewSessionContext.Provider value={value}>
      {status === 'error' ? (
        <div
          className="page-width mb-4 rounded-xl border border-[var(--danger)] bg-[var(--surface)] p-4"
          data-status="error"
          data-testid="preview-bind-error"
          role="alert"
        >
          <p className="font-bold text-[var(--danger)]">{copy.failed}</p>
          <button
            className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold"
            data-testid="preview-bind-retry"
            onClick={retry}
            type="button"
          >
            {copy.retry}
          </button>
        </div>
      ) : null}
      <div data-status={status} data-testid="preview-bind-status" hidden />
      {children}
    </PreviewSessionContext.Provider>
  );
}
