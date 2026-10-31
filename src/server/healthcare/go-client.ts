/**
 * Loopback-only client for the local Go healthcare simulator.
 * Browser code must not import this module or receive the Go URL.
 */
import { HEALTHCARE_IDENTITY_CATALOG, type HealthcareError } from '../../domain/healthcare/types.ts';
import { isHealthcareOrgId } from '../../domain/healthcare/identities.ts';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const DEFAULT_TIMEOUT_MS = 2800;

const GO_PATHS = {
  healthz: '/healthz',
  capabilities: '/v1/capabilities',
  eligibility: '/v1/eligibility',
  claims: '/v1/claims/status',
  credentialing: '/v1/credentialing',
} as const;

export type GoFetch = (input: URL, init?: RequestInit) => Promise<Response>;

export type GoClientOptions = {
  baseUrl?: string;
  fetchImpl?: GoFetch;
  timeoutMs?: number;
};

export type GoProbeResult =
  | { ok: true; mode: 'synthetic' }
  | { ok: false; mode: 'unavailable'; error: HealthcareError };

type ResolvedGoBase =
  | { ok: true; url: URL }
  | { ok: false; mode: 'unavailable'; error: HealthcareError };

function envBaseUrl(): string | undefined {
  const value = process.env.ROOT_GO_HEALTHCARE_PREVIEW_URL;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

export function resolveGoBaseUrl(raw = envBaseUrl()): ResolvedGoBase {
  if (!raw) {
    return {
      ok: false,
      mode: 'unavailable',
      error: {
        code: 'go_preview_not_connected',
        message: 'Local Go healthcare simulator is not configured.',
      },
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return {
      ok: false,
      mode: 'unavailable',
      error: { code: 'invalid_local_go_url', message: 'Go healthcare URL is not a valid URL.' },
    };
  }
  if (parsed.protocol !== 'http:') {
    return {
      ok: false,
      mode: 'unavailable',
      error: { code: 'invalid_local_go_url', message: 'Go healthcare URL must be loopback HTTP.' },
    };
  }
  if (parsed.username || parsed.password) {
    return {
      ok: false,
      mode: 'unavailable',
      error: {
        code: 'invalid_local_go_url',
        message: 'Go healthcare URL must not include credentials.',
      },
    };
  }
  if (!LOOPBACK_HOSTS.has(parsed.hostname)) {
    return {
      ok: false,
      mode: 'unavailable',
      error: { code: 'invalid_local_go_url', message: 'Go healthcare URL must bind to loopback.' },
    };
  }
  return { ok: true, url: parsed };
}

function goRequestInit(timeoutMs: number): RequestInit {
  return {
    method: 'GET',
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'error',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: 'application/json' },
  };
}

export async function probeGoHealthcare(options: GoClientOptions = {}): Promise<GoProbeResult> {
  const resolved = resolveGoBaseUrl(options.baseUrl ?? envBaseUrl());
  if (!resolved.ok) return resolved;
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  try {
    const url = new URL('/v1/capabilities', resolved.url);
    const response = await fetchImpl(url, goRequestInit(timeoutMs));
    if (!response.ok) {
      return {
        ok: false,
        mode: 'unavailable',
        error: { code: 'go_preview_response_error', message: 'Go healthcare simulator returned an error.' },
      };
    }
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || (payload as { source?: unknown }).source !== 'synthetic') {
      return {
        ok: false,
        mode: 'unavailable',
        error: {
          code: 'unsupported_upstream_source',
          message: 'Go healthcare simulator did not prove synthetic provenance.',
        },
      };
    }
    return { ok: true, mode: 'synthetic' };
  } catch {
    return {
      ok: false,
      mode: 'unavailable',
      error: { code: 'go_preview_unreachable', message: 'Go healthcare simulator is unreachable.' },
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export type GoPreviewKind = keyof typeof GO_PATHS;

export type GoPreviewResponse = {
  httpStatus: number;
  payload: Record<string, unknown>;
};

function previewUnavailable(error: HealthcareError, orgId?: string): GoPreviewResponse {
  return {
    httpStatus: 503,
    payload: {
      mode: 'unavailable',
      source: 'synthetic',
      verifiedAt: null,
      identityCatalog: HEALTHCARE_IDENTITY_CATALOG,
      ledger: 'operations',
      orgId: isHealthcareOrgId(orgId) ? orgId : undefined,
      error: error.code,
      message: error.message,
    },
  };
}

/**
 * Direct Go preview for the public technology panel. Does not read the ops ledger.
 * Identity-aligned static rows only; mutations live in Next operations.
 */
export async function fetchGoHealthcarePreview(
  kind: string,
  orgId: string,
  options: GoClientOptions = {},
): Promise<GoPreviewResponse> {
  if (!Object.prototype.hasOwnProperty.call(GO_PATHS, kind)) {
    return {
      httpStatus: 422,
      payload: { error: 'unknown_capability', mode: 'unavailable', source: 'synthetic' },
    };
  }
  const previewKind = kind as GoPreviewKind;
  if (previewKind !== 'healthz' && previewKind !== 'capabilities' && !isHealthcareOrgId(orgId)) {
    return {
      httpStatus: 422,
      payload: { error: 'unknown_synthetic_organization', mode: 'unavailable', source: 'synthetic' },
    };
  }

  const resolved = resolveGoBaseUrl(options.baseUrl ?? envBaseUrl());
  if (!resolved.ok) return previewUnavailable(resolved.error, orgId);

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  try {
    const url = new URL(GO_PATHS[previewKind], resolved.url);
    if (previewKind !== 'healthz' && previewKind !== 'capabilities') {
      url.searchParams.set('orgId', orgId);
    }
    const response = await fetchImpl(url, goRequestInit(timeoutMs));
    if (!response.ok) {
      return previewUnavailable(
        { code: 'go_preview_response_error', message: 'Go healthcare simulator returned an error.' },
        orgId,
      );
    }
    const payload: unknown = await response.json();
    const record = asRecord(payload);
    if (!record) {
      return previewUnavailable(
        { code: 'go_preview_response_error', message: 'Go healthcare simulator returned invalid JSON.' },
        orgId,
      );
    }
    if (previewKind !== 'healthz' && record.source !== 'synthetic') {
      return previewUnavailable(
        {
          code: 'unsupported_upstream_source',
          message: 'Go healthcare simulator did not prove synthetic provenance.',
        },
        orgId,
      );
    }
    return {
      httpStatus: 200,
      payload: {
        ...record,
        mode: 'synthetic',
        source: 'synthetic',
        identityCatalog: HEALTHCARE_IDENTITY_CATALOG,
        ledger: 'operations',
      },
    };
  } catch {
    return previewUnavailable(
      { code: 'go_preview_unreachable', message: 'Go healthcare simulator is unreachable.' },
      orgId,
    );
  }
}
