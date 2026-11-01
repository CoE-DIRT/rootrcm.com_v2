import { appwriteAdapter, type DisabledAdapterResult } from '../../integrations/disabled.ts';
import { enrichApolloOrganization } from '../../integrations/apollo/client.ts';
import {
  createHubSpotIdempotencyKey,
  upsertHubSpotCompany,
  upsertHubSpotContact,
  upsertHubSpotDeal,
} from '../../integrations/hubspot/client.ts';
import {
  createCheckoutSession,
  createSubscriptionCheckout,
} from '../../integrations/stripe/client.ts';
import { isCatalogOfferId } from '../../domain/catalog-entitlement.ts';
import { isSalesMilestone, salesAdapterIntents, type SalesAdapterIntent } from '../../domain/sales-pipeline.ts';
import { salesScenarios, type SalesMilestone, type SalesScenario } from '../../domain/sales-simulator.ts';
import type { OfferId } from '../../content/catalog.ts';

export type SalesPipelineRequest = {
  scenarioId: SalesScenario['id'];
  milestone: SalesMilestone;
  offer: OfferId;
};

export type SalesPipelineExecution = {
  intents: readonly SalesAdapterIntent[];
  results: readonly DisabledAdapterResult[];
  simulated: true;
};

export type SalesPipelineParse =
  | { ok: true; request: SalesPipelineRequest }
  | { ok: false; code: 'invalid_preview_request'; message: string };

const SCENARIO_IDS: readonly SalesScenario['id'][] = salesScenarios.map((item) => item.id);

function isScenarioId(value: unknown): value is SalesScenario['id'] {
  return typeof value === 'string' && (SCENARIO_IDS as readonly string[]).includes(value);
}

function syntheticEmail(scenarioId: SalesScenario['id']): string {
  return `preview+${scenarioId}@example.invalid`;
}

export function parseSalesPipelineRequest(value: unknown): SalesPipelineParse {
  if (!value || typeof value !== 'object') {
    return {
      ok: false,
      code: 'invalid_preview_request',
      message: 'Preview adapter request must be a JSON object.',
    };
  }
  const record = value as Record<string, unknown>;
  if (!isScenarioId(record.scenarioId) || typeof record.milestone !== 'string' || !isSalesMilestone(record.milestone)) {
    return {
      ok: false,
      code: 'invalid_preview_request',
      message: 'Preview adapter request requires a seeded scenario and milestone.',
    };
  }
  if (typeof record.offer !== 'string' || !isCatalogOfferId(record.offer)) {
    return {
      ok: false,
      code: 'invalid_preview_request',
      message: 'Preview adapter request requires a catalog offer id.',
    };
  }
  return {
    ok: true,
    request: {
      scenarioId: record.scenarioId,
      milestone: record.milestone,
      offer: record.offer,
    },
  };
}

async function runIntent(
  item: SalesAdapterIntent,
  request: SalesPipelineRequest,
  organization: string,
): Promise<DisabledAdapterResult> {
  const occurredAt = '2026-10-30T00:00:00Z';
  const correlationId = `preview-${request.scenarioId}-${request.milestone}`;
  const email = syntheticEmail(request.scenarioId);

  if (item.integration === 'hubspot' && item.operation === 'upsert_contact') {
    return upsertHubSpotContact({
      email,
      companyName: organization,
      consentAt: occurredAt,
      consentVersion: 'business-inquiry.v1',
      idempotencyKey: createHubSpotIdempotencyKey({
        email,
        event: `preview.${request.milestone}`,
        occurredAt,
      }),
      correlationId,
      source: 'consultation',
    });
  }
  if (item.integration === 'hubspot' && item.operation === 'upsert_company') {
    return upsertHubSpotCompany({
      companyName: organization,
      idempotencyKey: createHubSpotIdempotencyKey({
        email,
        event: 'preview.company',
        occurredAt,
      }),
      correlationId,
    });
  }
  if (item.integration === 'hubspot' && item.operation === 'upsert_deal') {
    return upsertHubSpotDeal({
      companyName: organization,
      offerId: request.offer,
      stage: request.milestone === 'contract' ? 'contract' : 'proposal',
      idempotencyKey: createHubSpotIdempotencyKey({
        email,
        event: `preview.deal.${request.milestone}`,
        occurredAt,
      }),
      correlationId,
    });
  }
  if (item.integration === 'apollo') {
    return enrichApolloOrganization({
      organizationName: organization,
      correlationId,
    });
  }
  if (item.integration === 'stripe' && item.operation === 'create_checkout') {
    return createCheckoutSession({
      orgId: request.scenarioId,
      offerId: request.offer,
      mode: 'payment',
      successUrl: 'https://example.invalid/success',
      cancelUrl: 'https://example.invalid/cancel',
      idempotencyKey: `preview-${request.scenarioId}-checkout`,
      correlationId,
    });
  }
  if (item.integration === 'stripe' && item.operation === 'create_subscription') {
    return createSubscriptionCheckout({
      orgId: request.scenarioId,
      offerId: request.offer,
      mode: 'subscription',
      successUrl: 'https://example.invalid/success',
      cancelUrl: 'https://example.invalid/cancel',
      idempotencyKey: `preview-${request.scenarioId}-subscription`,
      correlationId,
    });
  }
  return appwriteAdapter();
}

/** Executes seeded-journey intents against typed disabled adapters. No live writes. */
export async function executeSalesPipelineStep(
  request: SalesPipelineRequest,
): Promise<SalesPipelineExecution> {
  const scenario = salesScenarios.find((item) => item.id === request.scenarioId);
  if (!scenario) {
    return { intents: [], results: [], simulated: true };
  }
  const intents = salesAdapterIntents(request.milestone, request.offer);
  const results: DisabledAdapterResult[] = [];
  for (const item of intents) {
    results.push(await runIntent(item, request, scenario.organization));
  }
  return { intents, results, simulated: true };
}
