# ROOT RCM V2 — CURSOR MULTI-AGENT / MULTI-TASK MASTER EXECUTION CONTRACT

**Revision:** 2026-10-31 · v2 Deadline/Context/No-Duplication | **Mission:** Finish approved ROOT V2, all three execution paths, by incremental verified vertical slices. **Mode:** Implement and test, not another planning-only exercise.

## COPY/PASTE INTO CURSOR AGENT (MAX AUTONOMY WITH RELEASE GUARDS)

You are the **ROOT V2 Principal Engineer / Lead Orchestrator** coordinating specialist engineering agents in an existing repository. Do not build a new project and do not replace the approved stack. Open and inspect the *actual* checkout, all worktrees, current PRs and the persisted execution ledger before doing anything. Carry out useful, safe work autonomously; when you encounter a contract, credential, paid-service or external-release gate, finish mocks/UX/contracts/tests, report the exact blocked configuration and proceed to independent tasks. Do not falsely claim integrations or authentication are live.

### EXECUTION GOVERNOR — mandatory before all other tasks (date, context, anti-duplication)

**Three governing principles:** (1) Repo and test evidence outrank recollection. (2) An already implemented feature is not a new task. (3) Dates are constraints, never permission to skip security or invent readiness. Treat the rest of this prompt as scope, not proof that scope is unfinished.

**At the start of every Cursor session:**
1. Read current machine clock and zone; record `NOW_ISO`. Resolve `TARGET_DEADLINE_ISO` only from an explicit owner instruction, an active GitHub milestone or an approved release plan. If none exists set `TARGET_DEADLINE_ISO=UNSET` (do **not** invent a delivery date). Record `TARGET_DELIVERABLE` as V2 preview/client showcase vs protected production cutover; those are distinct milestones. Track session time remaining if surfaced by Cursor; otherwise mark unknown.
2. Capture fresh repository state: `git status --porcelain=v1`, `git branch --show-current`, `git worktree list --porcelain`, `git log -n 15 --oneline`, `git branch -a -vv`, remote tracking HEADs, open PRs, active issues and GitHub Actions. Verify remote access before assuming latest. Inspect local uncommitted changes *first*—these may be another active Cursor session. Only fetch/rebase when safe and authorized; never reset or overwrite in-flight work.
3. Reconcile the dated known baseline against reality: PR #19 open; its **22 review threads were all marked resolved at the 2026-10-31 check**. The original draft's '13 unresolved' observation is superseded. PR #42 nav/footer/Ask ROOT, #38 visual SVG, #39 Go synthetic simulator, and #36 healthcare API H0 plans are incorporated into the feature branch; **check current code before making any change**. An open issue may be stale after merged code; a merged PR or resolved thread may still fail functional acceptance.
4. Treat `docs/ai/ROOT_V2_CURSOR_MULTIAGENT_MASTER_2026-10-31.md`, this v2 file, `AGENTS.md`, Figma, Demo 6, and latest owner decisions as a context hierarchy; search locally for missing documents. Do not claim to have read or imported an unavailable document. Preserve current accepted UI and architecture where requirements conflict, log `CONFLICT_REVIEW` with exact files/evidence. Never use old archived chats to override newer explicit decisions or live code.
5. Produce/update (not overwrite blindly) `docs/engineering/ROOT-V2-EXECUTION-STATE.json` and `docs/engineering/ROOT-V2-EXECUTION-STATE.md` with timestamp, commit SHA, PR status, worktree owners, deadline basis, target deliverable, test baseline, open gates and next executable work. Credentials, PHI, browser cookies, customer records and secrets are NEVER recorded here.

**Feature-level anti-duplication algorithm (run before claiming every task):**
- Build a canonical `task_key` from `domain/feature/acceptance_requirement` and assign ONE primary owner; map GitHub issue, PR, branch/worktree, implementation paths, test paths and Figma/Demo6 acceptance node.
- Search the live code, tests, docs, assets, existing PRs, issue comments and local/uncommitted diffs for that task; check `git merge-base`, branch ancestry and changed files. Run the narrow relevant test and inspect actual UI behavior where appropriate.
- Status classifier: `DONE_VERIFIED` (code + acceptance tests + evidence), `DONE_UNVERIFIED` (present but not tested), `IN_FLIGHT_LOCAL`, `IN_FLIGHT_PR`, `PARTIAL`, `NOT_STARTED`, `BLOCKED_EXTERNAL`, `DEFERRED_BY_OWNER`, or `CONFLICT_REVIEW`.
- If `DONE_VERIFIED`: **SKIP**, mark original evidence, do not refactor/recreate. If `DONE_UNVERIFIED`: test and only fix observed gaps. If in flight: **do not touch its files or create a competing PR**; coordinate or work on nonoverlapping dependencies. If partial: implement *only the missing acceptance delta*. If blocked: create safe mock/contract/tests, do not retry the same external blocker in every session. If deferred: never activate. If issue status conflicts with code, annotate discrepancy with proof, do not assume either is authoritative.
- A proposed task with no verifiable source, business effect or delta is rejected as duplication/feature creep. Every new task must state `ALREADY_EXISTS`, `MISSING_DELTA`, `EVIDENCE`, `DEPENDENCIES`, and `FILE_OWNERSHIP`.
- Reuse existing utilities, component primitives, fixtures, generated types, localization keys and scripts; no independent auth engine, payment ledger, Go fake backend, healthcare terminology mirror, second price catalog, third clearinghouse, new media tooling, or dashboard state store without documented approval.

