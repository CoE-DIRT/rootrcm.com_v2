/** Illustrative, explainable qualification. Not a predictive model. */
export type LeadScoreInput = {
  intent: 'consultation' | 'diagnostic' | 'managed' | 'custom' | 'other';
  serviceFit: boolean;
  providerBand: '1-20' | '21+' | 'unknown';
  timelineDays?: number;
  complete: boolean;
  consent: boolean;
};

export type LeadScoreResult = {
  score: number;
  factors: { code: string; points: number }[];
  version: 'lead-score.v1-illustrative';
};

export function scoreLead(input: LeadScoreInput): LeadScoreResult {
  const factors: LeadScoreResult['factors'] = [];
  if (input.intent === 'diagnostic') factors.push({ code: 'intent_diagnostic', points: 30 });
  else if (input.intent === 'managed' || input.intent === 'custom')
    factors.push({ code: 'intent_commercial', points: 24 });
  else if (input.intent === 'consultation') factors.push({ code: 'intent_consult', points: 16 });
  if (input.serviceFit) factors.push({ code: 'service_fit', points: 25 });
  if (input.providerBand === '1-20') factors.push({ code: 'provider_band', points: 15 });
  if (typeof input.timelineDays === 'number' && input.timelineDays <= 30)
    factors.push({ code: 'timeline', points: 15 });
  if (input.complete) factors.push({ code: 'completeness', points: 10 });
  if (input.consent) factors.push({ code: 'consent', points: 5 });
  const score = Math.min(
    100,
    factors.reduce((sum, factor) => sum + factor.points, 0),
  );
  return { score, factors, version: 'lead-score.v1-illustrative' };
}
