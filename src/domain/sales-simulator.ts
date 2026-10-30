/**
 * ROOT commercial-to-onboarding reference state machine.
 * Sample events never write to a live CRM, payment service, signing service, or tenant.
 */
import type { LeadScoreInput } from './lead-score.ts';
import { scoreLead } from './lead-score.ts';

export const salesMilestones = [
  'visitor', 'inquiry', 'qualified', 'consultation', 'proposal',
  'contract', 'organization', 'onboarding', 'active',
] as const;
export type SalesMilestone = (typeof salesMilestones)[number];
export type SalesAction = 'advance' | 'back' | 'reset' | 'toggle_blocker' | 'select_offer';
export type SalesOffer = 'free-account-consultation' | 'revenue-diagnostic' | 'managed-rcm' | 'custom-mso';

export type SalesEvent = {
  id: string;
  from: SalesMilestone;
  to: SalesMilestone;
  action: 'advance' | 'back';
  note: string;
  simulated: true;
};

export type SalesScenario = {
  id: 'bayview' | 'cedar-grove' | 'metro-asc';
  organization: string;
  specialty: string;
  providerCount: number;
  intent: LeadScoreInput['intent'];
  offer: SalesOffer;
};

export const salesScenarios: readonly SalesScenario[] = [
  { id: 'bayview', organization: 'Bayview Multi-Specialty Group', specialty: 'Cardiology and internal medicine', providerCount: 18, intent: 'managed', offer: 'managed-rcm' },
  { id: 'cedar-grove', organization: 'Cedar Grove Family Practice', specialty: 'Primary care', providerCount: 2, intent: 'consultation', offer: 'free-account-consultation' },
  { id: 'metro-asc', organization: 'Metro Surgical Center', specialty: 'Ambulatory surgery', providerCount: 28, intent: 'custom', offer: 'custom-mso' },
] as const;

export type SalesState = {
  scenarioId: SalesScenario['id'];
  milestone: SalesMilestone;
  offer: SalesOffer;
  blocked: boolean;
  events: SalesEvent[];
  version: number;
};

export const milestoneDescriptions: Record<SalesMilestone, { en: string; es: string }> = {
  visitor: { en: 'Prospect explores services, pricing and credibility.', es: 'El prospecto explora servicios, precios y credenciales.' },
  inquiry: { en: 'Business inquiry captured in the simulated lead record.', es: 'Consulta comercial capturada en el registro de ejemplo.' },
  qualified: { en: 'Explainable qualification and assignment completed.', es: 'Calificación explicable y asignación completadas.' },
  consultation: { en: 'Consultation completed in the sample appointment record.', es: 'Consulta completada en la cita de ejemplo.' },
  proposal: { en: 'Scoped proposal prepared for review.', es: 'Propuesta de servicios preparada para revisión.' },
  contract: { en: 'Sample agreement accepted; no real signature or payment.', es: 'Acuerdo de ejemplo aceptado; sin firma ni pago real.' },
  organization: { en: 'Workspace provisioned inside the simulator.', es: 'Espacio de trabajo creado en el simulador.' },
  onboarding: { en: 'Practice setup and authorized access checklist completed.', es: 'Lista de preparación de la práctica completada.' },
  active: { en: 'Demo customer can explore the operational workspace.', es: 'El cliente de ejemplo puede explorar el espacio operativo.' },
};

export const milestoneNames: Record<SalesMilestone, { en: string; es: string }> = {
  visitor: { en: 'Website visitor', es: 'Visitante del sitio' },
  inquiry: { en: 'Inquiry', es: 'Consulta comercial' },
  qualified: { en: 'Qualified lead', es: 'Prospecto calificado' },
  consultation: { en: 'Consultation', es: 'Consulta' },
  proposal: { en: 'Proposal', es: 'Propuesta' },
  contract: { en: 'Agreement', es: 'Acuerdo' },
  organization: { en: 'Organization', es: 'Organización' },
  onboarding: { en: 'Onboarding', es: 'Incorporación' },
  active: { en: 'Service workspace', es: 'Espacio de servicios' },
};

export function createSalesState(scenarioId: SalesScenario['id'] = 'bayview'): SalesState {
  const scenario = salesScenarios.find((item) => item.id === scenarioId)!;
  return { scenarioId, milestone: 'visitor', offer: scenario.offer, blocked: false, events: [], version: 0 };
}

export function scenarioFor(state: SalesState): SalesScenario {
  return salesScenarios.find((item) => item.id === state.scenarioId)!;
}

export function qualificationScore(state: SalesState) {
  const scenario = scenarioFor(state);
  return scoreLead({
    intent: scenario.intent,
    serviceFit: true,
    providerBand: scenario.providerCount > 20 ? '21+' : '1-20',
    timelineDays: 21,
    complete: true,
    consent: true,
  });
}

export type SalesTransition =
  | { ok: true; state: SalesState }
  | { ok: false; reason: 'blocked' | 'boundary' | 'invalid_offer'; state: SalesState };

export function transitionSales(state: SalesState, action: SalesAction, value?: SalesOffer): SalesTransition {
  if (action === 'reset') return { ok: true, state: createSalesState(state.scenarioId) };
  if (action === 'toggle_blocker') return { ok: true, state: { ...state, blocked: !state.blocked } };
  if (action === 'select_offer') {
    if (!value || !['free-account-consultation', 'revenue-diagnostic', 'managed-rcm', 'custom-mso'].includes(value)) return { ok: false, reason: 'invalid_offer', state };
    return { ok: true, state: { ...state, offer: value } };
  }
  if (state.blocked) return { ok: false, reason: 'blocked', state };
  const index = salesMilestones.indexOf(state.milestone);
  const newIndex = index + (action === 'advance' ? 1 : -1);
  if (newIndex < 0 || newIndex >= salesMilestones.length) return { ok: false, reason: 'boundary', state };
  const next = salesMilestones[newIndex];
  const event: SalesEvent = {
    id: `demo-event-${state.version + 1}`, from: state.milestone, to: next,
    action, note: `${state.milestone} → ${next}`, simulated: true,
  };
  return { ok: true, state: { ...state, milestone: next, events: [...state.events, event], version: state.version + 1 } };
}

export function salesEntitlements(offer: SalesOffer): readonly string[] {
  switch (offer) {
    case 'free-account-consultation': return ['basic_workspace', 'consultation'];
    case 'revenue-diagnostic': return ['basic_workspace', 'consultation', 'diagnostic_report'];
    case 'managed-rcm': return ['basic_workspace', 'consultation', 'rcm_dashboard', 'credentialing_tracker', 'managed_requests'];
    case 'custom-mso': return ['basic_workspace', 'consultation', 'rcm_dashboard', 'credentialing_tracker', 'managed_requests', 'enterprise_reporting', 'multi_location'];
  }
}
