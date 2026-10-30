import { priceCatalog, type OfferId } from '../content/catalog.ts';

/**
 * Canonical offer ids. There is no Enterprise SKU — Growth/Managed are
 * operations preview labels that map onto existing catalog offers.
 */
export const catalogOfferIds = [
  'free-account-consultation',
  'revenue-diagnostic',
  'managed-rcm',
  'dirt-intelligence',
  'credentialing',
  'custom-mso',
] as const satisfies readonly OfferId[];

export function isCatalogOfferId(value: string): value is OfferId {
  return (catalogOfferIds as readonly string[]).includes(value);
}

export function catalogHasEnterpriseSku(): boolean {
  return priceCatalog.some(
    (offer) =>
      offer.id.toLowerCase().includes('enterprise') ||
      offer.name.en.toLowerCase().includes('enterprise') ||
      offer.name.es.toLowerCase().includes('enterprise'),
  );
}

/**
 * Ops preview tiers (Free / Growth / Managed) are workspace labels, not SKUs.
 * They must resolve to catalog offers — never a fabricated Enterprise plan.
 */
export const previewTierCatalogOffers = {
  Free: 'free-account-consultation',
  Growth: 'dirt-intelligence',
  Managed: 'managed-rcm',
} as const;

export type PreviewWorkspaceTier = keyof typeof previewTierCatalogOffers;

export const offerFeatureCodes: Record<OfferId, readonly string[]> = {
  'free-account-consultation': ['basic_workspace', 'consultation'],
  'revenue-diagnostic': ['basic_workspace', 'consultation', 'diagnostic_report'],
  'managed-rcm': [
    'basic_workspace',
    'consultation',
    'rcm_dashboard',
    'credentialing_tracker',
    'managed_requests',
  ],
  'dirt-intelligence': ['basic_workspace', 'consultation', 'dirt_workspace'],
  credentialing: ['basic_workspace', 'consultation', 'credentialing_tracker'],
  'custom-mso': [
    'basic_workspace',
    'consultation',
    'rcm_dashboard',
    'credentialing_tracker',
    'managed_requests',
    'mso_reporting',
    'multi_location',
  ],
};

export function catalogEntitlementsForOffer(offer: OfferId): readonly string[] {
  return offerFeatureCodes[offer];
}

export function catalogEntitlementsForPreviewTier(
  tier: PreviewWorkspaceTier,
): readonly string[] {
  return catalogEntitlementsForOffer(previewTierCatalogOffers[tier]);
}

export function isPreviewWorkspaceTier(value: string): value is PreviewWorkspaceTier {
  return value === 'Free' || value === 'Growth' || value === 'Managed';
}

export const previewTierRows: readonly {
  tier: PreviewWorkspaceTier;
  offerId: (typeof previewTierCatalogOffers)[PreviewWorkspaceTier];
}[] = [
  { tier: 'Free', offerId: previewTierCatalogOffers.Free },
  { tier: 'Growth', offerId: previewTierCatalogOffers.Growth },
  { tier: 'Managed', offerId: previewTierCatalogOffers.Managed },
];
