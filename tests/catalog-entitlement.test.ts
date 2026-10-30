import test from 'node:test';
import assert from 'node:assert/strict';
import { priceCatalog } from '../src/content/catalog.ts';
import {
  catalogEntitlementsForOffer,
  catalogEntitlementsForPreviewTier,
  catalogHasEnterpriseSku,
  catalogOfferIds,
  isCatalogOfferId,
  offerRequiresPayment,
  previewTierCatalogOffers,
} from '../src/domain/catalog-entitlement.ts';

test('canonical catalog has the six public offers and no Enterprise SKU', () => {
  assert.deepEqual(
    priceCatalog.map((offer) => offer.id),
    [...catalogOfferIds],
  );
  assert.equal(catalogHasEnterpriseSku(), false);
  assert.equal(isCatalogOfferId('enterprise'), false);
  assert.ok(priceCatalog.some((offer) => offer.priceLabel.en === '$2,500'));
  assert.ok(priceCatalog.some((offer) => offer.id === 'free-account-consultation'));
  assert.ok(priceCatalog.some((offer) => offer.id === 'managed-rcm'));
  assert.ok(priceCatalog.some((offer) => offer.id === 'dirt-intelligence'));
  assert.ok(priceCatalog.some((offer) => offer.id === 'credentialing'));
  assert.ok(priceCatalog.some((offer) => offer.id === 'custom-mso'));
});

test('ops preview tiers Free/Growth/Managed map to catalog offers, not Enterprise', () => {
  assert.equal(previewTierCatalogOffers.Free, 'free-account-consultation');
  assert.equal(previewTierCatalogOffers.Growth, 'dirt-intelligence');
  assert.equal(previewTierCatalogOffers.Managed, 'managed-rcm');
  assert.equal(
    catalogEntitlementsForPreviewTier('Free').includes('rcm_dashboard'),
    false,
  );
  assert.equal(
    catalogEntitlementsForPreviewTier('Growth').includes('dirt_workspace'),
    true,
  );
  assert.equal(
    catalogEntitlementsForPreviewTier('Managed').includes('managed_requests'),
    true,
  );
});

test('free vs premium catalog entitlements stay distinct', () => {
  assert.equal(catalogEntitlementsForOffer('free-account-consultation').includes('rcm_dashboard'), false);
  assert.equal(catalogEntitlementsForOffer('revenue-diagnostic').includes('diagnostic_report'), true);
  assert.equal(catalogEntitlementsForOffer('custom-mso').includes('mso_reporting'), true);
  assert.equal(catalogEntitlementsForOffer('custom-mso').includes('enterprise_reporting'), false);
  assert.equal(offerRequiresPayment('free-account-consultation'), false);
  assert.equal(offerRequiresPayment('revenue-diagnostic'), true);
  assert.equal(offerRequiresPayment('managed-rcm'), true);
});
