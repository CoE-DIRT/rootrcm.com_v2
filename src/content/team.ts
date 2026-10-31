import type { Locale } from '@/i18n/locales';

export type TeamMember = {
  id: string;
  name: string;
  initials: string;
  role: Readonly<Record<Locale, string>>;
};

/** Roles transcribed from Demo 6 v5Team; Aliah spelling follows the owner’s correction.
 * No biographies, credentials or photographs are inferred from these roles.
 */
export const teamMembers: readonly TeamMember[] = [
  {
    id: 'khurram',
    name: 'Khurram Zaffar Siddiqui',
    initials: 'KS',
    role: { en: 'Chief Commercial Officer (CCO)', es: 'Director comercial (CCO)' },
  },
  {
    id: 'aliah',
    name: 'Aliah Siddiqui',
    initials: 'AS',
    role: { en: 'Director of Strategy & Planning', es: 'Directora de estrategia y planificación' },
  },
  {
    id: 'kashif',
    name: 'Kashif Ali',
    initials: 'KA',
    role: { en: 'Co-founder', es: 'Cofundador' },
  },
  {
    id: 'aftab',
    name: 'Aftab Shaukat',
    initials: 'AS',
    role: { en: 'Co-founder', es: 'Cofundador' },
  },
];

export const teamCopy = {
  en: {
    eyebrow: 'The people responsible',
    title: 'Leadership built around accountability.',
    body: 'Meet the leadership roles guiding ROOT’s operating philosophy and client experience.',
    portraitPending: 'Approved portrait pending',
    note: 'Individual biographies and credentials are published only after review and approval.',
  },
  es: {
    eyebrow: 'Las personas responsables',
    title: 'Dirección basada en la responsabilidad.',
    body: 'Conozca las funciones directivas que guían la filosofía operativa y la experiencia del cliente de ROOT.',
    portraitPending: 'Retrato aprobado pendiente',
    note: 'Las biografías y credenciales individuales se publican tras su revisión y aprobación.',
  },
} as const;
