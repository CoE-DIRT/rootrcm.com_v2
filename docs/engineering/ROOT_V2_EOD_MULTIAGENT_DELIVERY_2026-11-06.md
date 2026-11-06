# ROOT V2 — EOD multi-agent delivery contract (2026-11-06)

## Authority and scope
- Canonical destination: `CoE-DIRT/rootrcm.com_v2`, protected `main`, baseline `bb12a39155b2c36fd543fda0030e44ee18eb1ef5` at audit.
- Claude Code replaces Cursor as primary implementation engine. Codex/ChatGPT handles risk review and integration acceptance; Gemini/Google AI Plus provides bounded specification/test analysis; GitHub Copilot CLI supports isolated small code suggestions; Netlify provides isolated frontend preview when configured; terminal executes tests and release checks; GitHub PRs are the integration record.
- Appwrite remains the authoritative production host, identity and application data platform. Netlify is NOT a second live backend, identity provider, or replacement for Appwrite. Never point rootrcm.com away from Appwrite as part of this phase.
- Read current `AGENTS.md`, `README.md`, project ADRs, tests, and source before implementation; this document supersedes outdated *agent assignment* and scheduling language, not security/privacy/governance controls.
- No PHI, patient data or secrets in model prompts, logs, GitHub, screenshots, Google AI, Netlify previews or demo. No production access via a synthetic persona.

## Verified code inventory and critical gap
1. `src/components/app-shell/operations-command-center.tsx` is a substantial, reusable client operations experience (overview, claims/revenue, credentialing, practice scheduling; audit, notifications, metrics, state controls).
2. `src/domain/operations/{seed,types,transitions,metrics}.ts`, `src/server/operations/{store,persistence,policy,session}.ts` and `tests/operations-*.{ts,mjs}` form an existing synthetic workflow engine.
3. `src/app/[locale]/dashboard/page.tsx` does membership-based admin/client redirection. `src/app/[locale]/dashboard/[kind]/page.tsx` currently renders `MarketingPage` with org role/empty-state copy instead of mounting the command center. This is the first product implementation gap.
4. `src/server/operations/persistence.ts`: demo session `memory` is process-local; `file` needs a configured directory; `appwrite` is explicitly a fail-closed stub. Do not relabel this as durable tenant persistence.
5. `src/app/api/v1/public/inquiries/route.ts` intentionally returns HTTP 503; `src/server/leads/durable-inquiry.ts` uses file-backed abstractions and is not connected to the public route. A row-secure Appwrite storage/notification/idempotency implementation is still required.
6. `src/server/auth/*`, `src/components/forms/auth-form.tsx` and tests establish auth foundation. Live acceptance including persisted admin session, locale handling and tenant authorization must be verified on canonical host.
7. DIRT reuse: `CoE-DIRT/dirt-backend-foundation/apps/web/src/pages/LiveDashboardPage.jsx` contains role-specific executive/RCM/analyst review-queue and warrant presentation; `docs/data/CLAIM_LIFECYCLE_MODEL.md` and architecture/tenancy policy provide domain ideas. These are reference patterns, NOT copy-and-deploy React code or production database definitions.
8. `CoE-DIRT/rcm-iaas-platform` has imported legacy DIRT Netlify pages; archived/static HTML is a reference only. `CoE-DIRT/rootrcm.com` has prior SEO, contact, and analytics design ideas; select only provenance-checked components.
9. Historical feature PRs #44–#62 overlap current `main`. PR #73 remains draft/nonmergeable. Do not merge #60 wholesale or stack legacy PRs unexamined.
10. Existing Netlify account shows historical DIRT/RCM projects but no confirmed dedicated ROOT V2 preview. Configure an isolated preview on a branch before enabling Netlify; no secrets/real users/production backend.

