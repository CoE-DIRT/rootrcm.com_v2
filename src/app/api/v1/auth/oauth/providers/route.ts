import { NextResponse } from 'next/server';
import { enabledOAuthProviders } from '@/server/auth/oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Names only (no secrets). Empty until live auth and a provider are explicitly enabled, so no dead buttons render. */
export function GET() {
  return NextResponse.json({ providers: enabledOAuthProviders() }, { headers: { 'Cache-Control': 'no-store' } });
}
