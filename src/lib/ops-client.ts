import type { ApiResponse } from '@/domain/http';
import { phaseLabels, type Pair, type StageProgress, type StageState } from '@/content/operations-demo';

export const OPS_STATE_PATH = '/api/v1/ops/state';
export const OPS_ACTIONS_PATH = '/api/v1/ops/actions';
export const OPS_DEMO_ORG_ID = 'bayview';

export type OpsPersona = 'client' | 'staff';

export const OPS_ACTION_TYPES = [
  'reset',
  'advance_credentialing',
  'deny_claim',
  'advance_timeline',
  'set_persona',
  'set_tier',
] as const;

export type OpsActionType = (typeof OPS_ACTION_TYPES)[number];

export type OpsActionRequest = {
  type: OpsActionType;
  orgId: string;
  persona: OpsPersona;
  applicationId?: string;
  claimId?: string;
  tier?: string;
};

export type OpsHistoryEntry = {
  id: string;
  at: string;
  actor: string;
  summary: Pair;
  from: string | null;
  to: string | null;
};

export type OpsClaim = {
  id: string;
  orgId: string;
  payer: string;
  status: string;
  state: Pair;
  next: Pair;
  owner: Pair;
  history: OpsHistoryEntry[];
  origin: string;
  queue: string;
};

export type OpsApplication = {
  id: string;
  orgId: string;
  providerAlias: Pair;
  payer: string;
  applicationType: Pair;
  phase: string;
  status: string;
  nextAction: Pair;
  owner: Pair;
  externalStatus: Pair;
  stages: StageProgress[];
  history: OpsHistoryEntry[];
  origin: string;
};

export type OpsAppointment = {
  id: string;
  orgId: string;
  session: Pair;
  load: number | null;
  note: Pair;
  eligibilityFlag: boolean | null;
  authFlag: boolean | null;
};

export type OpsEligibility = {
  id: string;
  payer: string;
  label: Pair;
  next: Pair;
};

export type OpsNotification = {
  id: string;
  orgId: string;
  title: Pair;
  body: Pair;
  createdAt: string;
  kind: string;
};

export type OpsAuditEvent = {
  id: string;
  orgId: string;
  at: string;
  actor: string;
  type: string;
  resourceId: string;
  summary: Pair;
  from: string | null;
  to: string | null;
};

export type OpsRatio = {
  numerator: number;
  denominator: number;
  value: number;
};

export type OpsMetrics = {
  denialRate: number | null;
  denialRateRatio: OpsRatio | null;
  openEnrollments: number | null;
  claimCountsByStage: Record<string, number>;
  exceptionCount: number | null;
  daysInAr: number | null;
  daysInArRatio: OpsRatio | null;
};

export type OpsState = {
  orgId: string;
  persona: OpsPersona;
  claims: OpsClaim[];
  applications: OpsApplication[];
  appointments: OpsAppointment[];
  notifications: OpsNotification[];
  auditEvents: OpsAuditEvent[];
  metrics: OpsMetrics;
  eligibility: OpsEligibility[];
};

export class OpsClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'OpsClientError';
    this.status = status;
    this.code = code;
  }
}

