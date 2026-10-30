# ROOT V2 visual/asset parity register — 2026-10-31

**Approval baseline:** Figma `x5HJC3HjJNCCTUOwEdUc52`, Demo 6, approved deep-navy/electric-blue/neon-cyan system, glassmorphism, z-pattern hero, generous whitespace, accessible motion, responsive EN/ES + light/dark. Original Figma homepage `4:2` contains the approved copy hierarchy but not a production-ready photographic hero.

| Surface | Media / component | Source and ownership | Current status | Acceptance before external marketing |
| --- | --- | --- | --- | --- |
| Global navigation | ROOT logo lockup | Founder-recovered Demo 6 `/brand/logo.webp` and `/brand/mark.webp` (SHA-256 verified) | Restored | Header, footer, favicon and OG use originals; temporary favicon lockup retired |
| Home hero `4:2`, tablet `4:153`, mobile `4:126` | Cinematic glass-masked story still | Founder-recovered Demo 6 `/brand/story.webp` | Restored | Inspect screenshots at 375, 768, 1366, 2560; readable overlay and CTA |
| Services `4:40` | Hero media and specialty-specific editorial photography | Original current shared illustration; clinical photography approval pending | Shared illustration now | Distinct services media, professionally sourced and rights-vetted; no implied physician/client endorsement |
| Technology/DIRT `6:22` | Product renders, dashboard, transaction network imagery | Synthetic dashboards + shared hero illustration | Partial | Unique original product UI captures or generated art, synchronized with actual modules |
| Featured specialties | Clinically relevant cards and photos | Production specialty catalog; visual asset sources not fully supplied | Partial | Source/license/alt text per specialty, no invented client images |
| New York/NYC payer landscape | Geographic/context visuals | Site catalog and original design components | Partial | Avoid trademark misuse and avoid implying payer affiliation |
| Case studies/testimonials | Editorial image and proof cards | Genuine user-supplied evidence/permissions pending | Unpublished | Signed review, accurate anonymization and approved publication |
| Pricing/diagnostic | Offer illustration and conversion overlays | Current shared hero | Partial | Match canonical price catalog and deep-link CTAs; visual comparison for tiers |
| Customer dashboard/credentialing | Interactive synthetic product UI | Owned code and seeded fixtures | Implemented, refine | Accessible chart and timeline imagery; no real PHI or unverified status claims |
| Footer/social/company | Complete branded grid, social links, team photography | Figma and founder brand assets | Partial | Corporate media/people rights, social URL verification, accessible four-column layout |

## Art direction

- Use 12/8/4 responsive grid principles, 16–26px intentional radius scale and consistent shadcn/Radix semantics. Do not substitute random rounded rectangles for UI interaction design.
- Hero must have original or licensed image, transparent gradient/mask behind readable foreground copy, glassmorphic secondary panels, one primary CTA and reserved layout dimensions.
- Favor retina-quality original images optimized locally and contextually relevant photographic imagery; do **not** hotlink unlicensed third-party editorial photos.
- Respect `prefers-reduced-motion`, keyboard focus, touch targets, image contrast, responsive cropping and CLS target ≤0.05. Avoid photos of identifiable people without appropriate publishing rights.
- Use an asset manifest with local path, source URL/owner, commercial license, credit, model release when relevant, intended location, approval, dimensions, and alt text.
- Do not invent vendor logos, insurance partnerships, credentials, awards, customer identities, or staff headshots.

## Definition of visual completion

A reviewer should compare side-by-side screenshots with Figma plus Demo 6 at 375/768/1366/2560 in dark/light, EN/ES; each hero and important content section has coherent imagery with no broken or generic filler. The current feature PR achieves the **first local illustration and brand stage**, not the entire final media approval pipeline.
