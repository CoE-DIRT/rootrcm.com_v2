/** Map fail-closed API codes to copy the page already has. Never surface the English server string. */
export function publicStatusMessage(
  code: string | undefined,
  copy: { inquiryUnavailable: string; checkoutUnavailable: string; generic: string },
): string {
  if (code === 'inquiry_submission_unavailable') return copy.inquiryUnavailable;
  if (code === 'checkout_unavailable') return copy.checkoutUnavailable;
  return copy.generic;
}
