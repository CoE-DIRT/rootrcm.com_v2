import { getAuthContext, sessionSecret } from '../auth/session.ts';
import { authRequest } from '../auth/transport.ts';
import { AppwriteRowWriter, provisionConfig, signupProvisioningEnabled, type RowWriter } from './row-store.ts';
import { provisionFreeWorkspace } from './provision.ts';
import { validateSignupProfile } from './profile.ts';

const MAX_BODY = 4096;
const hits = new Map<string, number[]>();
export function resetSignupRateLimit() { hits.clear(); }
/** Per-process backstop (5 per 10 min per user); Appwrite and the edge provide the shared limit. */
function allow(userId: string, now: number): boolean {
  if (hits.size > 10000) hits.clear();
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < 600_000);
  if (recent.length >= 5) return false;
  recent.push(now);
  hits.set(userId, recent);
  return true;
}

/** Incremental read that cancels the stream as soon as the byte limit is exceeded. */
async function readBounded(request: Request, limit: number): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function json(status: number, data: unknown, code?: string, extra?: Record<string, unknown>) {
  return new Response(JSON.stringify({ data: code ? null : data, meta: { correlationId: crypto.randomUUID() }, error: code ? { code, ...extra } : null }), {
    status, headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  });
}

/**
 * POST /api/v1/account/workspace — create the caller's FREE workspace after email verification.
 * Identity comes only from the verified Appwrite session; no body field selects a user, org or role.
 */
export async function handleWorkspaceProvision(request: Request, writer?: RowWriter): Promise<Response> {
  if (!signupProvisioningEnabled()) return json(503, null, 'signup_unavailable');
  const origin = process.env.ROOT_AUTH_ORIGIN;
  if (!origin || request.headers.get('origin') !== origin) return json(403, null, 'forbidden_origin');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, null, 'unsupported_media_type');
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return json(413, null, 'payload_too_large');
  const read = await readBounded(request, MAX_BODY);
  if (read === null) return json(413, null, 'payload_too_large');
  let body: unknown;
  try { body = JSON.parse(read); } catch { return json(400, null, 'invalid_json'); }

  const cookie = request.headers.get('cookie');
  const ctx = await getAuthContext(cookie);
  // Unverified (pending) accounts have no session context: they must complete email verification first.
  if (!ctx.session) return json(401, null, 'unauthenticated_or_unverified');
  // Membership lookup failure is not 'no memberships': refuse without writing.
  if (ctx.membershipsUnavailable) return json(503, null, 'signup_unavailable');
  const profile = validateSignupProfile(body);
  if (!profile.ok) return json(422, null, 'validation_failed', { fieldErrors: profile.errors });
  if (!allow(ctx.session.userId, Date.now())) return json(429, null, 'rate_limited');

  const config = provisionConfig();
  const target = writer ?? (config ? new AppwriteRowWriter(config) : null);
  if (!target) return json(503, null, 'signup_unavailable');
  const result = await provisionFreeWorkspace(ctx, profile.data, target);
  if (!result.ok) {
    if (result.reason === 'existing_membership') return json(409, null, 'existing_membership');
    if (result.reason === 'membership_inactive') return json(403, null, 'membership_inactive');
    if (result.reason === 'unauthenticated') return json(401, null, 'unauthenticated_or_unverified');
    return json(503, null, 'signup_unavailable');
  }

  // Best-effort profile on the Appwrite account itself (not a gate for success).
  const secret = sessionSecret(cookie);
  if (secret && result.created) {
    try {
      await authRequest('/account/name', 'PATCH', { name: `${profile.data.firstName} ${profile.data.lastName}` }, secret);
      await authRequest('/account/prefs', 'PATCH', { prefs: { specialty: profile.data.specialty ?? '', practiceSize: profile.data.practiceSize ?? '', locale: profile.data.locale } }, secret);
    } catch { /* retryable later; workspace already exists */ }
  }
  return json(result.created ? 201 : 200, { orgId: result.orgId, plan: 'free', features: ['basic_workspace', 'consultation'], created: result.created, ...(result.created ? { marketingRecorded: result.marketingRecorded !== false } : {}) });
}
