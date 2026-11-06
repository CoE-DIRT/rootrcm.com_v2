import { createHash } from 'node:crypto';
import type { AuthContext } from '../auth/policy.ts';
import type { Row, RowWriter } from './row-store.ts';
import type { SignupProfile } from './profile.ts';

export const SIGNUP_TERMS_VERSION = 'free-signup.v1';
export const SIGNUP_MARKETING_VERSION = 'marketing-email.v1';

/** Values for required enum-like columns; confirm against live columns in the isolated hosted smoke test. */
export const SIGNUP_VALUES = {
  orgStatus: 'active',
  businessType: 'practice',
  orgSource: 'self_signup',
  lifecycleStage: 'lead',
  leadStatus: 'new',
  companyStatus: 'prospect',
} as const;

export type ProvisionResult =
  | { ok: true; orgId: string; created: boolean; marketingRecorded?: boolean }
  | { ok: false; reason: 'unauthenticated' | 'existing_membership' | 'membership_inactive' | 'store_unavailable' };

const sha = (v: string) => createHash('sha256').update(v).digest('hex');
export const workspaceIds = (userId: string) => {
  const h = sha(userId).slice(0, 24);
  const orgId = `org_${h}`;
  return {
    orgId,
    company: `co_acct_${h}`,
    contact: `ct_acct_${h}`,
    membership: `mb_${sha(`${userId}|${orgId}`).slice(0, 24)}`,
    terms: `cs_terms_${h}`,
    marketing: `cs_mkt_${h}`,
    audit: `au_signup_${h}`,
  };
};

/** An ACTIVE owner row for this user/org means the workspace is live; anything else is inactive. */
function membershipOutcome(row: Row | null, userId: string, orgId: string): ProvisionResult {
  const active = !!row && row.userId === userId && row.orgId === orgId && row.role === 'CLIENT_OWNER' && row.status === 'active' && !row.revokedAt;
  return active ? { ok: true, orgId, created: false } : { ok: false, reason: 'membership_inactive' };
}

/**
 * Provision a FREE workspace for a VERIFIED signed-in user (getAuthContext already requires a verified email).
 * One deterministic workspace per user. Order: organization, company, contact, consents, audit, and the
 * CLIENT_OWNER membership LAST, so access exists only once everything else does. Every create is idempotent,
 * so a retry after a partial failure repairs the chain; success is returned only after the membership exists.
 * A user who already belongs to a different org is refused (no second tenant, no role change).
 * Free = basic workspace + consultation; no entitlement row is created (paid access comes only from server grants).
 */
export async function provisionFreeWorkspace(
  ctx: AuthContext,
  profile: SignupProfile,
  writer: RowWriter,
  now = Date.now(),
  requestId = crypto.randomUUID(),
): Promise<ProvisionResult> {
  if (!ctx.session) return { ok: false, reason: 'unauthenticated' };
  // Unknown membership state (lookup failed) is not proof of 'no membership': write nothing.
  if (ctx.membershipsUnavailable) return { ok: false, reason: 'store_unavailable' };
  const { userId, email } = ctx.session;
  const id = workspaceIds(userId);
  if (ctx.memberships.length > 0) {
    if (ctx.memberships.length === 1 && ctx.memberships[0].orgId === id.orgId) return { ok: true, orgId: id.orgId, created: false };
    return { ok: false, reason: 'existing_membership' };
  }
  const at = new Date(now).toISOString();
  try {
    // Settle the membership row FIRST. If it already exists the workspace is complete (or revoked) and this request
    // must not touch any data row, so a stale or duplicate request cannot rewrite a finished signup.
    const prior = await writer.read('memberships', id.membership);
    if (prior) return membershipOutcome(prior, userId, id.orgId);

    // Identity rows are written as one consistent set from THIS submission. They are not yet reachable by any
    // membership, so a retry with corrected details reconciles (create, else update) instead of keeping a
    // mixture of the earlier and later submissions.
    const put = async (table: string, rowId: string, data: Row) => {
      if ((await writer.create(table, rowId, data)) === 'exists') await writer.update(table, rowId, data);
    };
    await put('organizations', id.orgId, {
      legalName: profile.practiceName, displayName: profile.practiceName,
      businessType: SIGNUP_VALUES.businessType, status: SIGNUP_VALUES.orgStatus,
      ownerUserId: userId, source: SIGNUP_VALUES.orgSource, createdAt: at,
    });
    await put('crm_companies', id.company, {
      name: profile.practiceName, lifecycleStage: SIGNUP_VALUES.lifecycleStage, status: SIGNUP_VALUES.companyStatus,
    });
    await put('crm_contacts', id.contact, {
      firstName: profile.firstName, lastName: profile.lastName, email, emailNormalized: email.toLowerCase(),
      phone: profile.phone, companyId: id.company,
      lifecycleStage: SIGNUP_VALUES.lifecycleStage, leadStatus: SIGNUP_VALUES.leadStatus,
    });
    await writer.create('consent_records', id.terms, {
      subjectType: 'contact', subjectId: id.contact, consentType: 'account_terms', granted: true,
      recordedAt: at, policyVersion: SIGNUP_TERMS_VERSION, source: 'free_signup',
    });
    await writer.create('audit_events', id.audit, {
      eventId: id.audit, action: 'account.free_workspace_provisioned', occurredAt: at,
      actorUserId: userId, orgId: id.orgId, targetType: 'organization', targetId: id.orgId, result: 'allow', requestId,
    });
    const membership = await writer.create('memberships', id.membership, {
      userId, orgId: id.orgId, role: 'CLIENT_OWNER', status: 'active', grantedAt: at,
    });
    if (membership === 'exists') {
      // Lost a race with a concurrent request, or the row is revoked. Read it: an ACTIVE owner row for this user means
      // the workspace is live (report success, write nothing more, never touch consent); anything else is inactive.
      return membershipOutcome(await writer.read('memberships', id.membership), userId, id.orgId);
    }
    // Only the request that actually CREATED the membership records the marketing choice, so a concurrent or stale
    // request can never overwrite it. Absence of a granted row always means no marketing consent (fail-safe).
    let marketingRecorded = true;
    try {
      await writer.create('consent_records', id.marketing, {
        subjectType: 'contact', subjectId: id.contact, consentType: 'marketing_email', granted: profile.marketingConsent,
        recordedAt: at, policyVersion: SIGNUP_MARKETING_VERSION, source: 'free_signup',
      });
    } catch { marketingRecorded = false; }
    return { ok: true, orgId: id.orgId, created: true, marketingRecorded };
  } catch {
    return { ok: false, reason: 'store_unavailable' };
  }
}