## EOD release slices (strict priority)
### P0-A: Functional protected operations workspace (must ship first)
- Preserve `getAuthContext` and `requireMembership` on *every* authenticated route/operation. Admin, client, staff views must be real authorization, not URL or browser persona impersonation.
- Mount/reuse existing OperationsCommandCenter behind `/{locale}/dashboard/{kind}` where safe. Keep all operations/claims/credentialing data labeled **synthetic demo** and isolate from real Appwrite org data. Do not invent durable persistence.
- Fix admin/client role mapping, org selection and access-pending. Add a staff route or a clearly gated staff view without weakening existing policy.
- Verify EN/ES sign-in -> workspace -> refresh -> logout -> denied access, forged session and cross-tenant rejection. Appwrite hosted browser acceptance is mandatory before marking done.
- Tests: lint, typecheck, unit, build, Playwright dashboard/role/tenant/locale, CodeQL; no external keys.
- Commit only the smallest validated vertical slice; ask for acceptance from reviewer and merge through protected PR.

### P1-B: UX/technical experience (after dashboard passes)
- Use Figma and Demo 6 as authority, selectively reuse DIRT role-level information density. No blanket redesign, misleading content, unverifiable certifications/testimonials.
- Focus on command-center readability, responsive 375/768/1366/2560, EN/ES, light/dark, keyboard AA, actionable states, skeleton/error/empty states, perf and CLS <=0.05 target.
- Netlify preview for frontend comparison only, on isolated branch and synthetic fixtures. Real auth/backend acceptance remains Appwrite.

### P2-C: Business conversion
- Build Appwrite TablesDB durable inquiry persistence with explicit consent, validated business-only fields, bot/rate limits, dedupe/idempotency, outbox/notification failure handling and a genuine success receipt.
- Enable public POST only after server storage, delivery and test evidence; otherwise retain contact fallbacks. HubSpot, Apollo, Stripe remain disabled until individually authorized and verified.

### P3-D: Production release
- Test canonical HTTPS routes, auth cookies, redirects, permissions, tenant isolation, responsive screens, SEO, error reporting and rollback. Confirm Appwrite deployment ID, active commit and actual app state. No blind deployments or DNS changes.
- Triage open PRs against main, close only demonstrably superseded PRs after review. Dependency upgrades in separate slices. Preserve rollback and old branches until acceptance.
- Defer regulated live payer APIs (eligibility, 837, 835, remittance, credentialing statuses) pending vendor/privacy/security controls.

## Token-efficient work cycle
`GitHub ground truth -> ChatGPT/Codex one-page acceptance contract -> Gemini bounded independent critique (no patient/confidential data) -> Claude Code isolated worktree implementation -> Copilot CLI focused test/refactor only if necessary -> terminal local lint/typecheck/tests/build -> Netlify isolated FRONTEND preview -> GitHub PR/CI/CodeQL -> Appwrite production-like hosted smoke -> ChatGPT final GO/NO-GO -> next slice`.
- One authoritative issue, one primary coding agent, one branch/worktree per slice; no parallel edits to same files. Do not send whole repository to all models.
- Every handoff includes: base SHA, changed-file scope, purpose, explicit no-go areas, test commands/results, screenshots if relevant, open blockers, and next owner.
- Retry a failed check only after error classification and a code/config change. Stop after two nonprogressing retries; escalate with minimal log excerpt.
- Track usage/spend at each slice; budget cap must be configured in each paid API/host account. Subscriptions have independent limits; do not assume unlimited Claude, Copilot, Gemini, or Codex.
- Prefer local tests and cached dependencies; no speculative multi-agent swarm or automatic production writes.
- End each cycle with a PR and verified acceptance matrix, not claims of completion.

## End-of-day ship criteria
- P0 protected dashboard works for actual authorized admin/client/staff users and cannot read cross-org data; browser refresh/logout passes.
- Existing synthetic workflow panels render and behave consistently, clearly labeled; no actual payer or PHI operation.
- Public site, consultation fallback, basic frontend navigation remain intact.
- CI passes on merged commit; Appwrite deployed SHA matches approved main; canonical host tested.
- Any unverified item is documented as open; reject a false '100% complete' declaration.
