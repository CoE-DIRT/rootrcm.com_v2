import { NextResponse } from 'next/server';

/**
 * ROOT V2 has no durable inquiry storage or approved CRM integration yet.
 * Do not parse, store, or acknowledge real business contacts in this state.
 * This endpoint intentionally fails closed until a separately reviewed
 * persistence, rate-limiting, consent, and idempotency implementation exists.
 *
 * A typed InquiryOutbox module exists for founder activation and must stay
 * unused by this route. Live HubSpot remains behind ROOT_ENABLE_CRM
 * (default deny) even after an outbox exists.
 */
export async function POST() {
  return NextResponse.json(
    {
      data: null,
      meta: { correlationId: crypto.randomUUID() },
      error: {
        code: 'inquiry_submission_unavailable',
        message: 'Online inquiries are not active yet. No inquiry was sent or stored.',
      },
    },
    {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
