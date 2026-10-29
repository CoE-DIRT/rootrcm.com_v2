# 08 — QA & Approval

## Demo 6 historical baseline
42 new QA checks; 26 regression checks; 39 routes at 12 widths (468 viewport states), and 58 default route states per locale with 98 visual-source IDs (as previously reported). These are **prototype results**, not tests of this newly initialized Next.js codebase or Figma native interactions.

## Release gates
- [ ] Figma contains all approved screens/variables/components and mapped node IDs.
- [ ] Mobile/tablet/desktop/ultrawide + EN/ES + light/dark visual QA.
- [ ] WCAG 2.2 AA manual keyboard, focus and screen reader checks.
- [ ] No tenant boundary weaknesses or inadvertent PHI collection.
- [ ] Stripe sandbox lifecycle and signed webhook tests.
- [ ] Appwrite role and session security; no secret in browser bundle.
- [ ] HubSpot contact/deal consent, dedupe and reconciliation.
- [ ] Verified evidence for all testimonials, partner logos, HIPAA/security and ROI claims.
- [ ] Real perf measurements: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; aim ≤0.05.
- [ ] SEO crawlability, canonical metadata, hreflang and sitemap for production public routes.
- [ ] Founder release approval, V1 redirects/cutover/rollback rehearsed.

**Never say Figma parity or production certification is complete without direct test evidence.**
