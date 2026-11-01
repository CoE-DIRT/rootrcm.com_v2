import type { CopyPair } from '@/content/ecosystem';

export type ProgramType =
  'commercial' | 'medicaid_mco' | 'medicare_advantage' | 'marketplace' | 'medicare' | 'medicaid';

export type NyBorough = 'manhattan' | 'brooklyn' | 'queens' | 'bronx' | 'staten-island';

export type NyPayer = {
  id: string;
  name: string;
  programType: ProgramType;
  lastReviewed: '2026-10-30';
  sourceUrl: string;
  sourceLabel: CopyPair;
  /** Public plan site for orientation only. Not a ROOT contract. */
  publicSite?: string;
};

export const nyBoroughs: readonly { id: NyBorough; name: CopyPair }[] = [
  { id: 'manhattan', name: { en: 'Manhattan', es: 'Manhattan' } },
  { id: 'brooklyn', name: { en: 'Brooklyn', es: 'Brooklyn' } },
  { id: 'queens', name: { en: 'Queens', es: 'Queens' } },
  { id: 'bronx', name: { en: 'Bronx', es: 'Bronx' } },
  { id: 'staten-island', name: { en: 'Staten Island', es: 'Staten Island' } },
];

const nysDoh: CopyPair = {
  en: 'NYS DOH Managed Care Organization Directory',
  es: 'Directorio de organizaciones de atención administrada de NYS DOH',
};
const nycDoh: CopyPair = {
  en: 'NYC DOHMH health insurance overview',
  es: 'Resumen de seguro de salud de NYC DOHMH',
};
const nyhpa: CopyPair = {
  en: 'New York Health Plan Association',
  es: 'Asociación de planes de salud de Nueva York',
};

const REVIEWED = '2026-10-30' as const;

/**
 * NY payer landscape for market orientation. Listing a plan does not mean ROOT
 * is contracted, in-network, or delegated. No NYC office is claimed.
 *
 * Sources reviewed 2026-10-30: NYS DOH MCO directory, NYC DOHMH, NYHPA.
 */
export const nyPayers: readonly NyPayer[] = [
  {
    id: 'healthfirst',
    name: 'Healthfirst',
    programType: 'medicaid_mco',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.health.ny.gov/health_care/managed_care/plans/mcp_dir_by_plan',
    sourceLabel: nysDoh,
    publicSite: 'https://healthfirst.org',
  },
  {
    id: 'metroplus',
    name: 'MetroPlusHealth',
    programType: 'medicaid_mco',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyc.gov/site/doh/health/health-topics/health-insurance.page',
    sourceLabel: nycDoh,
    publicSite: 'https://metroplus.org',
  },
  {
    id: 'fidelis',
    name: 'Fidelis Care',
    programType: 'medicaid_mco',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.health.ny.gov/health_care/managed_care/plans/mcp_dir_by_plan',
    sourceLabel: nysDoh,
    publicSite: 'https://www.fideliscare.org',
  },
  {
    id: 'emblemhealth',
    name: 'EmblemHealth',
    programType: 'commercial',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyhpa.org/',
    sourceLabel: nyhpa,
    publicSite: 'https://www.emblemhealth.com',
  },
  {
    id: 'anthem-bcbs',
    name: 'Anthem Blue Cross and Blue Shield',
    programType: 'medicaid_mco',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.health.ny.gov/health_care/managed_care/plans/mcp_dir_by_plan',
    sourceLabel: nysDoh,
    publicSite: 'https://mss.empireblue.com',
  },
  {
    id: 'unitedhealthcare',
    name: 'UnitedHealthcare',
    programType: 'medicare_advantage',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyhpa.org/',
    sourceLabel: nyhpa,
    publicSite: 'https://www.uhc.com',
  },
  {
    id: 'aetna',
    name: 'Aetna',
    programType: 'commercial',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyhpa.org/',
    sourceLabel: nyhpa,
    publicSite: 'https://www.aetna.com',
  },
  {
    id: 'cigna',
    name: 'Cigna',
    programType: 'commercial',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyhpa.org/',
    sourceLabel: nyhpa,
    publicSite: 'https://www.cigna.com',
  },
  {
    id: 'oscar',
    name: 'Oscar',
    programType: 'marketplace',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.nyc.gov/site/doh/health/health-topics/health-insurance.page',
    sourceLabel: nycDoh,
    publicSite: 'https://www.hioscar.com',
  },
  {
    id: 'molina-affinity',
    name: 'Molina / Affinity',
    programType: 'medicaid_mco',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.health.ny.gov/health_care/managed_care/plans/mcp_dir_by_plan',
    sourceLabel: nysDoh,
    publicSite: 'https://www.molinahealthcare.com',
  },
  {
    id: 'mvp',
    name: 'MVP',
    programType: 'commercial',
    lastReviewed: REVIEWED,
    sourceUrl: 'https://www.health.ny.gov/health_care/managed_care/plans/mcp_dir_by_plan',
    sourceLabel: nysDoh,
    publicSite: 'https://www.mvphealthcare.com',
  },
];

export const nyMarketMeta = {
  lastReviewed: REVIEWED,
  noOfficeClaim: true as const,
  noContractClaim: true as const,
};
