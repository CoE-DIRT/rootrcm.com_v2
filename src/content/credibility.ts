import type { CopyPair } from '@/content/ecosystem';

export type EditorialStatus = 'unpublished' | 'pending_founder' | 'published';

export type ProofSlot = {
  id: string;
  role: CopyPair;
  editorialStatus: EditorialStatus;
  /** Only populated when editorialStatus is published. Never invent quotes. */
  quote?: CopyPair;
  attribution?: CopyPair;
};

/**
 * Publishing infrastructure for customer voices. Default is unpublished empty
 * states. No testimonials, licenses, recovery percentages or case-study metrics.
 */
export const proofSlots: readonly ProofSlot[] = [
  {
    id: 'practice-owner',
    role: { en: 'Practice owner', es: 'Dueño de la práctica' },
    editorialStatus: 'unpublished',
  },
  {
    id: 'rcm-director',
    role: { en: 'RCM director', es: 'Director de RCM' },
    editorialStatus: 'unpublished',
  },
  {
    id: 'finance',
    role: { en: 'Finance lead', es: 'Responsable de finanzas' },
    editorialStatus: 'unpublished',
  },
  {
    id: 'case-study',
    role: { en: 'Case study', es: 'Caso de estudio' },
    editorialStatus: 'unpublished',
  },
  {
    id: 'certification',
    role: { en: 'Certification / license', es: 'Certificación / licencia' },
    editorialStatus: 'unpublished',
  },
];

export function publishedProof(slots: readonly ProofSlot[] = proofSlots) {
  return slots.filter((slot) => slot.editorialStatus === 'published' && slot.quote);
}
