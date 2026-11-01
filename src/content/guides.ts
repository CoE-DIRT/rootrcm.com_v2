import type { CopyPair } from '@/content/ecosystem';

export type GuideRecord = {
  id: string;
  title: CopyPair;
  summary: CopyPair;
  kind: 'guide' | 'template';
};

/** Demo 6 V4_GUIDES. Titles only; files are not emailed from this build. */
export const resourceGuides: readonly GuideRecord[] = [
  {
    id: 'revenue-evidence',
    kind: 'guide',
    title: { en: 'Revenue evidence checklist', es: 'Lista de evidencia de ingresos' },
    summary: {
      en: 'Inputs and documents for a responsible revenue assessment. Business records only.',
      es: 'Insumos y documentos para una evaluación responsable de ingresos. Solo registros de negocio.',
    },
  },
  {
    id: 'asc-denials',
    kind: 'guide',
    title: { en: 'Healthcare revenue intelligence: ASC denials', es: 'Inteligencia de ingresos: denegaciones ASC' },
    summary: {
      en: 'How to segment ASC denials by payer and cause. Educational. Not a claim result.',
      es: 'Cómo segmentar denegaciones ASC por pagador y causa. Educativo. No es un resultado de reclamos.',
    },
  },
  {
    id: 'leakage',
    kind: 'guide',
    title: { en: 'Revenue leakage guide for independent practices', es: 'Guía de fugas de ingresos' },
    summary: {
      en: 'Where avoidable leakage shows up between charge and payment.',
      es: 'Dónde aparece la fuga evitable entre el cargo y el pago.',
    },
  },
  {
    id: 'aging-ar',
    kind: 'guide',
    title: { en: 'Aging A/R recovery playbook', es: 'Manual de cuentas por cobrar vencidas' },
    summary: {
      en: 'Prioritize aging balances by payer, status and follow-up. No recovery percentage is claimed.',
      es: 'Priorice saldos vencidos por pagador, estado y seguimiento. No se afirma un porcentaje de recobro.',
    },
  },
  {
    id: 'denial-rootcause',
    kind: 'guide',
    title: { en: 'Denial management root-cause guide', es: 'Guía de causas de denegaciones' },
    summary: {
      en: 'Trace rejection patterns upstream so the same rework is less likely.',
      es: 'Siga los rechazos hacia atrás para reducir el mismo retrabajo.',
    },
  },
  {
    id: 'credentialing',
    kind: 'guide',
    title: { en: 'Credentialing operations checklist', es: 'Lista operativa de acreditación' },
    summary: {
      en: 'Track enrollment evidence, payer follow-up and renewals.',
      es: 'Siga evidencia de inscripción, seguimiento al pagador y renovaciones.',
    },
  },
  {
    id: 'kpi-model',
    kind: 'template',
    title: { en: 'Practice operations KPI model', es: 'Modelo KPI de operaciones' },
    summary: {
      en: 'Connect operating measures to decisions. Figures stay unpublished until sourced.',
      es: 'Conecte medidas operativas con decisiones. Las cifras siguen sin publicar hasta tener fuente.',
    },
  },
  {
    id: 'automation',
    kind: 'guide',
    title: { en: 'Healthcare automation readiness guide', es: 'Guía de preparación para automatización' },
    summary: {
      en: 'Which workflows are candidates for controlled automation. Nothing here is turned on.',
      es: 'Qué flujos son candidatos a automatización controlada. Aquí nada está activado.',
    },
  },
];
