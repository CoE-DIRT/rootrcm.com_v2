/**
 * Metrics derived only from records already in the snapshot.
 * Numerators and denominators are documented on each function. No invented KPIs.
 */
import type { ClaimStatusState } from '../workflow-status.ts';
import {
  claimStatusStates,
  type OpsArItem,
  type OpsClaim,
  type OpsCredentialingApplication,
  type OpsMetrics,
  type OpsTask,
  type RatioMetric,
} from './types.ts';

const MS_PER_DAY = 86_400_000;

const CLOSED_ENROLLMENTS = new Set(['effective', 'rejected', 'withdrawn']);

/** Claims that have an adjudicated (not merely acknowledged) outcome. */
const ADJUDICATED = new Set<ClaimStatusState>([
  'denied',
  'appealed',
  '835_posted',
  '276_277_adjudicated',
]);

function ratio(numerator: number, denominator: number): RatioMetric {
  return {
    numerator,
    denominator,
    value: denominator === 0 ? 0 : numerator / denominator,
  };
}

function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return 0;
  return Math.floor((to - from) / MS_PER_DAY);
}

/**
 * denialRate
 * numerator: claims with status `denied`
 * denominator: claims with an adjudicated outcome
 *   (`denied` | `appealed` | `835_posted` | `276_277_adjudicated`)
 * 277CA accept/reject is an acknowledgement, not adjudication, so it is excluded.
 * 837/999/queued/payer_processing/276_277_pending are in-flight and excluded.
 */
export function denialRate(claims: readonly OpsClaim[]): RatioMetric {
  const denominator = claims.filter((claim) => ADJUDICATED.has(claim.status)).length;
  const numerator = claims.filter((claim) => claim.status === 'denied').length;
  return ratio(numerator, denominator);
}

/**
 * openEnrollments
 * count of credentialing applications whose outcome is not terminal
 * (`effective`, `rejected`, `withdrawn`). Approved-pending-effective still counts
 * as open because submission ≠ billable effective date.
 */
export function openEnrollments(apps: readonly OpsCredentialingApplication[]): number {
  return apps.filter((app) => !CLOSED_ENROLLMENTS.has(app.status)).length;
}

/**
 * claimCountsByStage
 * numerator per key: claims whose `status` equals that ClaimStatusState
 * denominator: not used (this is a histogram; each claim is counted once)
 */
export function claimCountsByStage(
  claims: readonly OpsClaim[],
): Record<ClaimStatusState, number> {
  const counts = Object.fromEntries(claimStatusStates.map((state) => [state, 0])) as Record<
    ClaimStatusState,
    number
  >;
  for (const claim of claims) {
    counts[claim.status] += 1;
  }
  return counts;
}

/**
 * exceptionCount
 * numerator: tasks with status `open` or `blocked`
 * denominator: not used (work-queue count, not a rate)
 * Each seed exception (denial, eligibility review, auth pending, enrollment hold)
 * has a corresponding task so this reconciles to operator work items.
 */
export function exceptionCount(tasks: readonly OpsTask[]): number {
  return tasks.filter((task) => task.status === 'open' || task.status === 'blocked').length;
}

/**
 * daysInAr
 * Weighted mean days outstanding of *open* AR items.
 * numerator: Σ (daysOutstanding × balanceCents)
 * denominator: Σ balanceCents
 * daysOutstanding = floor((asOf − openedAt) / 86400000) for status === 'open'
 * Closed items and zero/negative balances are excluded.
 *
 * This is not the industry “total AR / average daily charges” Days in A/R,
 * which would require a trailing charge window we do not invent.
 */
export function daysInAr(items: readonly OpsArItem[], asOf: string): RatioMetric {
  let weightedDays = 0;
  let weight = 0;
  for (const item of items) {
    if (item.status !== 'open' || item.balanceCents <= 0) continue;
    weightedDays += daysBetween(item.openedAt, asOf) * item.balanceCents;
    weight += item.balanceCents;
  }
  return ratio(weightedDays, weight);
}

export function computeMetrics(input: {
  claims: readonly OpsClaim[];
  credentialingApplications: readonly OpsCredentialingApplication[];
  tasks: readonly OpsTask[];
  arItems: readonly OpsArItem[];
  clock: string;
}): OpsMetrics {
  return {
    denialRate: denialRate(input.claims),
    openEnrollments: openEnrollments(input.credentialingApplications),
    claimCountsByStage: claimCountsByStage(input.claims),
    exceptionCount: exceptionCount(input.tasks),
    daysInAr: daysInAr(input.arItems, input.clock),
    asOf: input.clock,
  };
}
