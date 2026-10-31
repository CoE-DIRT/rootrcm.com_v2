import { NextResponse } from 'next/server';
import { applyOpsCookies } from '@/server/operations/session-http';
import {
  capabilityFromPath,
  isPreviewPrefetch,
  readOpsSessionFromRequest,
  shouldReplacePreviewCapability,
} from '@/server/operations/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'cache-control': 'no-store' };

/**
 * Binds a preview capability after a real navigation.
 * Prefetch requests are ignored. An operator cookie is not replaced by a client entry.
 * This cookie is not an Appwrite session and cannot mint a production principal.
 */
export async function POST(request: Request) {
  if (isPreviewPrefetch(request.headers)) {
    return NextResponse.json({ data: { bound: false, reason: 'prefetch' } }, { headers: noStore });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const path =
    body && typeof body === 'object' && !Array.isArray(body) && typeof (body as { path?: unknown }).path === 'string'
      ? (body as { path: string }).path
      : '';
  const capability = capabilityFromPath(path);
  if (!capability) {
    return NextResponse.json({ data: { bound: false, reason: 'unscoped' } }, { headers: noStore });
  }

  const session = await readOpsSessionFromRequest(request);
  if (!shouldReplacePreviewCapability(session.capability, capability)) {
    return NextResponse.json(
      { data: { bound: false, reason: 'operator_retained' } },
      { headers: noStore },
    );
  }

  const response = NextResponse.json({ data: { bound: true } }, { headers: noStore });
  return applyOpsCookies(response, session.id, capability);
}
