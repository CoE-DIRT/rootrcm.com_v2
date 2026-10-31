import type { OpsPersona } from '@/lib/ops-client';

export type OpsCommitIdentity = {
  orgId: string;
  persona: OpsPersona;
};

/**
 * A result may update the screen only when it still belongs to the request
 * that started it and to the practice/persona on screen now.
 * Call this again after every await. A check before the await is not enough.
 */
export function shouldCommitOpsResult(
  capturedGeneration: number,
  currentGeneration: number,
  payload: OpsCommitIdentity,
  active: OpsCommitIdentity,
): boolean {
  return (
    capturedGeneration === currentGeneration &&
    payload.orgId === active.orgId &&
    payload.persona === active.persona
  );
}
