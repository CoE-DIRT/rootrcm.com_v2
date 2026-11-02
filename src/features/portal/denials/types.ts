import type { CopyPair } from '@/content/ecosystem';

export type DenialQueueTab = 'all' | 'appeal' | 'resolved' | 'high';

export type DenialFormType = 'CMS-1500' | 'UB-04';

export type DenialQueueState = 'active' | 'appeal' | 'resolved';

export type PortalDenialRow = {
  id: string;
  claimId: string;
  patientRef: string;
  payer: string;
  queueState: DenialQueueState;
  formType: DenialFormType;
  cpt: string;
  modifier: string | null;
  amountUsd: number;
  status: CopyPair;
  code: 'CO-4' | 'CO-16' | 'PR-204';
  priority: 'high' | 'medium';
  issue: CopyPair;
  timeline: { en: readonly string[]; es: readonly string[] };
  remark: CopyPair;
  citation: CopyPair;
};

export const HIGH_PRIORITY_USD = 5000;