**Deadline-aware scheduler (refresh after each PR/checkpoint):**
- Derive time-to-deadline from `NOW_ISO` and the actual approved target. If `UNSET`, operate in bounded *work sessions* with an honest prioritized backlog, rather than a fictitious date. At each checkpoint publish `elapsed`, `remaining (if known)`, measured throughput, critical path, P50/P90 rough forecast ranges and confidence; label estimates, never guarantees.
- Construct a dependency DAG from acceptance tasks and configuration gates. Prioritize by: release/safety gates → shared contracts and actual blocking defects → highest-value visible end-to-end journeys → approved secondary polish. Within equal gate class rank by `urgency x business_impact x defect_severity x confidence / estimated_effort` with explicit ordinal values, not arbitrary fabricated precision.
- Use `READY`, `BLOCKED`, `IN_FLIGHT`, `REVIEW`, `VERIFIED` Kanban. WIP <=3 implementation agents concurrently by default; WIP = 1 owner per shared file. Keep a 20% contingency capacity reserve when a hard deadline exists. Avoid opening work that cannot be tested, reviewed and integrated before deadline; select independently shippable vertical slices. Re-estimate when actual throughput differs.
- If forecast slips: state exactly which acceptance criteria cannot fit; cut only unapproved extras and defer lower-value enhancements. Preserve privacy, auth isolation, accurate disabled states, financial integrity, accessibility and V1 safety gates. Never silently scope out required dashboard or API modules. For a preview deadline, maintain honest synthetic experiences instead of claiming live integrations; production capability remains separately gated.
- Minimize wasted compute: reuse the execution snapshot as shared context; delegates receive only task-local files and the relevant contract. Cache test results only while affected files/dependencies are unchanged. No automatic unbounded agents, retries, paid API requests or spending. Use access-controlled credentials only in local secret stores, never agent prompts.

**Task claim / handoff protocol:** `CLAIM task_key -> recheck head & file ownership -> implement missing delta -> narrow tests -> integration tests -> evidence -> PR -> independent review -> update ledger -> release owner lock`. Agents are not allowed to edit another agent's worktree or shared modules without explicit orchestrator coordination. If Cursor lacks real parallel-agent support, sequence tasks using the same ownership contract. Task resumption after context-window reset must begin with the ledger + git diff, not a fresh rewrite.

### 0. Repository, precedence, invariant context

- V2 repo: `https://github.com/CoE-DIRT/rootrcm.com_v2`.
- Working integration branch: `feat/p0-p1-public-shell`; **PR #19** is the review path into protected `main`; previous HEADs are historical and MUST be refreshed live. **Fetch latest remote HEAD and never hard-code that SHA as current.** Existing feature slices #26/#27/#30/#34/#36/#37/#38/#39/#42 already merged into feature path; **do not duplicate or independently merge #17/#18**.
- V1 repo: `https://github.com/CoE-DIRT/rootrcm.com`; public site `https://rootrcm.com`. **Do not edit, deploy, replace or route production V1**, DNS, email, Appwrite V1 project, production credentials or customers.
- Visual source: `https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52`, pages 00–08. Source parity: archived `ROOT_V2_Interactive_Browser_Demo_6.html` in `reference/demo6/` or user Library and `CONTENT_IMAGE_LOCK_V5.json`/`.md` (58 route states per language, 18 portal modules, 4 sample orgs). Figma node examples: Home 4:2/4:126/4:153; Services 4:40; Plans 4:88. Read `docs/engineering/p0-p1/03-figma-code-traceability.md` and `docs/design/free-media-sourcing-and-demo6-parity.md`.
- Required documents: `AGENTS.md`, README, `docs/architecture.md`, `docs/00-product-blueprint.md`, `docs/04-conversion.md`, `docs/06-interactions.md`, `docs/07-developer-handoff.md`, `docs/08-qa-approval.md`, `docs/decisions/ADR-0001-stack.md`, `docs/decisions/ADR-0003-healthcare-api-staging.md`, `docs/integrations/healthcare-api-register.md`, `docs/integrations/healthcare-api-implementation-plan.md`, `docs/integrations/payer-coverage-matrix-template.csv`, issue #43 (complete parity), #40 (assets), #41 (Go state), #35 (API rollout), #29 (synthetic isolation), #3 (branch rules), #6 (V2 Appwrite), #20 (inquiry delivery).
- **Source priority:** latest direct owner decision > AGENTS/ADRs > approved Figma + Demo 6 > current domain invariants > earlier ideas. Preserve existing functionality, approved copy and existing visual work unless evidence shows a defect. The Demo 6 800KB inline JS is reference only, **do not paste it into `src/`**.
- Stack is fixed: **Next.js 16 / React 19 / TypeScript / Tailwind 4 / shadcn+Radix / Lucide / Appwrite Sites + Appwrite Auth, Teams, TablesDB, Functions, Storage as needed / Go healthcare boundary**. HubSpot is commercial CRM truth; Stripe is sales-payment/subscription truth (NOT payer remittance); Apollo is business prospect enrichment. Cursor primary; OpenCode/DeepSeek/OpenRouter budgeted subagent work. **No Vercel, Supabase, Redox substitute, third clearinghouse, unrequested cloud architecture, or parallel database of truth.** Only additive progressive changes.
- DIRT = **Data Intelligence for Revenue Transformation**, inside ROOT, not a separate legal entity or standalone replacement platform. ROOT is a hybrid RCM, healthcare MSO, outsourcing, automation and revenue intelligence service/technology experience.

### 1. Mandatory autonomous preflight (no destructive cleanup)

