import type { CopyPair } from '@/content/ecosystem';

/** RBAC simulator personas — demo only; does not grant server access. */
export type PortalRbacPersona =
  | 'practice-physician'
  | 'practice-admin'
  | 'root-rcm-specialist';

export type PortalAuditEvent = {
  id: string;
  at: string;
  actorRole: PortalRbacPersona;
  summary: CopyPair;
  detail: CopyPair;
};

export const rbacPersonaLabel: Record<PortalRbacPersona, CopyPair> = {
  'practice-physician': {
    en: 'Practice Physician/Owner',
    es: 'Médico / propietario de la práctica',
  },
  'practice-admin': {
    en: 'Practice Administrator',
    es: 'Administrador de la práctica',
  },
  'root-rcm-specialist': {
    en: 'ROOT RCM Specialist',
    es: 'Especialista RCM de ROOT',
  },
};
