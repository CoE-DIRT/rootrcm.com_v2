import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';
import { applyOpsCookies } from '@/server/operations/session-http';
import { readOpsSessionFromRequest } from '@/server/operations/session';
import { readOpsState } from '@/server/operations/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Synthetic operations snapshot. Query orgId/persona are selectors.
 * Authorization comes from the signed presentation cookie, not the query string.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orgId = url.searchParams.get('orgId') ?? '';
  const persona = url.searchParams.get('persona') ?? '';

  if (!orgId || !persona) {
    return jsonError(422, 'invalid_request', 'orgId and persona are required.');
  }

  const session = await readOpsSessionFromRequest(request);
  const result = readOpsState(orgId, persona, session);
  if (!result.ok) return policyDenied(result.decision);

  const response = jsonApi(200, {
    data: result.view,
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
  return applyOpsCookies(response, session.id, session.capability);
}