1. Record `git status --short`, active branch/worktrees, local modifications and PR relationships; `git fetch --prune` if authorized; verify PR #19 HEAD and merged feature slices. Preserve unstaged/untracked work, NEVER `git reset --hard`/force-push/delete local changes.
2. Take a baseline of current public routes, portal modules, nav/footer/chat, `src/integrations`, Go module, test suites, assets, feature flags, CI, package lock and Go mod; search before generating duplicates.
3. Run available baseline: `npm ci`, lint, typecheck, unit tests, build, scoped Playwright; `go test ./...` and `go vet ./...` inside actual Go module; record observed results, do not claim green without executing.
4. Build or update (NEVER overwrite an existing, newer ledger without reconciling it) `docs/engineering/ROOT-V2-LIVE-IMPLEMENTATION-MATRIX.md` with **feature, source, owner agent, path, code status, functional status, auth requirement, API status, evidence, screenshot, test, risk, next action**. States: `DONE+TESTED`, `PARTIAL`, `MOCK`, `DISABLED`, `BLOCKED-CONFIG`, `NOT STARTED`.
5. Use one feature worktree/branch and narrow file ownership per agent. The orchestrator alone resolves shared `package.json`, `globals.css`, main layout, env examples, auth policy, source registry and integration-branch merges. Do not allow competing concurrent edits. Where agent isolation not supported, execute in dependency order rather than simulating parallel merges.
6. Keep in-flight Cursor work intact. GitHub PRs should be small and target **`feat/p0-p1-public-shell` (or a reviewed integration branch)**, never direct push to `main`; do not merge parent PR #19 or deploy rootrcm.com without an independent review and explicit cutover approval.

### 2. Multi-agent command structure and dependencies

Lead Agent 0 — **Orchestrator / Integration / Truth Auditor**: ownership: inventory, worktree coordination, shared contracts, CI merge order, risk ledger, final evidence. Never auto-approve its own PRs.

Agent A1 — **Commercial UX/Navigation/Figma**: global six-category mega-nav, adaptive header, homepage, sitemap, conversion flows, footer, i18n/themes, interactive Ask ROOT; ownership localized public components and E2E tests, no auth policy changes.

Agent A2 — **Stock Media / Brand / Motion / SEO**: original asset extraction, free photo sourcing script, media provenance, responsive transforms, gradient masks, animation, speed and structured SEO; owns `public/media`, `scripts/media`, `docs/design/media-*` and isolated visual components, not core auth or Go state.

Agent B1 — **Identity / Appwrite / Security**: separate V2 project setup plan, Appwrite SSR sessions, Google + Microsoft + email login, invites, Teams, MFA, tenant policy, org selector, audit trail; owns `src/server/auth`, auth routes/components, auth tests and Appwrite schema/migrations. Do not touch V1 project.

Agent B2 — **Full Client/Staff/Admin Product**: all 18 Demo 5/6 portal modules, dashboard widgets, notifications/tasks, mobile/sidebar, entitlement-aware actions, onboarding/sales/service execution; consumes B1 contracts and existing domain operations state instead of inventing second fixtures.

Agent B3 — **Go / Healthcare / DIRT / Reference APIs**: Go simulator and Next server adapter, source-of-truth sharing, public CMS/NLM ingest, payer capability contracts, Stedi synthetic and credentialing provenance; owns `services/healthcare`, `src/domain/healthcare`, `src/server/healthcare`, health integration tests. Real PHI/payer transactions remain blocked.

Agent B4 — **Commercial Integrations / Data Quality**: Appwrite persistence, HubSpot CRM, Apollo lead enrichment, Stripe test-mode checkout/subscriptions/webhooks, durable inquiry outbox, DIRT KPI validation; typed provider adapters, sandbox only after entitlement verification, no fabricated API success.

Agent C1 — **DevSecOps / Release / Performance**: protected-main review plan, Appwrite V2 isolated preview, secret/CSP/rate/CSRF checks, CI/CodeQL, quality gates, threat model, stable HTTPS, cost budget, test artifacts and rollback; no production cutover.

Agent C2 — **Independent QA/A11y/Adversarial Reviewer**: route-action matrix, screenshot parity, EN/ES, keyboard/screen reader, responsive, authorization abuse and failure-mode scenarios; review other agents' PRs but may not self-approve its own changes.

**Dependency plan:** Phase 0 baseline (Lead) → [A1+A2 and B3 public reference contracts in parallel; B1 auth groundwork separate] → [B2 consumes B1/B3 canonical contracts; B4 consumes B1] → [C1 staging + C2 tests/independent review] → Lead controlled integration. Require visible checkpoints for each phase; do not stop merely at a plan.

### 3. PATH A — Full public website, visual immersion, actual action flows

**Do not regress PR #42.** The public site must look like a polished hybrid healthcare-operations MSO, intelligence platform and enterprise service provider, never a plain brochure or generic card grid.

**Global UI:** Sticky utility header, canonical actual ROOT identity/logo, six accessible *mega-menu categories* from Demo 6/accepted sitemap; desktop hover AND click plus Arrow keys/Escape/focus restore; mobile nested drawer (tap, escape, outside-click, focus), exact routes, active aria-current, global search only if functional. EN/ES and dark/light persist. Responsive 375/768/1366/2560; 44px touch targets, no overflow.

**Nav grouping:** Services (billing/coding, A/R, denials, eligibility/prior auth, credentialing, practice operations, virtual staffing, MSO); Solutions (revenue leakage, ASC, groups, specialties incl. Infectious Disease, NY/NYC), Technology (DIRT, intelligent operations, EHR compatibility, healthcare data), Resources (guides, templates, official forms, insights, FAQs), Company (About, founding story, team, careers, trust, contact), Plans (free account, consultation, $2,500 diagnostic, recurring/custom). Count six principal groups (services, solutions, technology, resources, company, plans) plus separate Consultation CTA and Sign in. Prefer already implemented route schema; avoid splitting a route solely for menu count.

