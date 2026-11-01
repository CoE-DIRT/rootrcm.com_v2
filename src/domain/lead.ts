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

export type LeadDedupKey = string & { readonly __brand: 'LeadDedupKey' };

export const leadOwnerTeams = ['sales', 'unassigned'] as const;
export type LeadOwnerTeam = (typeof leadOwnerTeams)[number];

/** HubSpot remains source of truth for sales ownership; assignee stays empty until CRM is enabled. */
export type LeadOwnership = {
  team: LeadOwnerTeam;
  assigneeId: null;
  sourceOfTruth: 'hubspot';
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
  dedupKey: LeadDedupKey;
  ownership: LeadOwnership;
  delivery: 'unavailable';
};
