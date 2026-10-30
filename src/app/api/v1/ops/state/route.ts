import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';
import { readOpsState } from '@/server/operations/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Synthetic operations snapshot. Query is orgId + persona only — extra
 * parameters are ignored so a client cannot submit PHI through this route.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orgId = url.searchParams.get('orgId') ?? '';
  const persona = url.searchParams.get('persona') ?? '';

  if (!orgId || !persona) {
    return jsonError(422, 'invalid_request', 'orgId and persona are required.');
  }

  const result = readOpsState(orgId, persona);
  if (!result.ok) return policyDenied(result.decision);

  return jsonApi(200, {
    data: result.view,
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
}
