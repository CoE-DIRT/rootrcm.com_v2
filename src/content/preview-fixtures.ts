import organizations from '../../data/seed/organizations.example.json';
import type { CopyPair } from '@/content/ecosystem';

export const previewOrgs = organizations.organizations;

export const clientQueue = [
  {
    id: 'req-1042',
    title: {
      en: 'Denial follow-up — sample claim family',
      es: 'Seguimiento de denegación — familia de reclamos de muestra',
    },
    owner: { en: 'ROOT specialist', es: 'Especialista ROOT' },
    state: { en: 'In review', es: 'En revisión' },
  },
  {
    id: 'req-1048',
    title: {
      en: 'Credentialing packet completeness',
      es: 'Completitud del paquete de credencialización',
    },
    owner: { en: 'Practice admin', es: 'Administración de la práctica' },
    state: { en: 'Waiting', es: 'En espera' },
  },
] as const;

export const staffQueue = [
  {
    id: 'work-22',
    org: 'Bayview Multi-Specialty Group',
    task: { en: 'Assigned denial review', es: 'Revisión de denegación asignada' },
    state: { en: 'Open', es: 'Abierta' },
  },
  {
    id: 'work-29',
    org: 'Cedar Grove Family Practice',
    task: { en: 'Credentialing checklist', es: 'Lista de credencialización' },
    state: { en: 'Blocked', es: 'Bloqueada' },
  },
] as const;

export const dirtMetrics = [
  {
    label: { en: 'Net collection rate', es: 'Tasa neta de cobro' },
    value: '—',
    note: {
      en: 'Synthetic placeholder; denominator unpublished',
      es: 'Marcador sintético; denominador sin publicar',
    },
  },
  {
    label: { en: 'Denial rate', es: 'Tasa de denegación' },
    value: '—',
    note: { en: 'No live payer feed', es: 'Sin alimentación de pagador en vivo' },
  },
  {
    label: { en: 'Days in A/R', es: 'Días en cuentas por cobrar' },
    value: '—',
    note: { en: 'Illustrative workspace only', es: 'Solo espacio ilustrativo' },
  },
] as const;

export const credentialingStages: readonly CopyPair[] = [
  { en: 'Application', es: 'Solicitud' },
  { en: 'Primary source', es: 'Fuente primaria' },
  { en: 'Payer packet', es: 'Paquete del pagador' },
  { en: 'Follow-up', es: 'Seguimiento' },
  { en: 'Effective', es: 'Vigente' },
];

