export type SyntheticSandboxResult = {
  status: 'synthetic' | 'disabled' | 'rejected';
  live: false;
  approvedIntegration: false;
  claimedPartnership: false;
  origin: 'synthetic-sandbox';
  transaction: '270/271' | '837P' | null;
  outcome: string | null;
};

const PHI = /\b(mrn|dob|ssn|patient)\b|\d{3}-\d{2}-\d{4}/i;

/**
 * Authorized healthcare fixtures. Unknown payers stay disabled.
 * Redox, DataSpring/CAQH, and licensed AMA CPT are not implemented here.
 */
export function runSyntheticEligibility(input: { payerCode: string; memberToken: string }): SyntheticSandboxResult {
  if (PHI.test(input.memberToken)) {
    return {
      status: 'rejected',
      live: false,
      approvedIntegration: false,
      claimedPartnership: false,
      origin: 'synthetic-sandbox',
      transaction: null,
      outcome: 'phi_rejected',
    };
  }
  if (input.payerCode !== 'SYN-PAYER' || input.memberToken !== 'synthetic-member') {
    return {
      status: 'disabled',
      live: false,
      approvedIntegration: false,
      claimedPartnership: false,
      origin: 'synthetic-sandbox',
      transaction: '270/271',
      outcome: null,
    };
  }
  return {
    status: 'synthetic',
    live: false,
    approvedIntegration: false,
    claimedPartnership: false,
    origin: 'synthetic-sandbox',
    transaction: '270/271',
    outcome: 'active_coverage',
  };
}

export function runSyntheticClaimFixture(input: { payerCode: string; claimToken: string }): SyntheticSandboxResult {
  if (PHI.test(input.claimToken)) {
    return {
      status: 'rejected',
      live: false,
      approvedIntegration: false,
      claimedPartnership: false,
      origin: 'synthetic-sandbox',
      transaction: null,
      outcome: 'phi_rejected',
    };
  }
  if (input.payerCode !== 'SYN-PAYER' || input.claimToken !== 'synthetic-claim') {
    return {
      status: 'disabled',
      live: false,
      approvedIntegration: false,
      claimedPartnership: false,
      origin: 'synthetic-sandbox',
      transaction: '837P',
      outcome: null,
    };
  }
  return {
    status: 'synthetic',
    live: false,
    approvedIntegration: false,
    claimedPartnership: false,
    origin: 'synthetic-sandbox',
    transaction: '837P',
    outcome: 'accepted_synthetic',
  };
}
