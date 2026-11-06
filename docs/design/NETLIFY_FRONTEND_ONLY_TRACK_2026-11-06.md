# ROOT V2 — NETLIFY FRONTEND-ONLY DESIGN TRACK (2026-11-06)

**Owner:** Netlify UI agent / frontend reviewer. **Source of truth:** Figma `x5HJC3HjJNCCTUOwEdUc52` (pages 01 Foundations, 02 Components, 03 Public Website, 04 Conversion and 06 Interaction Prototypes) + `reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html`. **Git branch:** `feat/netlify-figma6-public-ux-20261106`. **PR base:** `main`. **Production:** Appwrite SSR/identity/data, unchanged.

## Strict file ownership / no conflict with Claude
Netlify owns only the public frontend presentation layer:
- Allowed: `src/components/site/**`, `src/components/commercial/**`, `src/components/ui/**`, `src/app/globals.css`, public marketing page JSX under `src/app/[locale]/**` (ONLY routes listed below, excluding auth and dashboards), `public/media/stock/**`, scoped UI screenshot tests and `docs/design/**`.
- Allowed marketing routes: home, services, specialties, solutions, why-root, plans, technology, resources and company; visual-only account/sign-in *design suggestions* in separate preview routes/components not wired into auth. Never modify actual auth flows or consultation form submissions.
- FORBIDDEN: `src/server/**`, `src/integrations/**`, `src/domain/**`, `src/app/api/**`, `src/app/[locale]/dashboard/**`, `src/app/[locale]/sign-in/**`, `src/app/[locale]/account/**`, `src/components/forms/auth-form.tsx`, `src/content/auth-messages.ts`, `.env*`, migrations, secrets, Appwrite config, production redirects, CI/auth tests or backend adapters.
- Claude owns real auth/signup/reset/OAuth/server flows, dashboards, Appwrite, onboarding, integrations, API and CRM lead capture. No shared-file edits simultaneously. Pull separately, review and merge after backend P0 is accepted.
- `netlify.toml` provides Netlify *preview build only* using Next.js output `.next`; it does NOT change Appwrite or connect live credentials. Netlify may deploy SSR rendering functions strictly as preview runtime; never activate backend persistence, payments, CRM or real access. No DNS change.

## Figma design tokens (verified from HOME / Desktop / Dark node 4:2)
- Dark base `#061225`, surface `#0D2137`, raised surface `#132B45`, text `#F2F8FF`, muted `#9BB4CE`, cyan `#11E1EE`.
- Preserve existing CSS semantic `--bg`, `--surface`, `--surface-2`, `--text`, `--muted`, `--cyan`, `--border` and light equivalents from `src/app/globals.css`; do not paste Figma absolute dimensions into production.
- Existing approved brand originals and SVGs are locked for provenance. Replace only stale/unrepresentative *editorial* images after a new licensed image is downloaded, optimized, documented and visually approved; do not delete the originals from the repo until accepted.
- Mobile != mini-desktop. Preserve explicit mobile/tablet/desktop hero variants and distinct content priority.

## UI/UX scope and acceptance
1. Header/mega-navigation; compact accessible mobile drawer; rich footer; sticky CTA; correct keyboard focus and semantic link targets.
2. Immersive but restrained hero using 3D depth, parallax or CSS perspective progressively enhanced; accessible fallback, no heavy 3D/WebGL bundle, no Figma screenshot as background.
3. Public sections: 10 specialties, service scope, DIRT workflow, trustworthy evidence, pricing from `src/content/catalog.ts`, team roles from `src/content/team.ts`, supported platforms from `src/content/ecosystem.ts`, verified client proof from `src/content/credibility.ts`.
4. Team visuals: no fabricated headshots, no founder biography/photos without explicit approval. Testimonials/case studies: publish only `publishedProof` verified items; no invented testimonials, partner badges, statistics, percentages, or affiliations. Software is compatibility, NOT partnership unless verified.
5. Account/signup, Google/Microsoft providers and onboarding: design copy/wireframes only, pointing to actual Claude-owned routes. Never simulate successful login, enrollment, contact submissions, verification or billing.
6. Conversion: clear free consultation, `$2,500` Revenue Diagnostic and free workspace access differentiated. Public form still fails closed until Claude's durable Appwrite work is accepted; no false confirmation.
7. EN/ES complete (not just navigation), light/dark, accessible 48px targets, 375/768/1366/2560, keyboard, reduced motion, responsive images. Lighthouse mobile target >=90 in performance/accessibility/SEO/best practices and CLS <=0.05 where feasible; measure real preview, no fabricated ratings.
8. Review every resource/image for non-PHI, model implied endorsement and license. Use responsive WebP/AVIF with dimensions, sizes, priority only for LCP and no layout shifts. No auto-playing video, no giant JS-based hero.

## New stock-photo candidate sources: license verified; NOT YET DOWNLOADED OR INSTALLED
- Alena Darmel, `https://www.pexels.com/photo/people-having-a-meeting-at-the-office-8134104/` (Free) — office collaboration; candidate for team/operations editorial, not staff imagery.
- Thirdman, `https://www.pexels.com/photo/a-group-of-people-having-a-meeting-in-the-office-7652176/` (Free) — professional technology/workflow storytelling.
- Vitaly Gariev, `https://unsplash.com/photos/doctor-on-phone-working-on-laptop-in-office-egCFrNJ6Djw` (Unsplash free) — consultation illustration, not a clinician endorsement.
- Source Pexels license: https://www.pexels.com/license/ ; Unsplash: https://unsplash.com/license/ .
- Verify the exact image is not sponsored/premium, no readable PHI/case notes and the editorial appearance is suited to ROOT's no-endorsement stance. Download originals through approved source, optimize locally, commit file with photo ID, photographer, source URL, license link, license checked date and dimensions in a provenance manifest. Do not hotlink unsplash/pexels dynamic URLs in production.
- Existing ROOT editorial images already have provenance in `docs/design/free-media-sourcing-and-demo6-parity.md`; do not delete them as a batch.

## Deployment and integration gates
- Netlify site `exquisite-melomakarona-64bc7e` currently reports raw-ish static asset deployment (one generated page), not a complete Next app. Review Netlify **Project configuration > Developer settings > Continuous deployment > Build settings** and ensure Git-linked builds use repo root, `npm run build`, publish `.next`, Netlify automatic Next.js runtime. `netlify.toml` in this branch declares these; Netlify site settings/build linkage still require verification.
- Netlify UI work should produce a **separate design PR** into `main`, not push to Claude's `feat/eod-operations-dashboard-20261106`. If a Netlify agent cannot target this branch, do NOT let it run automatic source modifications on main or Claude's branch.
- Every cycle report changed paths, before/after screenshots, sizes, EN/ES/light/dark results, Lighthouse measurements and image provenance. No merge until review and approved Appwrite compatibility.