const PHASE_INDEX: Record<string, number> = {
  intake: 0,
  documents_pending: 1,
  caqh_attestation: 1,
  caqh: 1,
  primary_source: 2,
  submitted: 3,
  payer_acknowledged: 3,
  payer_submission: 3,
  payer_review: 4,
  additional_information: 4,
  on_hold: 4,
  approved_pending_effective: 5,
  effective: 5,
  revalidation_due: 5,
  rejected: 4,
  withdrawn: 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function asPair(value: unknown, fallback = ''): Pair {
  if (typeof value === 'string' && value.trim()) return { en: value, es: value };
  if (isRecord(value)) {
    const en = pickString(value.en, value.label, value.title, value.name, value.summary, value.text);
    const nestedLabel = isRecord(value.label) ? pickString(value.label.en, value.label.es) : '';
    const resolvedEn = en || nestedLabel;
    const es =
      pickString(value.es) ||
      (isRecord(value.label) ? pickString(value.label.es, value.label.en) : '') ||
      resolvedEn;
    if (resolvedEn || es) return { en: resolvedEn || es, es: es || resolvedEn };
  }
  return { en: fallback, es: fallback };
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function asFlag(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (
    [
      'true',
      'yes',
      'eligible',
      'complete',
      'cleared',
      'authorized',
      'auth_approved',
      'approved',
      'not_required',
      '271_active',
    ].includes(normalized)
  ) {
    return true;
  }
  if (
    [
      'false',
      'no',
      'ineligible',
      'pending',
      'required',
      'auth_required',
      'exception',
      'flagged',
      'submitted',
      'denied',
      'expired',
      'queued',
      '270_submitted',
      '271_inactive',
      '271_error',
      'needs_review',
    ].includes(normalized)
  ) {
    return false;
  }
  return null;
}

function asRatio(value: unknown): OpsRatio | null {
  if (!isRecord(value)) return null;
  const numerator = asNumber(value.numerator);
  const denominator = asNumber(value.denominator);
  const parsedValue = asNumber(value.value);
  if (numerator === null || denominator === null || parsedValue === null) return null;
  return { numerator, denominator, value: parsedValue };
}

function metricNumber(value: unknown): number | null {
  const ratio = asRatio(value);
  if (ratio) return ratio.value;
  return asNumber(value);
}

function nameById(rows: unknown[], id: string, field: string, fallback: string): string {
  if (!id) return fallback;
  for (const row of rows) {
    if (isRecord(row) && asString(row.id) === id) return asString(row[field], fallback || id);
  }
  return fallback || id;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function unwrapState(data: unknown): Record<string, unknown> {
  if (!isRecord(data)) return {};
  for (const key of ['state', 'snapshot', 'payload', 'demo', 'view'] as const) {
    if (isRecord(data[key])) return data[key] as Record<string, unknown>;
  }
  return data;
}

function firstArray(record: Record<string, unknown>, ...keys: string[]): unknown[] {
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [];
}

function stagesFromPhase(phaseOrStatus: string, explicit?: unknown): StageProgress[] {
  if (Array.isArray(explicit) && explicit.length > 0) {
    return explicit.map((entry, index) => {
      const rec = isRecord(entry) ? entry : {};
      const stateRaw = asString(rec.state, index === 0 ? 'current' : 'upcoming');
      const state: StageState =
        stateRaw === 'complete' || stateRaw === 'current' || stateRaw === 'upcoming'
          ? stateRaw
          : index === 0
            ? 'current'
            : 'upcoming';
      const phase = phaseLabels[index];
      return {
        id: (asString(rec.id, phase?.id ?? `stage-${index}`) || `stage-${index}`) as StageProgress['id'],
        label: asPair(rec.label, phase?.label.en ?? `Stage ${index + 1}`),
        state,
      };
    });
  }
  const index = PHASE_INDEX[phaseOrStatus] ?? 0;
  return phaseLabels.map((phase, i) => ({
    id: phase.id,
    label: phase.label,
    state: (i < index ? 'complete' : i === index ? 'current' : 'upcoming') as StageState,
  }));
}

function asHistory(value: unknown, fallbackId: string): OpsHistoryEntry[] {
  return asArray(value).map((entry, index) => {
    const rec = isRecord(entry) ? entry : {};
    return {
      id: asString(rec.id, `${fallbackId}-hist-${index}`),
      at: asString(rec.at, asString(rec.createdAt, asString(rec.timestamp))),
      actor: asString(rec.actor, asString(rec.actorId, 'system')),
      summary: asPair(rec.summary ?? rec.note ?? rec.action ?? rec.type, asString(rec.type, 'update')),
      from: asString(rec.from, asString(rec.previous, asString(rec.fromStatus))) || null,
      to: asString(rec.to, asString(rec.toStatus, asString(rec.next))) || null,
    };
  });
}

function asMetrics(value: unknown, claims: OpsClaim[]): OpsMetrics {
  const rec = isRecord(value) ? value : {};
  const rawCounts = isRecord(rec.claimCountsByStage)
    ? rec.claimCountsByStage
    : isRecord(rec.claimsByStage)
      ? rec.claimsByStage
      : {};
  const claimCountsByStage: Record<string, number> = {};
  for (const [key, count] of Object.entries(rawCounts)) {
    const numeric = asNumber(count);
    if (numeric !== null) claimCountsByStage[key] = numeric;
  }
  if (Object.keys(claimCountsByStage).length === 0) {
    for (const claim of claims) {
      const key = claim.status || claim.queue || 'unspecified';
      claimCountsByStage[key] = (claimCountsByStage[key] ?? 0) + 1;
    }
  }
  const denialRateRatio = asRatio(rec.denialRate);
  const daysInArRatio = asRatio(rec.daysInAr ?? rec.daysInAR);
  return {
    denialRate: metricNumber(rec.denialRate),
    denialRateRatio,
    openEnrollments: asNumber(rec.openEnrollments),
    claimCountsByStage,
    exceptionCount: asNumber(rec.exceptionCount),
    daysInAr: metricNumber(rec.daysInAr ?? rec.daysInAR),
    daysInArRatio,
  };
}

type Catalog = { payers: unknown[]; providers: unknown[] };

function asClaim(value: unknown, orgId: string, index: number, catalog: Catalog): OpsClaim {
  const rec = isRecord(value) ? value : {};
  const id = asString(rec.id, asString(rec.claimId, asString(rec.resourceId, `claim-${index}`)));
  const status = asString(rec.status, asString(rec.state, asString(rec.stage, 'queued')));
  const payerId = asString(rec.payerId);
  return {
    id,
    orgId: asString(rec.orgId, orgId),
    payer: asString(rec.payer, nameById(catalog.payers, payerId, 'name', payerId || 'Unspecified payer')),
    status,
    state: asPair(rec.state ?? rec.statusLabel ?? rec.status, status),
    next: asPair(rec.next ?? rec.nextAction, ''),
    owner: asPair(rec.owner ?? rec.assignedOwner ?? rec.ownerId, ''),
    history: asHistory(rec.history ?? rec.events, id),
    origin: asString(rec.origin, asString(rec.source, 'synthetic')),
    queue: asString(rec.queue, status),
  };
}

const ENROLLMENT_TYPES: Record<string, Pair> = {
  initial: { en: 'Initial enrollment', es: 'Inscripción inicial' },
  revalidation: { en: 'Revalidation', es: 'Revalidación' },
  location_addition: { en: 'Location addition', es: 'Alta de ubicación' },
  payer_change: { en: 'Payer change', es: 'Cambio de pagador' },
};

function asApplication(value: unknown, orgId: string, index: number, catalog: Catalog): OpsApplication {
  const rec = isRecord(value) ? value : {};
  const id = asString(rec.id, asString(rec.applicationId, asString(rec.resourceId, `application-${index}`)));
  const status = asString(rec.status, asString(rec.phase, asString(rec.outcome, 'intake')));
  const phase = asString(rec.phase, status);
  const payerId = asString(rec.payerId);
  const providerId = asString(rec.providerId);
  const enrollmentType = asString(rec.enrollmentType, asString(rec.applicationType, 'initial'));
  return {
    id,
    orgId: asString(rec.orgId, orgId),
    providerAlias: asPair(
      rec.providerAlias ?? rec.provider,
      nameById(catalog.providers, providerId, 'alias', `Provider ${index + 1}`),
    ),
    payer: asString(rec.payer, nameById(catalog.payers, payerId, 'name', payerId || 'Unspecified payer')),
    applicationType: ENROLLMENT_TYPES[enrollmentType] ?? asPair(rec.applicationType ?? rec.enrollmentType, enrollmentType),
    phase,
    status,
    nextAction: asPair(rec.nextAction, ''),
    owner: asPair(rec.owner ?? rec.assignedOwner ?? rec.ownerId, ''),
    externalStatus: asPair(rec.externalStatus, 'Not connected — simulated status'),
    stages: stagesFromPhase(phase, rec.stages),
    history: asHistory(rec.history ?? rec.events, id),
    origin: asString(rec.origin, asString(rec.source, 'synthetic')),
  };
}

function asAppointment(value: unknown, orgId: string, index: number): OpsAppointment {
  const rec = isRecord(value) ? value : {};
  return {
    id: asString(rec.id, `appointment-${index}`),
    orgId: asString(rec.orgId, orgId),
    session: asPair(rec.session ?? rec.slotLabel ?? rec.label ?? rec.title, asString(rec.id, `Block ${index + 1}`)),
    load: asNumber(rec.load ?? rec.slotCount ?? rec.count),
    note: asPair(rec.note ?? rec.nextAction, asString(rec.scheduledAt)),
    eligibilityFlag: asFlag(rec.eligibilityFlag ?? rec.eligibility ?? rec.eligibilityStatus),
    authFlag: asFlag(rec.authFlag ?? rec.authorization ?? rec.authStatus ?? rec.priorAuth),
  };
}

function asNotification(value: unknown, orgId: string, index: number): OpsNotification {
  const rec = isRecord(value) ? value : {};
  return {
    id: asString(rec.id, `notification-${index}`),
    orgId: asString(rec.orgId, orgId),
    title: asPair(rec.title ?? rec.subject, 'Notification'),
    body: asPair(rec.body ?? rec.message ?? rec.summary, ''),
    createdAt: asString(rec.createdAt, asString(rec.at, asString(rec.timestamp))),
    kind: asString(rec.kind, asString(rec.type, 'info')),
  };
}

function asAudit(value: unknown, orgId: string, index: number): OpsAuditEvent {
  const rec = isRecord(value) ? value : {};
  const action = asString(rec.action, asString(rec.type, 'event'));
  return {
    id: asString(rec.id, `audit-${index}`),
    orgId: asString(rec.orgId, orgId),
    at: asString(rec.at, asString(rec.createdAt, asString(rec.timestamp))),
    actor: asString(rec.actor, asString(rec.actorId, 'system')),
    type: action,
    resourceId: asString(rec.resourceId, asString(rec.applicationId, asString(rec.claimId))),
    summary: asPair(rec.summary ?? rec.note ?? action, action),
    from: asString(rec.from, asString(rec.fromStatus)) || null,
    to: asString(rec.to, asString(rec.toStatus)) || null,
  };
}

function asEligibility(value: unknown, index: number, catalog: Catalog): OpsEligibility {
  const rec = isRecord(value) ? value : {};
  const payerId = asString(rec.payerId);
  return {
    id: asString(rec.id, `eligibility-${index}`),
    payer: asString(rec.payer, nameById(catalog.payers, payerId, 'name', payerId || 'Unspecified payer')),
    label: asPair(rec.label ?? rec.status ?? rec.state, asString(rec.state, 'Eligibility')),
    next: asPair(rec.next ?? rec.nextAction, ''),
  };
}

export function normalizeOpsState(raw: unknown, fallbackOrgId: string, persona: OpsPersona): OpsState {
  const record = unwrapState(raw);
  const orgId = asString(record.orgId, fallbackOrgId);
  const catalog: Catalog = {
    payers: firstArray(record, 'payers'),
    providers: firstArray(record, 'providers'),
  };
  const claims = firstArray(record, 'claims').map((item, index) => asClaim(item, orgId, index, catalog));
  const applications = firstArray(record, 'applications', 'credentialingApplications', 'enrollments').map(
    (item, index) => asApplication(item, orgId, index, catalog),
  );
  const eligibilityRows = firstArray(record, 'eligibility', 'eligibilityChecks');
  const authRows = firstArray(record, 'auths', 'authorizations');
  const appointments = firstArray(record, 'appointments', 'schedule', 'sessions').map((item, index) => {
    const rec = isRecord(item) ? item : {};
    const appointment = asAppointment(item, orgId, index);
    const eligibilityId = asString(rec.eligibilityId);
    const matchedElig = eligibilityRows.find(
      (row) =>
        isRecord(row) &&
        (asString(row.id) === eligibilityId || asString(row.appointmentId) === appointment.id),
    );
    const matchedAuth = authRows.find((row) => isRecord(row) && asString(row.appointmentId) === appointment.id);
    return {
      ...appointment,
      eligibilityFlag:
        appointment.eligibilityFlag ??
        (isRecord(matchedElig) ? asFlag(matchedElig.state ?? matchedElig.status) : null),
      authFlag:
        appointment.authFlag ?? (isRecord(matchedAuth) ? asFlag(matchedAuth.state ?? matchedAuth.status) : null),
      note:
        appointment.note.en || appointment.note.es
          ? appointment.note
          : asPair(
              isRecord(matchedElig) ? matchedElig.nextAction : undefined,
              isRecord(matchedAuth) ? asString(matchedAuth.nextAction) : '',
            ),
    };
  });
  return {
    orgId,
    persona: asString(record.persona, persona) === 'staff' ? 'staff' : 'client',
    claims,
    applications,
    appointments,
    notifications: firstArray(record, 'notifications').map((item, index) => asNotification(item, orgId, index)),
    auditEvents: firstArray(record, 'auditEvents', 'audit', 'events').map((item, index) =>
      asAudit(item, orgId, index),
    ),
    metrics: asMetrics(record.metrics, claims),
    eligibility: eligibilityRows.map((item, index) => asEligibility(item, index, catalog)),
  };
}

async function readEnvelope(res: Response): Promise<ApiResponse<unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResponse<unknown>;
  } catch {
    throw new OpsClientError(
      `Operations API returned HTTP ${res.status} without a JSON envelope.`,
      res.status,
      'http_error',
    );
  }
}

function throwIfFailed(res: Response, envelope: ApiResponse<unknown>, fallback: string): void {
  if (res.ok && !envelope.error && envelope.data != null) return;
  const status = res.ok ? 422 : res.status;
  throw new OpsClientError(
    envelope.error?.message ?? fallback,
    status,
    envelope.error?.code ?? (res.ok ? 'empty_state' : 'http_error'),
  );
}

const fetchInit: RequestInit = {
  cache: 'no-store',
  credentials: 'same-origin',
  headers: { accept: 'application/json' },
};

export async function fetchOpsState(orgId: string, persona: OpsPersona): Promise<OpsState> {
  const url = `${OPS_STATE_PATH}?orgId=${encodeURIComponent(orgId)}&persona=${encodeURIComponent(persona)}`;
  const res = await fetch(url, fetchInit);
  const envelope = await readEnvelope(res);
  throwIfFailed(res, envelope, `Operations state could not be loaded (HTTP ${res.status}).`);
  return normalizeOpsState(envelope.data, orgId, persona);
}

function looksLikeState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.claims) ||
    Array.isArray(value.applications) ||
    Array.isArray(value.credentialingApplications) ||
    isRecord(value.metrics) ||
    isRecord(value.state)
  );
}

export async function postOpsAction(action: OpsActionRequest): Promise<OpsState | null> {
  const res = await fetch(OPS_ACTIONS_PATH, {
    ...fetchInit,
    method: 'POST',
    headers: { ...fetchInit.headers, 'content-type': 'application/json' },
    body: JSON.stringify(action),
  });
  const envelope = await readEnvelope(res);
  throwIfFailed(res, envelope, `Operations action '${action.type}' failed (HTTP ${res.status}).`);
  if (looksLikeState(envelope.data)) {
    return normalizeOpsState(envelope.data, action.orgId, action.persona);
  }
  return null;
}

export function localize(pair: Pair | string | undefined, locale: 'en' | 'es'): string {
  if (!pair) return '';
  if (typeof pair === 'string') return pair;
  return pair[locale] || pair.en || pair.es || '';
}

export function formatMetric(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toPrecision(3);
}

export function formatRatio(ratio: OpsRatio | null, fallback: number | null): string {
  if (ratio) return `${ratio.numerator}/${ratio.denominator}`;
  return formatMetric(fallback);
}
