import type { Locale } from '@/i18n/locales';

/** Localized string pair used by commercial catalogs. */
export type CopyPair = { en: string; es: string };

export type PlatformRow = 'ehr_pm' | 'clearinghouse' | 'enrollment';

export type Platform = {
  id: string;
  /** Brand names stay in source language. */
  name: string;
  row: PlatformRow;
  category: CopyPair;
  /** Where the name was observed. Demo 6 TECH array or enrollment workflow copy. */
  source: 'demo6-tech' | 'demo6-enrollment';
};

function loc(pair: CopyPair, locale: Locale) {
  return pair[locale];
}

const ehrPm: CopyPair = { en: 'EHR / PM', es: 'EHR / PM' };
const clearinghouse: CopyPair = { en: 'Clearinghouse', es: 'Intermediario' };
const enrollment: CopyPair = {
  en: 'Payer / enrollment workflow',
  es: 'Flujo de pagador / inscripción',
};

/**
 * Full Demo 6 TECH EHR/PM + clearinghouse list, plus CAQH / PECOS / NPPES from
 * credentialing workflow copy. Do not shorten. HubSpot, Apollo, Stripe and Appwrite
 * stay out of these rows — they are ROOT stack, not practice EHR/PM systems.
 *
 * Parsed from reference/demo6 TECH array. Names that were requested but are not
 * vendor listings in the prototype are omitted (see catalogs.test.mjs).
 */
export const platforms: readonly Platform[] = [
  { id: 'advancedmd', name: 'AdvancedMD', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  {
    id: 'eclinicalworks',
    name: 'eClinicalWorks',
    row: 'ehr_pm',
    category: ehrPm,
    source: 'demo6-tech',
  },
  {
    id: 'athenahealth',
    name: 'athenahealth',
    row: 'ehr_pm',
    category: ehrPm,
    source: 'demo6-tech',
  },
  {
    id: 'nextgen',
    name: 'NextGen Healthcare',
    row: 'ehr_pm',
    category: ehrPm,
    source: 'demo6-tech',
  },
  { id: 'tebra', name: 'Tebra', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  { id: 'drchrono', name: 'DrChrono', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  { id: 'carecloud', name: 'CareCloud', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  {
    id: 'practice-fusion',
    name: 'Practice Fusion',
    row: 'ehr_pm',
    category: ehrPm,
    source: 'demo6-tech',
  },
  { id: 'modmed', name: 'ModMed', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  { id: 'epic', name: 'Epic', row: 'ehr_pm', category: ehrPm, source: 'demo6-tech' },
  {
    id: 'oracle-health',
    name: 'Oracle Health',
    row: 'ehr_pm',
    category: ehrPm,
    source: 'demo6-tech',
  },
  {
    id: 'waystar',
    name: 'Waystar',
    row: 'clearinghouse',
    category: clearinghouse,
    source: 'demo6-tech',
  },
  {
    id: 'office-ally',
    name: 'Office Ally',
    row: 'clearinghouse',
    category: clearinghouse,
    source: 'demo6-tech',
  },
  {
    id: 'change-healthcare',
    name: 'Change Healthcare',
    row: 'clearinghouse',
    category: clearinghouse,
    source: 'demo6-tech',
  },
  {
    id: 'trizetto',
    name: 'TriZetto Provider Solutions',
    row: 'clearinghouse',
    category: clearinghouse,
    source: 'demo6-tech',
  },
  {
    id: 'availity',
    name: 'Availity',
    row: 'enrollment',
    category: enrollment,
    source: 'demo6-tech',
  },
  { id: 'caqh', name: 'CAQH', row: 'enrollment', category: enrollment, source: 'demo6-enrollment' },
  {
    id: 'pecos',
    name: 'PECOS',
    row: 'enrollment',
    category: enrollment,
    source: 'demo6-enrollment',
  },
  {
    id: 'nppes',
    name: 'NPPES',
    row: 'enrollment',
    category: enrollment,
    source: 'demo6-enrollment',
  },
] as const;

export const platformRows: readonly { id: PlatformRow; heading: CopyPair }[] = [
  { id: 'ehr_pm', heading: { en: 'EHR / practice management', es: 'EHR / gestión de práctica' } },
  { id: 'clearinghouse', heading: { en: 'Clearinghouses', es: 'Intermediarios de reclamaciones' } },
  {
    id: 'enrollment',
    heading: { en: 'Payer and enrollment workflows', es: 'Flujos de pagador e inscripción' },
  },
] as const;

export function platformsInRow(row: PlatformRow): Platform[] {
  return platforms.filter((platform) => platform.row === row);
}

export function platformCategory(platform: Platform, locale: Locale) {
  return loc(platform.category, locale);
}

export function rowHeading(row: PlatformRow, locale: Locale) {
  const match = platformRows.find((item) => item.id === row);
  return match ? loc(match.heading, locale) : row;
}
