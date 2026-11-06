import { effectiveFeatures } from '@/domain/feature-access';
import { requireOrgMembership } from '@/server/auth/membership';
import { getAuthContext } from '@/server/auth/session';
import { loadOrgGrants } from '@/server/entitlements/grants';
import { jsonApi, policyDenied } from '@/server/http/errors';

export const runtime = 'nodejs';

/** Effective features for the caller's own org: FREE baseline plus server-side paid grants. */
export async function GET(request: Request, context: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await context.params;
  const ctx = await getAuthContext(request.headers.get('cookie'));
  const decision = requireOrgMembership(ctx, orgId, 'organization.read');
  if (!decision.allow) return policyDenied(decision);
  const features = effectiveFeatures(orgId, await loadOrgGrants(orgId));
  return jsonApi(200, { data: { orgId, features }, meta: { correlationId: crypto.randomUUID() }, error: null });
}
