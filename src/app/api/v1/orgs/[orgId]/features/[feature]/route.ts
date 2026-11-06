import { getAuthContext } from '@/server/auth/session';
import { authorizeFeature } from '@/server/entitlements/gate';
import { loadOrgGrants } from '@/server/entitlements/grants';
import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';

export const runtime = 'nodejs';

/** 200 allowed; 401/403 identity or tenant; 404 unknown feature; 402 plan does not include it. */
export async function GET(request: Request, context: { params: Promise<{ orgId: string; feature: string }> }) {
  const { orgId, feature } = await context.params;
  const ctx = await getAuthContext(request.headers.get('cookie'));
  // Membership first (empty grants): non-members never trigger a grants lookup or learn plan state.
  const pre = authorizeFeature(ctx, orgId, feature, []);
  if (!pre.allow && pre.code === 'unknown_feature') return jsonError(404, 'unknown_feature', 'Unknown feature.');
  if (!pre.allow && pre.code !== 'entitlement_inactive') return policyDenied(pre);
  const access = pre.allow ? pre : authorizeFeature(ctx, orgId, feature, await loadOrgGrants(orgId));
  if (!access.allow) {
    if (access.code === 'entitlement_inactive') return jsonError(402, 'entitlement_inactive', 'This feature is not included in the current plan.');
    if (access.code === 'unknown_feature') return jsonError(404, 'unknown_feature', 'Unknown feature.');
    return policyDenied(access);
  }
  return jsonApi(200, { data: { orgId, feature, via: access.via }, meta: { correlationId: crypto.randomUUID() }, error: null });
}
