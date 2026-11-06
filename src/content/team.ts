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
    role: { en: 'Co-founder · Finance & Business Development', es: 'Cofundador · Finanzas y desarrollo de negocios' },
  },
  {
    id: 'aftab',
    name: 'Aftab Shaukat',
    initials: 'AS',
    role: { en: 'Co-founder · Principal, Client Solutions & Service Delivery', es: 'Cofundador · Director de soluciones al cliente y prestación de servicios' },
  },
];

export const teamCopy = {
  en: {
    eyebrow: 'The people responsible',
    title: 'Leadership built around accountability.',
    body: 'Meet the leadership roles guiding ROOT’s operating philosophy and client experience.',
    cardKicker: 'Leadership',
  },
  es: {
    eyebrow: 'Las personas responsables',
    title: 'Dirección basada en la responsabilidad.',
    body: 'Conozca las funciones directivas que guían la filosofía operativa y la experiencia del cliente de ROOT.',
    cardKicker: 'Dirección',
  },
} as const;
