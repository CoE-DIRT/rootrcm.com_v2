'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  OpsClientError,
  fetchOpsState,
  postOpsAction,
  type OpsActionRequest,
  type OpsPersona,
  type OpsState,
} from '@/lib/ops-client';

export function useOpsState(orgId: string, persona: OpsPersona) {
  const [state, setState] = useState<OpsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchOpsState(orgId, persona);
      setState(next);
      setError(null);
      setLoading(false);
    } catch (err) {
      setState(null);
      setError(err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.');
      setLoading(false);
    }
  }, [orgId, persona]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const next = await fetchOpsState(orgId, persona);
        if (cancelled) return;
        setState(next);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setState(null);
        setError(err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.');
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [orgId, persona]);

  const runAction = useCallback(
    async (action: Omit<OpsActionRequest, 'orgId' | 'persona'> & Partial<Pick<OpsActionRequest, 'orgId' | 'persona'>>) => {
      setPending(true);
      setError(null);
      try {
        const next = await postOpsAction({ orgId, persona, ...action });
        setState(next ?? (await fetchOpsState(orgId, persona)));
      } catch (err) {
        setError(err instanceof OpsClientError ? err.message : 'The operations action could not be completed.');
        throw err;
      } finally {
        setPending(false);
      }
    },
    [orgId, persona],
  );

  return { state, loading, error, pending, refresh, runAction };
}
