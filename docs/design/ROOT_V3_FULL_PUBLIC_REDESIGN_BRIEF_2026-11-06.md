# ROOT V3 public experience — approved full redesign brief
November 6, 2026 | GitHub main now includes approved PR #80 (SEO/copy/storytelling). This redesign branch merges that work forward.

## Outcome
Completely rethink and rebuild public-facing UX and visual composition, not just polish cards. Preserve factual copy and SEO gains from PR #80. Figma Demo 6 is the minimum baseline, not an exact output ceiling. Reuse or modify existing Next.js/Tailwind components; no backend rewrite, no new website framework, no deployment/DNS migration.

**Locked:** ROOT original logo and mark (`/brand/logo.webp`, `/brand/mark.webp`), existing font stack and approved light/dark CSS colors/tokens, EN/ES and alternate mobile/desktop experiences, real Appwrite infrastructure, account/auth APIs, dashboards, roles and form/API contracts. Read `src/content/messages.ts` and `src/content/catalog.ts` rather than inventing copy or prices.

**Visual freedom:** full rebuild of hero, header, navigation, sticky mobile CTA, public page layouts, cards, section transitions, photography, intelligent product UI mockups, illustrations, typography scale/hierarchy while retaining type families, button designs, FAQ, and testimonials slots (only verified proof). Use Figma `x5HJC3HjJNCCTUOwEdUc52` and `reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html` as design baselines. The public site should read as a confident B2B healthcare SaaS and revenue-operations product, not a template.

## Narrative-first composition
- Desktop Z-pattern entry: brand + accessible navigation -> visual focus; first benefit + clear CTAs -> guided next-action.
- F-pattern for explainable RCM/credentialing and SaaS details; alternating zig-zag editorial sections.
- Single flowing home story: physician/practice pain -> what ROOT changes -> 3-step operating method -> services/specialties -> demonstrable synthetic platform -> audited workflow -> verified credibility -> transparent packages -> FAQs -> appointment/phone. Preserve deep-dive pages but make the home coherent and scannable, not a dozen unrelated card grids.
- Mobile must be intentionally **different**: compact nav, shorter approved copy variants, fewer stacked cards, priority CTA dock, staged disclosure and touch-first interactions. Keep 375/768/1366/2560 acceptance. Desktop can carry richer detail and carefully progressive visual depth.
- Motion/3D: lightweight CSS perspective, parallax, depth layers and immersive microinteraction only where performant; progressive enhancement, no obligatory WebGL, no blocking LCP, respect reduced-motion; AA keyboard/focus and contrast.

## Assets — archived, not wholesale deleted
- Source media inventory has been copied losslessly to `archive/pre-v3-public-media-2026-11-06/` on this branch. Original logo/mark remain in production paths.
- Unused `public/brand/banner.webp` and `public/brand/poster.webp` have been removed from public output; `public/brand/story.webp` is intentionally retained because **approved PR #80 uses it**. Existing referenced SVGs/stock remain until the redesigned components no longer need them.
- Netlify designer is free to replace editorial and decorative imagery. Use original or license-verified commercial stock (Pexels/Unsplash etc), optimize responsive local WebP/AVIF, include dimensions and image source/license/provenance manifest. No AI-made credentials, endorsements, patient imagery containing identifiable information, or stock people passed off as ROOT staff. Only delete original public assets once no code/tests reference them. Keep archive for rollback.
- No unverified logos, certifications, testimonials, affiliations, client statistics or case-study details. Software integration compatibility must not be presented as an endorsed partnership.

## Real CTA semantics
- Calendar: **existing active ROOT Calendly 30-minute meeting** `https://calendly.com/rootrcm-info/30min`, verified via connected Calendly. All **book/schedule consultation** CTAs should link to `/{locale}/consultation#book` where a proper Calendly booking component is mounted. Lazy-load third party on user action; provide a separate external link if iframe cannot load. No fake scheduling success. Do not require PHI or place it in event description.
- Telephone: **+1 (302) 496-5648** => `tel:+13024965648`. All explicit call CTAs must be actual telephone links, especially on mobile. Keep WhatsApp as separate optional channel.
- Existing `BusinessInquiryForm` remains available on consultation page, but do not modify its backend or claim submissions are durable until Appwrite lead write path accepted.
- Existing code in this branch provides `CalendlyBooking`, `HomeFaq`, and `MobileContactDock`; improve rather than duplicate. Comprehensive EN/ES FAQs on services, systems, scope, pricing, portal, safe data and next steps. Use semantic `details` or accessible accordion.

## Ownership and collision rules
- This Netlify frontend track works in `feat/root-v3-public-experience-20261106`; create a new agent branch based on it, never operate on `main` or Claude's `feat/eod-operations-dashboard-20261106`.
- Allowed frontend: `src/components/site/**`, `src/components/commercial/**`, public marketing routes/layout, `src/app/globals.css`, editorial content/copy with verified origin, `public/media/**`, `public/brand/**` EXCEPT approved mark/logo, public UX Playwright/Lighthouse tests, `docs/design/**`. Only presentation changes to sign-in/account; do not edit authentication logic, sessions, callbacks, or server.
- Forbidden: `src/server/**`, `src/domain/**`, `src/integrations/**`, `src/app/api/**`, `src/app/[locale]/dashboard/**`, `scripts/ROOT_V2_Provision_QA_Fixtures.ps1`, Appwrite site/auth, OAuth, CRM/payer/payment server logic, production DNS, PHI, real credentials. No simultaneous edits to Claude's files.
- Merge Netlify's UI PR via GitHub review then Appwrite builds approved main. Netlify is for preview only.

## Acceptance
1. Every public route retains semantic title, meta, structured data, internal linking and SEO gains from PR #80. No copy regression.
2. User-friendly visual hierarchy assessed in EN/ES dark/light at 375, 768, 1366 and 2560 pixels, with a separate intentional mobile composition.
3. Calendar reachable from all book CTAs; actual Calendly embed loads on demand, preserves privacy boundary; call CTAs use `tel:` links. No broken links or blank modal.
4. FAQ accessible and localized; screen reader headings, keyboard navigation, visible focus, contrast, reduced motion, touch targets >=44px.
5. No PHI, unverifiable marketing proof, fake live portal data, or broken Appwrite APIs/auth.
6. Measured Lighthouse target >=90 performance/accessibility/best practices/SEO on mobile and desktop; CLS <=0.05, verify LCP/INP and provide reports, not ungrounded claims.
7. Tests: npm ci, lint, typecheck, unit, Next build, Playwright marketing/auth smoke plus visual snapshots and asset references. Baseline existing repo tests that hardcode retired hero assets should be updated to assert the new behavior, not deleted.
8. Screenshots before/after for mobile/desktop, EN/ES, light/dark. A rendered preview is mandatory. No auto-merge.

## Current stage
- Approved PR #80 merged into main with merge commit `569e6a13777e483c1bb6c3eaa79ff0b5628eb8f4`.
- This redesign branch includes it via a merge commit and has archived pre-V3 editorial assets, Calendly booking, bilingual FAQs and mobile CTA dock as a *first vertical slice*.
- The complete visual overhaul, responsive acceptance and replacement imagery are **not finished**. Agent should directly implement those missing items rather than declaring this brief complete.
