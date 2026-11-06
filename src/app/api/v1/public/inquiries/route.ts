import { publicInquiryUnavailableResponse } from '@/server/leads/inquiry';
import { leadCaptureEnabled } from '@/server/leads/lead-config';
import { handlePublicInquiry } from '@/server/leads/inquiry-http';

/**
 * Fails closed (503, body never read) unless durable lead capture is explicitly
 * enabled (ROOT_ENABLE_LEAD_CAPTURE=true plus a dedicated least-privilege Appwrite
 * key). When enabled, success is returned only after the lead row, consent proof
 * and outbox jobs are written. CRM delivery is a separate worker behind ROOT_ENABLE_CRM.
 */
export async function POST(request: Request) {
  if (!leadCaptureEnabled()) return publicInquiryUnavailableResponse();
  return handlePublicInquiry(request);
}