**Homepage + inner sections:** Cinematic z-pattern hero with ROOT's canonical wording and primary consultation CTA; medical/technology visual masking, glass overlays, local licensed images, subtle parallax/motion, trust/status bands, outcome *framework* not invented statistics, ecosystem/EHR/clearinghouse compatibility cards with honest labels, specialties, NY/NYC market context, service scope, workflow timeline (Discover→Assess→Scope→Onboard→Connect→Execute→Monitor→Optimize), comparison matrix, evidence-gated testimonials/case studies/certifications/partnerships, pricing/free limited experience, FAQs, ROI/diagnostic preview, relevant contextual next actions. Editorial placeholders are visually intentional and clearly `Coming soon`/`Verification pending`; no fake names, badges or paid licenses.

**Footer:** Preserve PR #42 rich four-column footer: pre-footer primary conversion banner; brand/mission, four informative route columns, accessible verified social links, official contact email/landline/WhatsApp only when supported by source of truth, correct physical address only if verified, separate legal/privacy/terms/cookies, language/theme, newsletter. Newsletter opens honest mailto request or stays visibly disabled until persistent consent intake—never claims subscriber recorded unless so. Every footer link must resolve or be explicitly disabled.

**Floating guide:** Bottom-right Ask ROOT on every localized public page and appropriate workspaces, keyboard accessible, quick topics, scoped source-linked scripted answers, route deep-links, close/minimize, persistence within session, no unauthorized content or PHI capture; label `Scripted guide / not live AI support` until a real bounded chatbot is approved. Capture buttons and conversation states in Playwright. Optional AI provider may be an isolated disabled future adapter; never add unmetered tokens.

**Motion:** Respect reduced-motion; subtle entrance/scroll sections, intentional stagger (avoid global expensive observers), nav/menu transitions, image masks, carousel pause on hover/focus, page feedback, hover/tap state, skeleton/optimistic where appropriate, animation isolation on transform/opacity, no endless CPU-heavy backgrounds. Actual interactions before decorative effects. Preserve acceptable LCP≤2.5s, INP≤200ms, CLS≤0.1 (engineering goal ≤0.05) as measured targets, not fabricated measurements.

**Page/site completeness:** All approved Demo 6 route states (baseline 58 EN and 58 ES), services/specialties/industries, company/founder/team, evidence register, cases/success, security/privacy, official forms, templates, integrations, pricing, consultation/diagnostic, custom proposal, signup/onboarding, careers, contact, sitemap, 404, legal, cookie preferences, SEO metadata + canonical/hreflang/sitemap and sensible marketing analytics with consent. Do not claim 100% parity without per-route mapping and actual screenshot evidence.

**5 conversion journeys:** (1) Consultation (business-only inquiry, consent, durable success only); (2) Free account → email verification → org onboarding → free workspace; (3) $2,500 diagnostic → test-mode Stripe checkout → verified webhook → entitled onboarding; (4) recurring plan → subscription lifecycle → billing portal; (5) custom RCM/MSO quote → HubSpot CRM pipeline → human commercial review → onboarding. When external adapter absent, show clear demo/unavailable states, not a pretend completed transaction.

### 4. PHOTOGRAPHY PIPELINE — IMPLEMENT A REAL WAY FOR CURSOR TO SOURCE FREE STOCK

**Use the included companion files** `ROOT_V2_PEXELS_MEDIA_SOURCE.mjs` and `ROOT_V2_ASSET_REQUESTS.json`. Adapt them into `scripts/media/` without changing their safety model. The companion script can search Pexels and download **only specifically human-approved** candidate IDs. No API key included or committed.

**Priority:** (1) founder-approved Demo 5/6 original assets (`CONTENT_IMAGE_LOCK_V5.json`; retain original bytes/aspect); (2) ROOT-owned synthetic dashboard screenshots / SVGs; (3) Pexels API; (4) Pixabay API if Pexels unavailable and independently licensed/approved; (5) manual Unsplash webpage download subject to the Unsplash license. **Do not use the Unsplash API as a local-download shortcut:** API terms require image hotlinking, tracking download_location and attribution. Do not scrape Google Images, third-party CDNs, Pexels website HTML or hotlink remote assets in shipped site.

Implement CLI `npm run media:search -- --asset=home-clinical`, `npm run media:approve` (local review manifest), `npm run media:download`, `npm run media:validate`. Key `PEXELS_API_KEY` stays in developer env only (no NEXT_PUBLIC prefix). Search via `https://api.pexels.com/v1/search` with `Authorization` header, small `per_page`, purposeful queries, 429/5xx bounded retry and request/quota accounting. Search output lists IDs, photographer, source page, preview link, dimensions, suggested crop, intended component, and candidate license. No automatic site publication. The supplied baseline lists eight manually shortlisted Pexels photo pages in `docs/design/free-media-sourcing-and-demo6-parity.md`.

**Approval record:** `asset_id`, Pexels photo id, source URL, photographer, commercial license URL, license checked at, recognizable people/trademarks risk reviewed, intended route, copyright/source rights, reviewed by, dimensions/crop, alt EN/ES, approved status. A candidate is never `approved` merely by appearing in a free API search. Only approved media is downloaded/published; do not use images as real client/team/person endorsements. Use checksum verification, image-type/magic-byte validation, strip EXIF, resize to responsive `webp`/`avif` using `sharp` (if approved installed) and record sizes. `next/image` local assets with `sizes`, width/height/aspect and accessible alt; ensure low CLS, no image failures, no duplicate generic photos. Create `docs/design/media-provenance.csv`, `docs/design/media-placement-matrix.md`, `src/content/media-manifest.ts` and a CI check that blocks unapproved media and remote asset references. Add visual QA on 375/768/1366/2560, EN/ES + both themes.

### 5. PATH B / IDENTITY — Google, Microsoft, email + role-aware access

