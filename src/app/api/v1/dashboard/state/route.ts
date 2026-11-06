import { getAuthContext } from '@/server/auth/session';
import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';
import {
  authorizeMemberDashboard,
  buildMemberSample,
  isMemberDashboardKind,
} from '@/server/operations/member-dashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Read-only, synthetic-labeled dashboard snapshot for a verified Appwrite member.
 * Distinct from /api/v1/ops/* (signed preview cookie). Query orgId is only a
 * selector that must match the caller's own membership.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind');
  if (!isMemberDashboardKind(kind)) return jsonError(422, 'invalid_request', 'kind must be client, staff or admin.');
  const ctx = await getAuthContext(request.headers.get('cookie'));
  const access = authorizeMemberDashboard(ctx, kind, url.searchParams.get('orgId'));
  if (!access.allow) return policyDenied(access.decision);
  return jsonApi(200, {
    data: buildMemberSample(access),
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
}
