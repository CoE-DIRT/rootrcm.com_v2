import { requireOrgMembership } from '@/server/auth/membership';
import { getAuthContext } from '@/server/auth/session';
import { jsonApi, policyDenied } from '@/server/http/errors';

export const runtime = 'nodejs';

/**
 * Privileged org read. Membership is decided by `requireMembership` via
 * `requireOrgMembership`. Appwrite row data is not returned while disabled.
 */
export async function GET(request: Request, context: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await context.params;
  const ctx = getAuthContext(request.headers.get('cookie'));
  const decision = requireOrgMembership(ctx, orgId, 'organization.read');
  if (!decision.allow) return policyDenied(decision);

  return jsonApi(200, {
    data: { orgId, status: 'disabled' as const },
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
}
