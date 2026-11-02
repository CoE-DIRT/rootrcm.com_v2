/**
 * A implementation complete
 * B local/contract tests exist
 * C external sandbox acceptance
 * D live production activation
 * C and D stay false until a credentialed environment is actually exercised.
 */
export type IntegrationAcceptance = {
  implementation: boolean;
  localContract: boolean;
  sandbox: false;
  live: false;
};

export function integrationAcceptance(): Record<string, IntegrationAcceptance> {
  const closed = { sandbox: false as const, live: false as const };
  return {
    appwrite: { implementation: true, localContract: true, ...closed },
    inquiries: { implementation: true, localContract: true, ...closed },
    hubspot: { implementation: true, localContract: true, ...closed },
    stripe: { implementation: true, localContract: true, ...closed },
    healthcareSynthetic: { implementation: true, localContract: true, ...closed },
    stedi: { implementation: true, localContract: true, ...closed },
    apollo: { implementation: true, localContract: true, ...closed },
  };
}
