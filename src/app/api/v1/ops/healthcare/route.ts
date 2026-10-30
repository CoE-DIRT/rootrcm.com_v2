import { isHealthcareKind } from '@/domain/healthcare/types';
import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';
import { queryHealthcare } from '@/server/healthcare/query';
import { applyOpsCookies } from '@/server/operations/session-http';
import { readOpsSessionFromRequest } from '@/server/operations/session';
import { authorizeOpsPreview } from '@/server/operations/policy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Session-scoped healthcare query over the operations ledger.
 * Go is probed for synthetic availability; records come from Next ops state.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const kindRaw = url.searchParams.get('kind') ?? 'capabilities';
  const orgId = url.searchParams.get('orgId') ?? '';
  const persona = url.searchParams.get('persona') ?? '';
  const session = await readOpsSessionFromRequest(request);

  if (!isHealthcareKind(kindRaw)) {
    return jsonError(422, 'unknown_capability', 'Unknown healthcare query kind.');
  }

  const needsTenant = kindRaw !== 'healthz' && kindRaw !== 'capabilities';
  if (needsTenant && (!orgId || !persona)) {
    return jsonError(422, 'invalid_request', 'orgId and persona are required.');
  }
  if (needsTenant || (orgId && persona)) {
    const access = authorizeOpsPreview({
      orgId,
      persona,
      capability: session.capability,
    });
    if (!access.allow) return policyDenied(access.decision);
  }

  const envelope = await queryHealthcare({
    kind: kindRaw,
    orgId: orgId || undefined,
    session,
  });
  const status = envelope.mode === 'unavailable' ? 503 : 200;
  const response = jsonApi(status, {
    data: envelope,
    meta: { correlationId: crypto.randomUUID() },
    error: envelope.error,
  });
  response.headers.set('X-Demo-Data', 'synthetic');
  return applyOpsCookies(response, session.id, session.capability);
}
