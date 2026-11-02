import { isOpsActionType, type OpsActionRequest } from '@/domain/operations/types';
import { jsonApi, jsonError, policyDenied } from '@/server/http/errors';
import { applyOpsCookies } from '@/server/operations/session-http';
import {
  OPS_BODY_LIMIT,
  assertJsonBudget,
  readOpsSessionFromRequest,
} from '@/server/operations/session';
import { applyOpsAction } from '@/server/operations/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACTION_KEYS = new Set(['type', 'orgId', 'persona', 'applicationId', 'claimId']);

/**
 * Whitelist-only body parse. Unknown keys (including any PHI-shaped fields)
 * are not read. Live HubSpot/Stripe/Appwrite are not called.
 * `persona` is a view selector; operator capability is cookie-signed.
 */
function parseAction(body: unknown):
  | { ok: true; request: OpsActionRequest }
  | { ok: false; code: 'invalid_request' | 'unknown_action' } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, code: 'invalid_request' };
  }
  const record = body as Record<string, unknown>;
  const picked: Record<string, unknown> = {};
  for (const key of ACTION_KEYS) {
    if (key in record) picked[key] = record[key];
  }

  if (!isOpsActionType(picked.type)) return { ok: false, code: 'unknown_action' };
  if (typeof picked.orgId !== 'string' || picked.orgId.length === 0) {
    return { ok: false, code: 'invalid_request' };
  }
  if (typeof picked.persona !== 'string' || picked.persona.length === 0) {
    return { ok: false, code: 'invalid_request' };
  }

  const applicationId =
    typeof picked.applicationId === 'string' ? picked.applicationId : undefined;
  const claimId = typeof picked.claimId === 'string' ? picked.claimId : undefined;

  return {
    ok: true,
    request: {
      type: picked.type,
      orgId: picked.orgId,
      persona: picked.persona,
      applicationId,
      claimId,
    },
  };
}

export async function POST(request: Request) {
  const budget = assertJsonBudget(request);
  if (!budget.ok) {
    return jsonError(413, 'payload_too_large', 'Operations action payload exceeds the demo size limit.');
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return jsonError(422, 'invalid_request', 'JSON body is required.');
  }
  if (raw.length > OPS_BODY_LIMIT) {
    return jsonError(413, 'payload_too_large', 'Operations action payload exceeds the demo size limit.');
  }

  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return jsonError(422, 'invalid_request', 'JSON body is required.');
  }

  const parsed = parseAction(body);
  if (!parsed.ok) {
    const status = 422;
    if (parsed.code === 'unknown_action') {
      return jsonError(status, 'unknown_action', 'Unknown operations action.');
    }
    return jsonError(status, 'invalid_request', 'Action type, orgId and persona are required.');
  }

  const session = await readOpsSessionFromRequest(request);
  const result = applyOpsAction(parsed.request, session);
  if (!result.ok) {
    if (result.kind === 'denied') return policyDenied(result.decision);
    if (result.kind === 'rate_limited') {
      return jsonError(429, 'rate_limited', 'Too many operations actions for this demo session.');
    }
    if (result.kind === 'persistence_unavailable') {
      return jsonError(
        503,
        'persistence_unavailable',
        'Demo session persistence is not available. No live store was written.',
      );
    }
    if (result.kind === 'unknown_action') {
      return jsonError(422, 'unknown_action', 'Unknown operations action.');
    }
    if (result.kind === 'unknown_resource') {
      return jsonError(422, 'unknown_resource', 'The referenced record was not found.');
    }
    return jsonError(422, 'invalid_request', 'The action payload is incomplete.');
  }

  const response = jsonApi(200, {
    data: result.view,
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
  return applyOpsCookies(response, session.id, session.capability);
}
