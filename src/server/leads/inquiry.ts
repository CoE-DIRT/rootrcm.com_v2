import { NextResponse } from 'next/server';
import { isDurableInquiryDeliveryEnabled } from '../../domain/lead-handling.ts';

/**
 * Public inquiry remains fail-closed. Do not parse the request body, persist
 * contacts, or import the memory outbox from the HTTP route.
 */
export function publicInquiryUnavailableResponse() {
  void isDurableInquiryDeliveryEnabled();
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