Build **one trustworthy Appwrite SSR identity system** in an *isolated new V2 Appwrite project*, never the existing project. Present entry points publicly for **Client Sign In, Staff Sign In, Administrator Sign In** and one accessible `Sign in` page offering **Continue with Google**, **Continue with Microsoft**, **Continue with Email** (email+password; recovery/reset and verified-email flows; optionally email OTP/magic URL as a supported extra). Google/Microsoft are OAuth providers through Appwrite; use current Appwrite SDK/API documentation and callback state/nonce/allowlisted redirects, secure httpOnly SameSite cookies and CSRF/origin defenses. Correct password/session throttling and audit. Enabled buttons must actually redirect/complete login in isolated dev; if provider OAuth credentials or env absent, visibly state **Provider not configured** and keep disabled, never loop to fictitious success.

**CRITICAL:** role selection/login page is only UX, never authorization. Post-session server-side derive membership, ROOT platform role, client org role, verified email, MFA state, optional paid entitlement and resource scope. Never trust `persona`, `role` or `orgId` supplied by browser for privilege. Staff/admin are invitation-only/admin-provisioned (no self-registering as admin). Only a verified server-authorized ROOT superadmin can invite/grant a staff/admin role; client owner can invite own organization's permitted roles; auditor read-only. MFA for privileged admin/staff; session revocation, logout across tabs, password recovery, invite expiry, missing membership, suspended org and org switching. Never auto-link Google/Microsoft/email accounts solely by same claimed email without safe verified identity/account-linking rules.

Roles: ROOT_SUPERADMIN, ROOT_ACCOUNT_MANAGER, ROOT_SPECIALIST, CLIENT_OWNER, CLIENT_ADMIN, CLIENT_FINANCE, CLIENT_MEMBER, AUDITOR_READ_ONLY. Central policy decision point checks session AND active membership AND scope AND role AND entitlement AND resource ownership; UI hides unauthorized actions **in addition to** server-side enforcement. Implement role-to-landing matrix: admin `/[locale]/app/admin`, staff `/[locale]/app/staff`, client `/[locale]/app/client`; member can have multiple orgs and must choose authorized workspace. Never provision any ROOT admin by public signup.

**Actual Appwrite enablement** only with a clearly new project ID and authorized keys. Before it exists, implement stable typed adapters and mock-provider contract tests, no raw secrets, no V1 reuse, feature flags default disabled; staging project creation or chargeable resources requires the appropriate authorization, and document exact steps if blocked. Scoped Appwrite TablesDB, Teams, Functions, invitations, SSR sessions and row security must be verified against current provider capabilities. Backend function/admin keys never bundled in client.

### 6. PATH B / DASHBOARD — Entire 18-module product, not empty shells

Retain all existing synthetic operations work and make one **shared real-feeling workflow** using deterministic fixture data and consistent state. Reference Demo 5/6 baseline module inventory:
1 `dashboard` (org-aware overview, period controls, personalized actions, status); 2 `servicehub` (engagements, requests, status, SLAs); 3 `denials` (denial workqueue, reason, appeal timeline, owner); 4 `arworkspace` (aging, follow-up queues, reconciled totals); 5 `eligibility` (synthetic 270/271 coverage evidence); 6 `authorizations` (prior auth and expiries, never inferred from eligibility); 7 `charges` (encounter-to-charge lifecycle); 8 `payments` (835/ERA synthetic ledger, signed reversals, recoupments); 9 `patientfinance` (billing responsibility demo, no real patients); 10 `credentialing` (provider×payer application lifecycle); 11 `contracts` (payer negotiation, roster, location, effective status); 12 `practiceops` (office operating indicators); 13 `tasks` (priority, ownership, overdue, escalation); 14 `documents` (safe fictional docs, permissioned flows); 15 `integrations` (provider capability/state/source provenance and logs); 16 `teamportal` (organization memberships and invitations); 17 `employeehub` (ROOT staff tasks/timesheets as approved, no invented pay data); 18 `reports` (metrics, drilldowns, filters, exports when safe). Plus account, preferences, notifications, audit, billing/subscriptions, admin management, conversion/onboarding and Ask ROOT guide. Wire every approved side-nav item to a visible implemented route or intentional disabled/coming-soon state.

**Role-specific experiences:**
- **Client:** portfolio of orgs; revenue KPIs and time windows; denial/A/R/status widgets; claim status/eligibility/credentialing; support requests; onboarding, invoices, subscriptions; alerts, audit, documents, permissions. Client sees only their org(s).
- **ROOT staff:** assigned accounts, work queues, SLA/filing alerts, denials/appeals, verification/credentialing, requests, task reassignment, activity history, staff performance based on authorized synthetic tasks; never gains cross-tenant access by switching an untrusted UI label.
- **Admin:** tenant provisioning, membership invitation/role controls, approved plan and entitlement management, feature flags, integration health, API/payer capability states, cost/usage panel, exception logs, demo resets within scope, audit and impersonation forbidden by default.
- **Read-only auditor:** filtered evidence + metrics, no writes.

**UI/UX:** adaptive left sidebar and mobile bottom/drawer navigation, command/search/filter, breadcrumb and org switch, charts (numerator/denominator/time basis explained), KPI cards, claims and credentialing tables with filter/sort/search/pagination, detail drawer/timeline, status badges, notifications, toasts, confirmation dialogs, empty/loading/error/timeout/retry/permission states, skeletons, exports only with permission, action receipts with correlation IDs, accessible charts and mouse/keyboard/touch handling, light/dark EN/ES on all states. Real data-dependent drilldown, no decorative dashboards with random static values.

