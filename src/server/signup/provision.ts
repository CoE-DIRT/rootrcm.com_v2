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

/** Length of one provisioning lock window. A lock row can be created once per user per window. */
export const LOCK_WINDOW_MS = 60_000;

export type ProvisionResult =
  | { ok: true; orgId: string; created: boolean; marketingRecorded?: boolean }
  | { ok: false; reason: 'unauthenticated' | 'existing_membership' | 'membership_inactive' | 'in_progress' | 'store_unavailable' };

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
    lock: (window: number) => `lk_${sha(`${userId}|${window}`).slice(0,24)}`,
  };
};

/** An ACTIVE owner row for this user/org means the workspace is live; anything else is inactive. */
function membershipOutcome(row: Row | null, userId: string, orgId: string): ProvisionResult {
  const active = !!row && row.userId === userId && row.orgId === orgId && row.role === 'CLIENT_OWNER' && row.status === 'active' && !row.revokedAt;
  return active ? { ok: true, orgId, created: false } : { ok: false, reason: 'membership_inactive' };
}

class WindowExpired extends Error {}

/**
 * Provision a FREE workspace for a VERIFIED signed-in user (getAuthContext already requires a verified email).
 *
 * Concurrency (Appwrite offers no transactions or compare-and-set here):
 *  1. A membership that already exists settles the request before any data row is touched.
 *  2. A per-user lock row (deterministic id per 60 s window, create-if-absent) lets exactly one request write at a
 *     time; a concurrent request gets `in_progress` and writes nothing. Windows expire by themselves (no delete scope).
 *  3. The holder re-checks its window before every write and aborts if it has run past it, so a request cannot keep
 *     rewriting identity rows after a later window's holder may have started. Residual risk is one in-flight write at a
 *     window boundary; identity rows are unreachable until the membership exists and consent is never rewritten.
 *  4. The membership is created LAST (create-if-absent is the arbiter) and only its creator records marketing consent.
 * A retry after a partial failure repairs the chain from the CURRENT submission. A user who already belongs to a
 * different org is refused. FREE only: no entitlement row is created.
 */
export async function provisionFreeWorkspace(
  ctx: AuthContext,
  profile: SignupProfile,
  writer: RowWriter,
  now?: number,
  requestId = crypto.randomUUID(),
  clock?: () => number,
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
  const start = now ?? Date.now();
  const tick = clock ?? (now === undefined ? Date.now : () => start);
  const window = Math.floor(start / LOCK_WINDOW_MS);
  const guard = () => {
    if (Math.floor(tick() / LOCK_WINDOW_MS) !== window) throw new WindowExpired();
  };
  const at = new Date(start).toISOString();
  try {
    const prior = await writer.read('memberships', id.membership);
    if (prior) return membershipOutcome(prior, userId, id.orgId);

    // Single-writer lock for this window.
    const lock = await writer.create('audit_events', id.lock(window), {
      eventId: id.lock(window), action: 'lock.signup_provision', occurredAt: at,
      actorUserId: userId, orgId: id.orgId, targetType: 'organization', targetId: id.orgId, result: 'noop', requestId,
    });
    if (lock === 'exists') return { ok: false, reason: 'in_progress' };
    // A request that completed between the first read and the lock settles this one too.
    const settled = await writer.read('memberships', id.membership);
    if (settled) return membershipOutcome(settled, userId, id.orgId);

    const put = async (table: string, rowId: string, data: Row) => {
      guard();
      if ((await writer.create(table, rowId, data)) === 'exists') {
        guard();
        await writer.update(table, rowId, data);
      }
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
    guard();
    await writer.create('consent_records', id.terms, {
      subjectType: 'contact', subjectId: id.contact, consentType: 'account_terms', granted: true,
      recordedAt: at, policyVersion: SIGNUP_TERMS_VERSION, source: 'free_signup',
    });
    guard();
    await writer.create('audit_events', id.audit, {
      eventId: id.audit, action: 'account.free_workspace_provisioned', occurredAt: at,
      actorUserId: userId, orgId: id.orgId, targetType: 'organization', targetId: id.orgId, result: 'allow', requestId,
    });
    guard();
    const membership = await writer.create('memberships', id.membership, {
      userId, orgId: id.orgId, role: 'CLIENT_OWNER', status: 'active', grantedAt: at,
    });
    if (membership === 'exists') return membershipOutcome(await writer.read('memberships', id.membership), userId, id.orgId);
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
