import test from 'node:test';
import assert from 'node:assert/strict';
import { isStrictReviewApproval } from '../scripts/media/approval-predicate.mjs';

const approved = {
  approved: true,
  reviewer: 'editorial',
  licenseReviewedAt: '2026-10-31',
  peopleRightsReviewed: true,
  trademarkRightsReviewed: true,
  photoId: '42',
  licenseUrl: 'https://www.pexels.com/license/',
  sourcePageUrl: 'https://www.pexels.com/photo/example-42/',
};

test('string false is not media approval', () => {
  assert.equal(isStrictReviewApproval({ ...approved, approved: 'false' }, { requireProvenance: true }), false);
  assert.equal(isStrictReviewApproval({ ...approved, peopleRightsReviewed: 'false' }, { requireProvenance: true }), false);
  assert.equal(isStrictReviewApproval({ ...approved, licenseReviewedAt: 'soon' }, { requireProvenance: true }), false);
  assert.equal(isStrictReviewApproval({ ...approved, reviewer: '  ' }, { requireProvenance: true }), false);
  assert.equal(isStrictReviewApproval(approved, {
    photoIds: ['42'],
    licenseUrl: approved.licenseUrl,
    sourcePageUrl: approved.sourcePageUrl,
    requireProvenance: true,
  }), true);
});
