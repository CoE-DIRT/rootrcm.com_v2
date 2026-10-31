export const OPS_SID_COOKIE = 'root_ops_sid';
export const OPS_CAP_COOKIE = 'root_ops_cap';
export const OPS_BODY_LIMIT = 8192;
export const OPS_ACTION_WINDOW_MS = 60_000;
export const OPS_ACTION_LIMIT = 60;
export const OPS_SESSION_TTL_MS = 2 * 60 * 60 * 1000;

export type OpsCapability = 'client' | 'operator';

export type OpsSessionContext = {
  id: string;
  capability: OpsCapability;
};

export const TEST_OPS_SESSION: OpsSessionContext = {
  id: 'test-default',
  capability: 'operator',
};

function sessionSecret(): string {
  return process.env.ROOT_DEMO_SESSION_SECRET || 'root-v2-preview-session-v1';
}

export async function signOpsCapability(sid: string, capability: OpsCapability): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${sid}.${capability}`),
  );
  return [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyOpsCapability(
  sid: string,
  raw: string | undefined,
): Promise<OpsCapability> {
  if (!raw) return 'client';
  const [capability, signature] = raw.split('.');
  if (capability !== 'client' && capability !== 'operator') return 'client';
  if (!signature) return 'client';
  const expected = await signOpsCapability(sid, capability);
  if (expected.length !== signature.length) return 'client';
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0 ? capability : 'client';
}

/** App Router link prefetch. Must not rebind preview cookies. */
export function isPreviewPrefetch(headers: Pick<Headers, 'get'>): boolean {
  const purpose = `${headers.get('purpose') ?? ''} ${headers.get('sec-purpose') ?? ''}`.toLowerCase();
  if (purpose.includes('prefetch')) return true;
  if (headers.get('next-router-prefetch')) return true;
  if (headers.get('next-router-segment-prefetch')) return true;
  return false;
}

export function capabilityFromPath(pathname: string): OpsCapability | null {
  const path = pathname.replace(/^\/(en|es)(?=\/)/, '');
  if (path.startsWith('/preview/staff')) return 'operator';
  if (
    path.startsWith('/preview/client') ||
    path.startsWith('/preview/credentialing') ||
    path.startsWith('/preview/sales')
  ) {
    return 'client';
  }
  return null;
}

export async function readOpsSessionFromRequest(request: Request): Promise<OpsSessionContext> {
  const cookie = request.headers.get('cookie') ?? '';
  const parts = Object.fromEntries(
    cookie
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const idx = entry.indexOf('=');
        return [entry.slice(0, idx), decodeURIComponent(entry.slice(idx + 1))];
      }),
  );
  const sid = parts[OPS_SID_COOKIE] || crypto.randomUUID();
  const capability = await verifyOpsCapability(sid, parts[OPS_CAP_COOKIE]);
  return { id: sid, capability };
}

export function assertJsonBudget(request: Request): { ok: true } | { ok: false; status: 413 } {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(length) && length > OPS_BODY_LIMIT) return { ok: false, status: 413 };
  return { ok: true };
}
