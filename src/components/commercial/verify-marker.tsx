/**
 * Emits a literal <!-- VERIFY BEFORE LAUNCH --> HTML comment into the rendered
 * page so reviewers can find every unverified proof block in view-source.
 * Visible copy around it must never contain fabricated proof.
 */
export function VerifyMarker() {
  return <template data-verify="before-launch" dangerouslySetInnerHTML={{ __html: '<!-- VERIFY BEFORE LAUNCH -->' }} />;
}
