/**
 * Shared synthetic identities. The operations seed is the only catalog.
 * Go duplicates these IDs as a static preview; it is not a second ledger.
 */
import { createSeedSnapshot } from '../operations/seed.ts';
import { clientOpsOrgIds, type ClientOpsOrgId } from '../operations/types.ts';
import { HEALTHCARE_IDENTITY_CATALOG } from './types.ts';

export { HEALTHCARE_IDENTITY_CATALOG } from './types.ts';

export const healthcareOrgIds = clientOpsOrgIds;

export function isHealthcareOrgId(value: unknown): value is ClientOpsOrgId {
  return typeof value === 'string' && (clientOpsOrgIds as readonly string[]).includes(value);
}

export function healthcareIdentitiesFromSeed(orgId?: ClientOpsOrgId) {
  const seed = createSeedSnapshot();
  const matchesOrg = (value: string) => isHealthcareOrgId(value) && (!orgId || value === orgId);

  return {
    catalog: HEALTHCARE_IDENTITY_CATALOG,
    organizations: seed.organizations.map((row) => row.id).filter(matchesOrg),
    eligibilityIds: seed.eligibility.filter((row) => matchesOrg(row.orgId)).map((row) => row.id),
    claimIds: seed.claims.filter((row) => matchesOrg(row.orgId)).map((row) => row.id),
    credentialingIds: seed.credentialingApplications
      .filter((row) => matchesOrg(row.orgId))
      .map((row) => row.id),
  };
}
