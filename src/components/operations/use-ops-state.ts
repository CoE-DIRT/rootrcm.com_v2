'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const scopeRef = useRef({ orgId, persona, generation: 0 });
  scopeRef.current.orgId = orgId;
  scopeRef.current.persona = persona;

  const refresh = useCallback(async () => {
    const generation = ++scopeRef.current.generation;
    setLoading(true);
    try {
      const next = await fetchOpsState(orgId, persona);
      if (generation !== scopeRef.current.generation) return;
      setState(next);
      setError(null);
    } catch (err) {
      if (generation !== scopeRef.current.generation) return;
      setState(null);
      setError(err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.');
    } finally {
      if (generation === scopeRef.current.generation) setLoading(false);
    }
  }, [orgId, persona]);

  useEffect(() => {
    const generation = ++scopeRef.current.generation;
    void (async () => {
      try {
        const next = await fetchOpsState(orgId, persona);
        if (generation !== scopeRef.current.generation) return;
        setState(next);
        setError(null);
      } catch (err) {
        if (generation !== scopeRef.current.generation) return;
        setState(null);
        setError(
          err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.',
        );
      } finally {
        if (generation === scopeRef.current.generation) setLoading(false);
      }
    })();
  }, [orgId, persona]);

  const runAction = useCallback(
    async (
      action: Omit<OpsActionRequest, 'orgId' | 'persona'> &
        Partial<Pick<OpsActionRequest, 'orgId' | 'persona'>>,
    ) => {
      const generation = ++scopeRef.current.generation;
      const payload: OpsActionRequest = {
        type: action.type,
        orgId: action.orgId ?? orgId,
        persona: action.persona ?? persona,
      };
      if (action.applicationId) payload.applicationId = action.applicationId;
      if (action.claimId) payload.claimId = action.claimId;
      setPending(true);
      setError(null);
      try {
        const next = await postOpsAction(payload);
        if (generation !== scopeRef.current.generation) return;
        const nextPersona: OpsPersona = payload.persona === 'staff' ? 'staff' : 'client';
        if (payload.orgId !== scopeRef.current.orgId || nextPersona !== scopeRef.current.persona) {
          return;
        }
        setState(next ?? (await fetchOpsState(payload.orgId, nextPersona)));
      } catch (err) {
        if (generation !== scopeRef.current.generation) return;
        setError(
          err instanceof OpsClientError ? err.message : 'The operations action could not be completed.',
        );
        throw err;
      } finally {
        if (generation === scopeRef.current.generation) setPending(false);
      }
    },
    [orgId, persona],
  );

  return { state, loading, error, pending, refresh, runAction };
}
