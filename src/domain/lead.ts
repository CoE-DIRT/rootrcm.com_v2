import type { LeadScoreResult } from './lead-score.ts';

export const leadSources = [
  'consultation',
  'diagnostic',
  'account',
  'custom',
  'other',
] as const;

export type LeadSource = (typeof leadSources)[number];

/** Business-only lead. Never includes patient, clinical, or claim fields. */
export type BusinessLeadContact = {
  name: string;
  email: string;
  organization: string;
};

export type BusinessLead = {
  source: LeadSource;
  contact: BusinessLeadContact;
  consent: true;
  consentVersion: string;
  consentAt: string;
  summary?: string;
  score?: LeadScoreResult;
  correlationId: string;
};
