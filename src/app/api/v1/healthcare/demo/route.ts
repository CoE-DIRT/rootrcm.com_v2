import { NextRequest, NextResponse } from 'next/server';
import { fetchGoHealthcarePreview } from '@/server/healthcare/go-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function reply(data: unknown, status: number) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Demo-Data': 'synthetic' },
  });
}

/** Read-only, loopback-only bridge to the local Go transaction simulator.
 * Not a production payer/EHR proxy and not a place to accept PHI.
 * Browser clients never receive the Go URL or any vendor secret.
 */
export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get('kind') ?? 'capabilities';
  const org = request.nextUrl.searchParams.get('orgId') ?? 'bayview';
  const result = await fetchGoHealthcarePreview(kind, org);
  return reply(result.payload, result.httpStatus);
}
