# ROOT V2 — Claude Code project instructions (2026-11-06)

You are working in `CoE-DIRT/rootrcm.com_v2` on `feat/eod-operations-dashboard-20261106`. This branch is reserved for **P0 operations dashboard**. Claude Code is the primary coding engine; Appwrite is the permanent production infrastructure; GitHub owns source and PRs; Netlify may ONLY show frontend synthetic previews.

READ FIRST: `AGENTS.md`, `README.md`, `docs/architecture.md`, `docs/engineering/rcm-dashboard-data-contract.md`, `src/domain/identity/roles.ts`, `src/server/auth/{session,policy}.ts`, `src/app/[locale]/dashboard/{page.tsx,[kind]/page.tsx}`, `src/components/app-shell/operations-command-center.tsx`, `src/components/operations/{use-ops-state,preview-session-binder}.tsx`, `src/server/operations/{session,policy,store,persistence}.ts`, `src/app/api/v1/ops/{state,actions,preview-bind}/route.ts`, tests. Also read `docs/engineering/ROOT_V2_EOD_MULTIAGENT_DELIVERY_2026-11-06.md` from documentation PR #77.

## First delivery
Fix the existing authenticated dashboard which currently renders only a marketing empty state. Reuse the already built operations UI, but keep **real Appwrite authorization separate from demo preview capabilities**. The legacy `/api/v1/ops/*` signed preview cookie does NOT authorize real users. Do not mount an unscoped preview session on a live dashboard and claim access works. Create a separate server-gated, read-only synthetic adapter or proper authenticated endpoint as needed, scoped to actual `getAuthContext`/`requireMembership` and org ID. For live operations, provide a no-data/coming-soon state until Appwrite durable persistence and real organization linkage exist. If showing sample data, label it synthetic and keep fixtures separate and non-PHI. Do not allow real admin to impersonate another organization's user through client-supplied selectors.

Requirements: role-matched admin/client/staff entry, EN/ES, refresh, logout, denied/expired sessions, no cross-tenant data and no false payer statuses. Add tests proving authorization and sample/data boundary. Only after P0, move to UI/UX, Netlify isolated preview, then lead capture with approved durable Appwrite pipeline.

## Guardrails
- Check local Git status and worktrees before editing. Do not overwrite existing work.
- Keep `main` untouched; create small commits/PRs; no force push.
- Do not expose PHI, secrets or actual accounts; do not change DNS, production Appwrite variables, authentication flags or production host without explicit verified acceptance.
- Never silently enable HubSpot, Apollo, Stripe, live payer APIs or production inquiry write APIs.
- Before PR: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, focused Playwright E2E, CI and CodeQL.
- Do not claim hosted acceptance based on mocked tests.
- Return branch, HEAD, files, results, open blockers, PR and next step in <= 500 words. Spend tokens on code and tests, not planning duplication.
