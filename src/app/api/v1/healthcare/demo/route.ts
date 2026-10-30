import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const paths = {
  capabilities: '/v1/capabilities',
  eligibility: '/v1/eligibility',
  claims: '/v1/claims/status',
  credentialing: '/v1/credentialing',
} as const;
type Kind = keyof typeof paths;

const allowedOrgs = new Set(['bayview', 'cedar-grove', 'metro-asc']);

function reply(data: unknown, status: number) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Demo-Data': 'synthetic' },
  });
}

/** Read-only, loopback-only bridge to the local Go transaction simulator.
 * Not a production payer/EHR proxy and not a place to accept PHI.
 */
export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get('kind') ?? 'capabilities';
  const org = request.nextUrl.searchParams.get('orgId') ?? 'bayview';
  if (!Object.prototype.hasOwnProperty.call(paths, kind)) {
    return reply({ error: 'unknown_capability' }, 422);
  }
  if (kind !== 'capabilities' && !allowedOrgs.has(org)) {
    return reply({ error: 'unknown_synthetic_organization' }, 422);
  }
  const base = process.env.ROOT_GO_HEALTHCARE_PREVIEW_URL;
  if (!base) {
    return reply({ mode: 'unavailable', source: 'synthetic', error: 'go_preview_not_connected' }, 503);
  }
  try {
    const service = new URL(base);
    if (service.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(service.hostname)) {
      return reply({ mode: 'unavailable', error: 'invalid_local_go_url' }, 503);
    }
    const upstreamUrl = new URL(paths[kind as Kind], service);
    if (kind !== 'capabilities') upstreamUrl.searchParams.set('orgId', org);
    const upstream = await fetch(upstreamUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(2800),
      headers: { Accept: 'application/json' },
    });
    if (!upstream.ok) return reply({ mode: 'unavailable', error: 'go_preview_response_error' }, 503);
    const payload: unknown = await upstream.json();
    if (!payload || typeof payload !== 'object' || (payload as { source?: unknown }).source !== 'synthetic') {
      return reply({ mode: 'unavailable', error: 'unsupported_upstream_source' }, 503);
    }
    return reply(payload, 200);
  } catch {
    return reply({ mode: 'unavailable', source: 'synthetic', error: 'go_preview_unreachable' }, 503);
  }
}
