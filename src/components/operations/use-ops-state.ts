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
    } catch (err) {
      setState(null);
      setError(err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [orgId, persona]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const next = await fetchOpsState(orgId, persona);
        if (!cancelled) {
          setState(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setState(null);
          setError(
            err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId, persona]);

  const runAction = useCallback(
    async (
      action: Omit<OpsActionRequest, 'orgId' | 'persona'> &
        Partial<Pick<OpsActionRequest, 'orgId' | 'persona'>>,
    ) => {
      setPending(true);
      setError(null);
      try {
        const payload: OpsActionRequest = {
          type: action.type,
          orgId: action.orgId ?? orgId,
          persona: action.persona ?? persona,
        };
        if (action.applicationId) payload.applicationId = action.applicationId;
        if (action.claimId) payload.claimId = action.claimId;
        const next = await postOpsAction(payload);
        setState(next ?? (await fetchOpsState(payload.orgId, payload.persona)));
      } catch (err) {
        setError(
          err instanceof OpsClientError ? err.message : 'The operations action could not be completed.',
        );
        throw err;
      } finally {
        setPending(false);
      }
    },
    [orgId, persona],
  );

  return { state, loading, error, pending, refresh, runAction };
}
