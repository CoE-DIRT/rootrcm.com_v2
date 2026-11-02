/**
 * One approval predicate for media review status and raw download.
 * The string "false" is not approval. Dates and provenance are required.
 */
const REVIEWED_DATE = /^\d{4}-\d{2}-\d{2}/;

export function isStrictReviewApproval(review, context = {}) {
  if (!review || typeof review !== 'object') return false;
  if (review.approved !== true) return false;
  if (typeof review.reviewer !== 'string' || review.reviewer.trim() === '') return false;
  if (typeof review.licenseReviewedAt !== 'string' || !REVIEWED_DATE.test(review.licenseReviewedAt)) return false;
  if (review.peopleRightsReviewed !== true) return false;
  if (review.trademarkRightsReviewed !== true) return false;
  if (context.photoIds && !context.photoIds.map(String).includes(String(review.photoId ?? ''))) return false;
  if (context.licenseUrl !== undefined && review.licenseUrl !== context.licenseUrl) return false;
  if (context.sourcePageUrl !== undefined && review.sourcePageUrl !== context.sourcePageUrl) return false;
  if (context.requireProvenance) {
    if (typeof review.licenseUrl !== 'string' || !review.licenseUrl.startsWith('https://')) return false;
    if (typeof review.sourcePageUrl !== 'string' || !review.sourcePageUrl.startsWith('https://')) return false;
    if (review.photoId == null || String(review.photoId).trim() === '') return false;
  }
  return true;
}