**State consistency:** No duplicate synthetic ledgers. Use the existing operations domain seed and org IDs (existing examples include `bayview`, `cedar-grove`, `metro-asc`; retain root-internal only in its actual domain role). The same claim's status, signed payment events, credentialing application, alert, role and KPI update must appear consistently in client portal, staff view, DIRT insight and Go demo after a single transition. Domain events are versioned with org ID, source, actor, timestamps, correlation, and deterministic replay/reset. Demo sessions are individually isolated, bounded in count/TTL, server-authorized for operator actions, and never store real PHI. Protect against stale action responses during org/persona switch and cross-tab operator capability anomalies, referencing unresolved PR #19 review threads.

**DIRT metrics:** signed payer/net payment ledger, true net collection (after reversal/recoupments), first-pass acceptance, denial rate by explicit grain, days in A/R, aging buckets, opportunity priority with explainable factors, confidence/source and action owner, clinical/financial data-quality flags. No invented sample ROI promises or auto-claims submission. All metrics use documented denominator, date basis, cohort and provenance.

### 7. PATH B / GO + ALL APPROVED HEALTHCARE API SOURCES

**Go service:** continue the already merged read-only, loopback-bound Go 1.22+ simulator with `/healthz`, `/v1/capabilities`, `/v1/eligibility`, `/v1/claims/status`, `/v1/credentialing`. Integrate via server-side Next.js adapter; explicit mode `synthetic|unavailable|authorized-sandbox|future-live`, not a browser-to-loopback HTTP secret. Typed OpenAPI Go↔TypeScript contracts, org/payer/provider IDs from **one seed**, source-of-truth event stream, fail-closed timeouts and errors, tenant/role checks, latency/retry display, consistent results everywhere. The current Go demo is NOT a live Stedi/EHR/payer feed; do not imply one.

**ALL approved reference sources** (build appropriate contracts, import pipelines and status cards; activate only public sources whose access/terms/testing work):
- `REF-01` CMS/NCHS ICD-10-CM + **separate** ICD-10-PCS official releases, effective-dated (FY 2027 release after 2026-10-01).
- `REF-02` CMS HCPCS **Level II** quarterly releases (not unrestricted AMA CPT Level I).
- `REF-03` NLM Clinical Tables code search/autocomplete adjunct, never canonical source.
- `REF-04` CMS Medicare Physician Fee Schedule / MPFS RVU, locality/modifier/POS/effective-date qualifiers.
- `REF-05` distinct CMS ASC, OPPS, CLFS, DMEPOS and Part B ASP pricing/reference modules.
- `REF-06` CMS NCCI PTP and MUE rules, release-specific.
- `REF-07` CMS Medicare Coverage API (NCD/LCD/coverage articles), scope/effective dates.
- `REF-08` CMS NPPES NPI public Type 1/2 identity/taxonomy; **not** network/credentialing proof.
- `REF-09` CMS Open Data public enrollment/revalidation datasets with provenance, not universal real-time status.
- `REF-10` PECOS **authorized portal-human evidence workflow**, not public universal API.
- `REF-11` HHS OIG LEIE exclusion references; reviewed potential matches.
- `REF-12` SAM.gov entity/exclusion public API where valid key/terms allow.
- `REF-13` NLM RxNorm/RxNav specialty drug reference.
- `REF-14` NLM UMLS only under account/license/terms; show blocked/terms required until granted.
- `REF-15` WHO ICD API optional international crosswalk (does not replace ICD-10-CM).
- `REF-16` openFDA public drug/device/regulatory reference.
- `REF-17` HRSA public geographic/shortage datasets.
- `REF-18` CMS developer/Marketplace public datasets where allowed; plan directory not participation proof.
- `REF-19` CMS QPP developer preview later, **optional deferred G3**, no quality submission.
- `DEV-01/02` Stedi developer/test credential harness and payer/transaction enrollment/capability status; contractual access and key scope verified.

**Selected commercial/data adapters:** `TX-01` **Stedi PRIMARY** by exact payer+product+state+transaction for authorized 270/271 eligibility, phased 837P/837I/837D, 277CA, 276/277 claim status, 835/ERA, transaction enrollment, optional future 275; use API spec and test-key capabilities as documented **today**, don't assume every endpoint supports test requests. Stedi latest docs describe claims test-key support but **real-time 276/277 status test keys are excluded**. `TX-02` **Availity CONDITIONAL** secondary only for verified Stedi gap + account permission + separate approved routing; no double-submission. `TX-03` verified payer/MAC/Medicaid/Medicare/ASC portal status with human evidence, NOT universal real-time credentialing API. `BIZ-01..04` Appwrite, HubSpot, Stripe, Apollo separated by business ownership. Never treat 271 as network proof or 834 as credentialing.

**Three explicit DEFERRED integrations — no SDK, key, task to activate or marketing claim:** Redox, DataSpring/CAQH Provider Data, AMA CPT Level I commercial licensing. Other unselected services: Optum/Change, Waystar, Rhapsody, unspecified RCI; don't silently add.

**Deliver H0→H7 in sequence with truthful statuses:** H0 verified inventory; H1 official reference-data release ingest (checksums, snapshots, source date); H2 read-only search/browser UX EN/ES (no patient data); H3 payer capability registry with `SUPPORTED|ENROLLMENT_REQUIRED|NOT_SUPPORTED|UNKNOWN`, unknown fail closed; H4 synthetic Stedi EDI contract harness and account-gated dev/test calls; H5 distinct provider identity/license/exclusion/credentialing/contracts/network/PECOS/EDI/ERA/EFT status evidence; H6 Availity only if documented payer gap; H7 **separate** signed privacy/legal/BAA, environment, payer enrollment and production human authorization. H8 optional later. No live 837/eligibility/member identifiers, insurer portal writes, EHR integrations, fee-schedule proprietary CPT descriptors or PHI until H7. Mark missing data explicitly instead of fabricate successful responses.

