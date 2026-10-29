import test from 'node:test';
import assert from 'node:assert/strict';
import { priceCatalog } from '../src/content/catalog.ts';

test('one canonical price catalog with unique ids', () => {
  const ids = priceCatalog.map((offer) => offer.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(priceCatalog.some((offer) => offer.priceLabel.en === '$2,500'));
});
