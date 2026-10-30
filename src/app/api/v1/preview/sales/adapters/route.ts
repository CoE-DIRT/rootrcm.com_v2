import {
  executeSalesPipelineStep,
  parseSalesPipelineRequest,
} from '@/server/sales/execute-pipeline';
import { jsonApi, jsonError } from '@/server/http/errors';

export const runtime = 'nodejs';

/**
 * Preview-only: run the seeded sales journey against typed disabled adapters.
 * Accepts scenarioId / milestone / catalog offer only — never a business contact body.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      400,
      'invalid_preview_request',
      'Preview adapter request was not valid JSON.',
    );
  }

  const parsed = parseSalesPipelineRequest(body);
  if (!parsed.ok) {
    return jsonError(400, parsed.code, parsed.message);
  }

  const execution = await executeSalesPipelineStep(parsed.request);
  return jsonApi(200, {
    data: {
      ...execution,
      live: false as const,
    },
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
}