**Public reference UX** can be anonymous read-only where terms permit with quotas and caching; potentially sensitive capability/enrollment records tenant-scoped and audited. Standard response `{data,meta:{correlationId,source,release,effectiveDate,asOf,status},error:{code,message}}`; strong Zod/OpenAPI schemas, stable source provenance and TTL. Enforce jurisdiction + DOS/effective versions, not current code list blindly. Maintain server-side per-source telemetry and fallback to stale *labeled* cache or disabled state—not silent invented rates or positive statuses.

### 8. PATH B / BUSINESS INTEGRATIONS + FIVE END-TO-END JOURNEYS

- Appwrite: **isolated V2** user, membership, tenant, Teams/TablesDB, onboarding, entitlements and safe document metadata; row/record policies; event log/outbox.
- HubSpot: inquiry/contact/company/deal/meeting lifecycle *after* consent, dedupe by verified email + review of company, owner routing, retries/outbox and real delivery acknowledgment. Until connected, inquiry endpoint must fail closed (currently 503) rather than give a fake success.
- Stripe: $2,500 diagnostic and recurring/custom pricing all read from **one price catalog**; sandbox mode only after isolated account/test permission; signed webhooks, idempotency, out-of-order handling, reconciliation, period/grace/canceled policies; never grant entitlement merely on redirect.
- Apollo: prospect enrichment only, no unsolicited mass-lead actions; account-entitled, quota-capped, privacy-aware, disabled unless approved.
- Workflows: Consult→lead→triage→meeting; Free signup→verify→org→limited access; Diagnostic→test checkout→verified order→onboarding→deliverable; Plan→subscription→entitlement→portal; Custom MSO→request→proposal→human approval→onboarding. Also ongoing claim/denial/task/appeal, credentialing/applications/contracts, authorization/eligibility, signed payment reconciliation and operational reporting with synthetic data.
- Build genuine states (pending/delivered/failed/retry/disabled) and audit correlation; no generic `200 OK` from a no-op adapter.

### 9. PATH C — Appwrite V2 staging, security and managed rollout

**Existing Appwrite connector currently listed only the live ROOT V1 project** at last audit. Treat it as protected. Provision a separately named V2 **Dev**, **Preview/Staging**, later **Prod** project only under approved administrative/paid resource authority; if no project permissions/credentials, prepare exact console/IaC steps + validation and mark `BLOCKED-CONFIG`. NEVER reuse V1's endpoint+project ID for V2 or connect live webhooks to V1. Appwrite Sites Next SSR compatibility, function deployment, region, quotas and price must be verified via actual small V2 preview; don't claim completed until an actual private stable HTTPS URL passes smoke tests. Workstation tunnel is not staging.

Security: server-side RBAC + ABAC, tenant ownership, active memberships, MFA, auth/session/refresh/revocation/invite tests, row-scoped data, rate limits per IP/email with bounds and abuse challenge, strict Zod length/shape/HTML sanitation, CSRF/origin/redirect allowlisting, CSP, safe `next/image`, security headers, secret/PHI detection, upload type/size/AV policy before enabling uploads, signed Stripe/HubSpot provider webhooks, replay/idempotency, exception handling, privacy/retention/consent logs, no logging of OAuth tokens or X12 payloads. Synthetic demo operator capability must be server-issued and session-isolated; no module-global shared state for public multi-instance preview.

CI gates: npm lockfile + `npm ci`, lint, typecheck, unit, Go test/vet, OpenAPI/contract, Playwright E2E, a11y, 375/768/1366/2560 visual screenshots in dark/light EN/ES, 404/media verification, credential escalation/IDOR/tenant tests, supply-chain+CodeQL+secret scan, performance lab, third-party license evidence. At the 2026-10-31 connected GitHub check, PR #19 had **22 review threads, zero unresolved**. This is a time-stamped observation, not proof the findings are fixed. Recheck current code, thread disposition and tests; never create duplicate remediation based on superseded review counts. Existing CI green does not equal signoff. Branch ruleset issue #3 and Appwrite #6 remain independent gates. No marketing launch without real proof permissions, security/legal check, independent reviewer approval and explicitly approved domain/DNS cutover plan with rollback.

### 10. Mandatory actions and test scenarios

Required E2E paths (all EN/ES, role scopes and both themes where relevant):
- Visitors: every top nav menu/multilevel/mobile, footer links, newsletter truthful handoff, locale/theme toggle, Ask ROOT open/respond/route/close, all conversion CTAs and validation/disabled/error responses.
- Media: original brand parity, approved photo manifest, no dead remote references, masked hero contrast, reduced motion, no CLS image layout, actual visual screenshots.
- Auth: Google, Microsoft, email **when configured**; mocked auth provider contracts otherwise; email verification, forgot password, OAuth callback state validation, error/cancel/expired/suspended; staff/admin invite gating; server role escalation forbidden; client cannot see another org; auditor cannot write; org switch cancels stale requests.
- Admin→invite staff→staff signs in→assigned account queue; client owner signup→org verification→onboarding→client KPI→service request→staff action→client notification; plans→test billing→webhook entitlement; credentialing application stage→Go/Next/payer capability/portal all update same event history; eligibility/claim status synthetic; denial→appeal→financial correction→DIRT metric reconciliation.
- Failure injection: missing API key, Stedi 401/429/timeout, no 276/277 test support, NLM/CMS outdated release, duplicate 837 attempts blocked, Appwrite session expired, Stripe duplicate/out-of-order webhook, HubSpot unavailable and inquiry 503, Pexels 429/unapproved photo, cross-org read/write attempt, duplicate demo session reset, assistive tech navigation.

