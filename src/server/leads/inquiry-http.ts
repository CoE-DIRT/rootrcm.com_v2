import { captureLead } from './capture.ts';
import { leadAllowedOrigin, leadStoreConfig } from './lead-config.ts';
import { AppwriteLeadStore, type LeadStore } from './lead-store.ts';

const MAX_BODY_BYTES = 8192;

function json(status: number, body: unknown, correlationId: string, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify({ meta: { correlationId }, ...(body as object) }), {
    status,
    headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', ...extra },
  });
}

const err = (code: string) => ({ data: null, error: { code } });

/**
 * POST handler used only when lead capture is enabled. Same-origin JSON only,
 * bounded body, no CRM call, success only after the durable write.
 */
export async function handlePublicInquiry(request: Request, store?: LeadStore): Promise<Response> {
  const correlationId = crypto.randomUUID();
  const allowed = leadAllowedOrigin();
  if (!allowed || request.headers.get('origin') !== allowed) return json(403, err('forbidden_origin'), correlationId);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, err('unsupported_media_type'), correlationId);
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return json(413, err('payload_too_large'), correlationId);

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, err('payload_too_large'), correlationId);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, err('invalid_json'), correlationId);
  }

  const config = leadStoreConfig();
  const target = store ?? (config ? new AppwriteLeadStore(config) : null);
  if (!target) return json(503, err('inquiry_submission_unavailable'), correlationId);

  const locale = (body as { locale?: unknown } | null)?.locale === 'es' ? 'es' : 'en';
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim().slice(0, 64);
  const result = await captureLead(body, target, { ip, locale, correlationId, salt: process.env.ROOT_LEAD_HASH_SALT });

  if (result.ok) return json(202, { data: { status: 'accepted_persisted' }, error: null }, correlationId);
  if (result.reason === 'validation') return json(422, { data: null, error: { code: 'validation_failed', fieldErrors: result.fieldErrors } }, correlationId);
  if (result.reason === 'rate_limited') return json(429, err('rate_limited'), correlationId, { 'Retry-After': '600' });
  return json(503, err('inquiry_submission_unavailable'), correlationId);
}
