import type { CopyPair } from '@/content/ecosystem';

export type PublicationStatus = 'unpublished' | 'pending_founder' | 'published';

export type ProofSlot = {
  id: string;
  role: CopyPair;
  publicationStatus: PublicationStatus;
  /** Only populated when publicationStatus is published. Never invent quotes. */
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
    publicationStatus: 'unpublished',
  },
  {
    id: 'rcm-director',
    role: { en: 'RCM director', es: 'Director de RCM' },
    publicationStatus: 'unpublished',
  },
  {
    id: 'finance',
    role: { en: 'Finance lead', es: 'Responsable de finanzas' },
    publicationStatus: 'unpublished',
  },
];

export function publishedProof(slots: readonly ProofSlot[] = proofSlots) {
  return slots.filter((slot) => slot.publicationStatus === 'published' && slot.quote);
}