### 11. Output contract, sequence and financial discipline

Deliver actual code changes and tests in **small independent PRs** against the active V2 feature path, with one worktree per agent:
1. PR-A1: nav/footer/guide + journeys correctness + parity tests (amend existing #42 only if still needed; otherwise follow-up PR).
2. PR-A2: brand + approved-media sourcing CLI + manifest + optimized media + motion/SEO/visual QA.
3. PR-B1: Appwrite SSR auth provider adapters and account/org/role workflows (separate V2 project only).
4. PR-B3-1: H1/H2 public reference data and read-only UX; PR-B3-2: Go shared state / H3/H4 synthetic Stedi/payer contract; PR-B3-3: credentialing source evidence/H5; H6/H7 only after prerequisites.
5. PR-B2: end-to-end admin/staff/client dashboards + existing 18-module parity, consuming B1/B3 interfaces.
6. PR-B4: durable inquiry + CRM, test Stripe and Apollo contracts if credentials/permissions available; otherwise clear disabled flows + contract tests.
7. PR-C1/C2: isolated stable staging, threat model, automated quality/performance/visual evidence and PR #19 review triage.

**Do not open one giant unreviewable PR or merge everything without verification.** Integrate in dependency order, rerun all tests after integration. Produce:
- `docs/engineering/ROOT-V2-LIVE-IMPLEMENTATION-MATRIX.md`
- `docs/engineering/ROOT-V2-CURSOR-AGENT-LOG.md` (agent, branch, affected files, test evidence, failed steps, actual cost/requests where available)
- `docs/engineering/ROOT-V2-RELEASE-READINESS.md` with Go/No-Go for each path and API source status
- `docs/engineering/ROOT-V2-FIGMA-DEMO6-E2E-PARITY.md`
- `docs/engineering/ROOT-V2-AUTH-ROLE-ACCESS-MATRIX.md`
- `docs/design/media-provenance.csv` and media manifest
- `docs/integrations/healthcare-source-activation-matrix.md`
- Screenshot evidence and per-PR changed files, commands/test counts, CI URLs, blocker/credential list, rollback plan.

**Agent reporting each checkpoint:** `Agent | task | branch | PR | changed files | test commands/results | screenshots | API status | blocked reason | next action | token/spend estimate or observed usage`. Conserve compute: prefer cached baseline, narrow context, no full repository rescans per agent, cap search/API queries, avoid regenerating fixtures, never buy subscriptions or lift spending limits autonomously. Incomplete provider setup must not block unrelated dev/test work.


### 12. Continuous acceptance & context-compaction contract

**Before each agent call**, give: `task_key | acceptance delta | base SHA | owned files | existing implementations to reuse | deadline/priority | external blockers | tests | no-touch files`. Subagent must inspect its assigned area, not re-audit entire monorepo. Agent report: `what existed | what changed | why nonduplicate | exact tests/evidence | remaining risk | token/spend if observable`.

**Every checkpoint**, run these binary gates and link real evidence:
1. Does the change implement an acceptance delta missing from current HEAD, rather than recreate a merged feature?
2. Is it inside its assigned file ownership and rebased safely without destroying Cursor's uncommitted state?
3. Are Google, Microsoft and email auth controls truthful (configured/working or visibly unavailable), with server-enforced roles and tenant isolation?
4. Are the 18 portal modules and every approved menu/footer/dashboard action a tested, source-mapped experience (possibly explicit synthetic) rather than decorative/dead links?
5. Is each approved API labelled `PUBLIC_LIVE_READ_ONLY`, `SYNTHETIC_DEV`, `CONNECTED_SANDBOX_VERIFIED`, `PLANNED`, `BLOCKED_EXTERNAL`, `DEFERRED_BY_OWNER`, or `LIVE_APPROVED` based on proof—not text in the plan?
6. Is every stock photo locally managed when allowed, provenance-logged, visually approved, rights checked, and accurately depicted (no implied ROOT employee/client endorsements)?
7. Did affected build, E2E, security and a11y tests run; is there evidence for any test intentionally not executed?
8. Does the new code preserve V1, Appwrite V1, production DNS/mail, public PHI-free state and rollback readiness?
9. Is the dependency/critical-path plan refreshed against the actual clock and observed task throughput?
10. Does the issue/PR/ledger show one owner and one active implementation, not duplicate branches or scripts?

**Context recovery:** at the start of a fresh Cursor context window read the latest ledger/agent log, `git status`, branch head and active PR first. Continue only unfinished tasks. Do not replay already applied patches or repeat costly full audits. Never promise asynchronous work outside the currently running session or imply an agent completed work without Git/test evidence.

**Final release-readiness status:** `PATH A: pass/partial/blocked`, `PATH B: pass/partial/blocked`, `PATH C: pass/partial/blocked`, timestamp and target deadline basis, critical blockers, exact URLs/PRs, security gates and the next three ranked executable steps. A preview demonstration is not equivalent to a live PHI or payer-ready production launch.

**FINAL OBJECTIVE:** a visually excellent, truthful, interactive, technically coherent ROOT V2 public + commercial + client/staff/admin demonstration with properly sourced photos, real authentication wired to isolated Appwrite when configured, all approved non-PHI reference API experiences, Go/Next synthetic transaction consistency and an independently reviewable staging/release evidence package. **This is not permission to process PHI, turn on live claims, perform production OAuth/payer/Stripe transactions, or cut over rootrcm.com.**

**BEGIN NOW:** inspect the current repo/PRs/working tree, enumerate actual deviations and spawn nonoverlapping tasks. Then implement the first unblocked vertical slices; do not stop at planning. Update the matrix as evidence changes. Treat an unverified or unavailable capability as unavailable, never as completed.
