import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';
import type { ApolloEnrichmentRequest } from './types.ts';

export async function enrichApolloPerson(input: ApolloEnrichmentRequest): Promise<DisabledAdapterResult> {
  void input;
  return disabledAdapter('apollo');
}

export async function enrichApolloOrganization(
  input: ApolloEnrichmentRequest,
): Promise<DisabledAdapterResult> {
  void input;
  return disabledAdapter('apollo');
}

export function createApolloClient() {
  return {
    enrichPerson: enrichApolloPerson,
    enrichOrganization: enrichApolloOrganization,
  };
}
