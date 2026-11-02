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
import { shouldCommitOpsResult, type OpsCommitIdentity } from './ops-commit';
import { usePreviewSession } from './preview-session-binder';

export function useOpsState(orgId: string, persona: OpsPersona) {
  const preview = usePreviewSession();
  const previewStatus = preview?.status ?? 'ready';
  const [state, setState] = useState<OpsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const generationRef = useRef(0);
  const identityRef = useRef<OpsCommitIdentity>({ orgId, persona });
  const [trackedOrg, setTrackedOrg] = useState(orgId);
  const [trackedPersona, setTrackedPersona] = useState(persona);
  if (trackedOrg !== orgId || trackedPersona !== persona) {
    setTrackedOrg(orgId);
    setTrackedPersona(persona);
    setPending(false);
    setLoading(true);
  }

  const refresh = useCallback(async () => {
    if (previewStatus !== 'ready') return;
    const generation = ++generationRef.current;
    const requested: OpsCommitIdentity = { orgId, persona };
    setLoading(true);
    try {
      const next = await fetchOpsState(orgId, persona);
      if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
      setState(next);
      setError(null);
    } catch (err) {
      if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
      setState(null);
      setError(err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.');
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  }, [orgId, persona, previewStatus]);

  useEffect(() => {
    identityRef.current = { orgId, persona };
    if (previewStatus !== 'ready') {
      generationRef.current += 1;
      return;
    }
    const generation = ++generationRef.current;
    const requested: OpsCommitIdentity = { orgId, persona };
    void (async () => {
      await Promise.resolve();
      try {
        const next = await fetchOpsState(orgId, persona);
        if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
        setState(next);
        setError(null);
      } catch (err) {
        if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
        setState(null);
        setError(
          err instanceof OpsClientError ? err.message : 'Operations state could not be loaded.',
        );
      } finally {
        if (generation === generationRef.current) setLoading(false);
      }
    })();
  }, [orgId, persona, previewStatus]);

  const runAction = useCallback(
    async (
      action: Omit<OpsActionRequest, 'orgId' | 'persona'> &
        Partial<Pick<OpsActionRequest, 'orgId' | 'persona'>>,
    ) => {
      if (previewStatus !== 'ready') {
        throw new OpsClientError('Preview session is not bound.', 409, 'preview_unbound');
      }
      const generation = ++generationRef.current;
      const payload: OpsActionRequest = {
        type: action.type,
        orgId: action.orgId ?? orgId,
        persona: action.persona ?? persona,
      };
      if (action.applicationId) payload.applicationId = action.applicationId;
      if (action.claimId) payload.claimId = action.claimId;
      const requested: OpsCommitIdentity = {
        orgId: payload.orgId,
        persona: payload.persona === 'staff' ? 'staff' : 'client',
      };
      setPending(true);
      setError(null);
      try {
        const posted = await postOpsAction(payload);
        if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
        const resolved = posted ?? (await fetchOpsState(payload.orgId, requested.persona));
        if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
        setState(resolved);
      } catch (err) {
        if (!shouldCommitOpsResult(generation, generationRef.current, requested, identityRef.current)) return;
        setError(
          err instanceof OpsClientError ? err.message : 'The operations action could not be completed.',
        );
        throw err;
      } finally {
        if (generation === generationRef.current) setPending(false);
      }
    },
    [orgId, persona, previewStatus],
  );

  const visibleLoading = previewStatus === 'error' ? false : previewStatus === 'binding' ? true : loading;
  return { state, loading: visibleLoading, error, pending, refresh, runAction };
}
