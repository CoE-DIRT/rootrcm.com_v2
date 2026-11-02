import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  OPS_CAP_COOKIE,
  OPS_SID_COOKIE,
  capabilityFromPath,
  signOpsCapability,
  type OpsCapability,
} from './session.ts';

function cookieBase() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 4,
    secure: process.env.NODE_ENV === 'production',
  };
}

export async function applyOpsCookies(
  response: NextResponse,
  sid: string,
  capability: OpsCapability,
): Promise<NextResponse> {
  const signature = await signOpsCapability(sid, capability);
  response.cookies.set(OPS_SID_COOKIE, sid, cookieBase());
  response.cookies.set(OPS_CAP_COOKIE, `${capability}.${signature}`, cookieBase());
  return response;
}

export async function bindPreviewCookies(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const capability = capabilityFromPath(request.nextUrl.pathname);
  if (!capability) return response;
  const sid = request.cookies.get(OPS_SID_COOKIE)?.value || crypto.randomUUID();
  return applyOpsCookies(response, sid, capability);
}
