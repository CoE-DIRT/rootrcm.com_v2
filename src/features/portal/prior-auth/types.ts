import type { CopyPair } from '@/content/ecosystem';

export type PriorAuthStatus =
  | 'approved'
  | 'payer_review'
  | 'peer_to_peer'
  | 'additional_docs';

export type PriorAuthUrgency = 'urgent' | 'elective';

export type PortalPriorAuthRow = {
  id: string;
  patientRef: string;
  orderingPhysician: string;
  cpt: string;
  payer: string;
  status: PriorAuthStatus;
  urgency: PriorAuthUrgency;
  slaLabel: CopyPair;
  slaRemaining: CopyPair;
};

export const priorAuthStatusLabel: Record<PriorAuthStatus, CopyPair> = {
  approved: { en: 'Approved', es: 'Aprobada' },
  payer_review: { en: 'Payer Review Pending', es: 'Revisión del pagador pendiente' },
  peer_to_peer: { en: 'Peer-to-Peer Required', es: 'Peer-to-peer requerido' },
  additional_docs: {
    en: 'Additional Documentation Requested',
    es: 'Documentación adicional solicitada',
  },
};
