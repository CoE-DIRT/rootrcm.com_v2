# ROOT V2 visual/asset parity register — 2026-10-31

**Approval baseline:** Figma `x5HJC3HjJNCCTUOwEdUc52`, Demo 6, approved deep-navy/electric-blue/neon-cyan system, glassmorphism, z-pattern hero, generous whitespace, accessible motion, responsive EN/ES + light/dark. Original Figma homepage `4:2` contains the approved copy hierarchy but not a production-ready photographic hero.

| Surface | Media / component | Source and ownership | Current status | Acceptance before external marketing |
| --- | --- | --- | --- | --- |
| Global navigation | ROOT logo lockup | Recovered `public/brand/mark.webp` (SHA-256 in `original-brand-assets.json`), used by `site-brand.tsx`, `icon.svg`, and `apple-icon.tsx` | Original bytes, native 250×243 | Header, footer, and favicon must keep that file. Do not redraw it. |
| Home hero `4:2`, tablet `4:153`, mobile `4:126` | Cinematic glass-masked illustration plus one editorial photograph | Original `public/media/root-revenue-hero.svg` and Pexels photograph `public/media/stock/practice-doctor-laptop.webp` (Ivan S, Free, retrieved 2026-10-31) | Illustration kept. Photograph is a labeled side frame, not a staff portrait. | Caption must stay readable. Do not imply the physician works for ROOT. |
| Services `4:40` | Hero media | Shared illustration plus the same labeled office-laptop photograph as the homepage | Mounted in `PageHero` | Not an endorsement and not a ROOT employee |
| Technology/DIRT `6:22` | Product renders and an editorial meeting photograph | Synthetic dashboards, shared hero illustration, and `public/media/stock/analytics-team.webp` (Yan Krukau, Free, retrieved 2026-10-31) | Photograph mounted in the technology hero only | Faces are mostly cropped. Caption must say they are not ROOT staff |
| Featured specialties | Clinically relevant cards and photos | Production specialty catalog; visual asset sources not fully supplied | Partial | Source/license/alt text per specialty, no invented client images |
| New York/NYC payer landscape | Public payer directory and `waveLower.webp` | Site catalog plus recovered brand wave, native 1600×138 | Mounted. No stock office photograph. | Keep the no-contract and no-office lines. Do not invent an address or payer contract. |
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
