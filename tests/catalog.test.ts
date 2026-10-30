import test from 'node:test';
import assert from 'node:assert/strict';
import { priceCatalog } from '../src/content/catalog.ts';
import { catalogHasEnterpriseSku } from '../src/domain/catalog-entitlement.ts';

test('one canonical price catalog with unique ids', () => {
  const ids = priceCatalog.map((offer) => offer.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.equal(ids.length, 6);
  assert.ok(priceCatalog.some((offer) => offer.priceLabel.en === '$2,500'));
  assert.equal(catalogHasEnterpriseSku(), false);
});
