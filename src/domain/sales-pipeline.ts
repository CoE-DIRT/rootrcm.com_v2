import { priceCatalog, type OfferId } from '../content/catalog.ts';
import { salesMilestones, type SalesMilestone } from './sales-simulator.ts';

export type SalesAdapterName = 'hubspot' | 'apollo' | 'stripe' | 'appwrite';

export type SalesAdapterIntent = {
  integration: SalesAdapterName;
  operation: string;
  live: false;
};

function intent(integration: SalesAdapterName, operation: string): SalesAdapterIntent {
  return { integration, operation, live: false };
}

function stripeIntentForOffer(offer: OfferId): SalesAdapterIntent | null {
  if (offer === 'free-account-consultation') return null;
  if (offer === 'revenue-diagnostic') return intent('stripe', 'create_checkout');
  return intent('stripe', 'create_subscription');
}

/**
 * Typed handoff for each commercial stage. Execution always hits disabled
 * adapters — this list never implies a live CRM write, enrichment spend, or charge.
 */
export function salesAdapterIntents(
  milestone: SalesMilestone,
  offer: OfferId,
): readonly SalesAdapterIntent[] {
  switch (milestone) {
    case 'visitor':
      return [];
    case 'inquiry':
      return [intent('hubspot', 'upsert_contact')];
    case 'qualified':
      return [intent('hubspot', 'upsert_company'), intent('apollo', 'enrich_organization')];
    case 'consultation':
      return [intent('hubspot', 'upsert_contact')];
    case 'proposal':
      return [intent('hubspot', 'upsert_deal')];
    case 'contract': {
      const stripe = stripeIntentForOffer(offer);
      return stripe
        ? [intent('hubspot', 'upsert_deal'), stripe]
        : [intent('hubspot', 'upsert_deal')];
    }
    case 'organization':
      return [intent('appwrite', 'provision_workspace')];
    case 'onboarding':
      return [intent('appwrite', 'record_onboarding')];
    case 'active':
      return [intent('appwrite', 'entitle_workspace')];
  }
}

export function commercialNextPath(milestone: SalesMilestone, offer: OfferId): string {
  switch (milestone) {
    case 'visitor':
      return '/plans';
    case 'inquiry':
    case 'qualified':
    case 'consultation':
      return '/consultation';
    case 'proposal':
      return priceCatalog.find((item) => item.id === offer)?.href ?? '/plans';
    case 'contract':
      return '/preview/billing';
    case 'organization':
    case 'onboarding':
      return '/preview/onboarding';
    case 'active':
      return '/preview/client';
  }
}

export function isSalesMilestone(value: string): value is SalesMilestone {
  return (salesMilestones as readonly string[]).includes(value);
}
