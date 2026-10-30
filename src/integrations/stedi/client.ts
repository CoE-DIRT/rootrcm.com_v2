import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';

export const stediTransactionFamilies = [
  '270/271',
  '276/277',
  '837P',
  '277CA',
  '835',
] as const;

export type StediTransactionFamily = (typeof stediTransactionFamilies)[number];

export type StediConnectionRequest = {
  orgId: string;
  /** Opaque operational payer code; never a partnership claim. */
  payerCode: string;
  transaction: StediTransactionFamily;
};

export type StediConnection = {
  orgId: string | null;
  payerCode: string | null;
  transaction: StediTransactionFamily | null;
  status: 'disabled';
  live: false;
  role: 'planned_primary';
  sandboxAuthorized: false;
  claimedPartnership: false;
};

export function connectStedi(input: StediConnectionRequest): DisabledAdapterResult {
  void input;
  return disabledAdapter('stedi');
}

export function describeStediConnection(input?: StediConnectionRequest): StediConnection {
  return {
    orgId: input?.orgId ?? null,
    payerCode: input?.payerCode ?? null,
    transaction: input?.transaction ?? null,
    status: 'disabled',
    live: false,
    role: 'planned_primary',
    sandboxAuthorized: false,
    claimedPartnership: false,
  };
}

export function createStediClient() {
  return {
    connect: connectStedi,
    describe: describeStediConnection,
  };
}
