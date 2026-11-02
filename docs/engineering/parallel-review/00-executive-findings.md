# ROOT V2 — CTO parallel review: executive findings

**Reviewer:** independent architecture/security review (read-only except this folder)  
**Snapshot:** 2026-10-30, `origin/main` = `16ba2c3`. Local worktree also has uncommitted Next typegen (`next-env.d.ts`, `tsconfig.json`) and an **untracked** `package-lock.json`. Treat `src/` and `docs/engineering/p0-p1/` as moving targets; this review does not judge in-progress UI completeness.  
**Stack evaluated:** Next.js App Router + Appwrite (Sites/Auth/Teams/TablesDB/Functions/Storage) + HubSpot/Stripe/Apollo. No vendor replacement.

## Blockers first

These must be resolved before backend activation or treating `main` as a protected product branch.

| ID | Sev | Finding | Evidence | Risk | Recommended fix | Owner / blocked on |
| --- | --- | --- | --- | --- | --- | --- |
| P0-1 | P0 | `main` is unprotected. Empty rulesets; branch protection API 404. | `gh api .../rulesets` → `[]`; `.../branches/main/protection` → 404; issue [#3](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/3); `docs/setup/github-settings.md` | Direct push, force-push, and unreviewed merge to public product source. | Enable ruleset: PR + ≥1 approval + resolve conversations + required check `quality` + no force-push/delete; include admins. Test a blocked merge. | **GitHub admin.** External. |
| P0-2 | P0 | Secret scanning, push protection, and Dependabot security updates are **disabled** on a **public** repo. | `gh api repos/CoE-DIRT/rootrcm.com_v2` `security_and_analysis`; secret-scanning API 404 | Accidental key commit is not blocked. Public history is scannable by anyone. | Enable secret scanning + push protection + Dependabot alerts/security updates + private vulnerability reporting. | **GitHub admin.** External. |
| P0-3 | P0 | Org MFA is not required. | `gh api orgs/CoE-DIRT` → `two_factor_requirement_enabled: false` | Account takeover of a write-capable identity is a full-repo compromise. | Require 2FA at org; audit collaborators and GitHub App scopes. | **GitHub org admin.** External. |
| P0-4 | P0 | CI is non-reproducible: `origin/main` has no lockfile; workflow uses `npm install --no-audit --no-fund`. | `.github/workflows/ci.yml`; `git ls-tree origin/main` has `package.json` only; issue [#4](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/4); `CONTRIBUTING.md` | Supply-chain drift; CI can merge a different tree than a developer. `--no-audit` hides known vulns. | Commit verified `package-lock.json` via `feat/*` PR; switch CI to `npm ci` + setup-node cache; drop `--no-audit` or add a dedicated `npm audit --omit=dev` gate. Do **not** merge Dependabot majors blindly (see P1-8). | Implementation agent + reviewer. Lockfile exists **locally untracked** — do not race the primary agent. |
| P0-5 | P0 | No Appwrite V2 project, schema, or Sites connection exists in-repo or via API. | `docs/setup/environment-matrix.md` (“documentation only”); GitHub Environments `total_count: 0`; Appwrite API MCP **error** (tools unavailable) | Backend work cannot be tested; risk of accidentally wiring V1 or inventing project IDs. | Create **dev only** Appwrite project (not V1). Record non-secret project ID/endpoint in env matrix. Do not enable Auth flags until P1-1–P1-5 land. | **Appwrite console owner.** External. Unverified live project state. |
| P0-6 | P0 | Role/permission catalogs disagree; neither is implemented server-side. Activating Auth on this would be an IDOR/escalation factory. | CTO spec §9 vs `data/seed/roles.example.json`; no `src/server/` policy module | Client-only or ad-hoc role strings will leak tenants. AGENTS.md: client gates are insufficient. | Freeze one role enum + permission matrix (prefer CTO spec, map seed names). Implement **server** PDP before `ROOT_ENABLE_AUTH=true`. | Architecture owner. Not blocked on Figma. |

## P1 — must exist before identity/payments/CRM activation

| ID | Sev | Finding | Evidence | Risk | Recommended fix | Owner / blocked on |
| --- | --- | --- | --- | --- | --- | --- |
| P1-1 | P1 | Feature flags are hardcoded `false` and **ignore** `.env.example` `ROOT_ENABLE_*`. | `src/lib/flags.ts`; `.env.example` | Env can be set “on” while code stays off (or later inverted). No single kill switch. | One typed flags module reading env, default deny, tested. | Code. Not blocked. |
| P1-2 | P1 | Integrations are README stubs. No `node-appwrite` / `appwrite` / Stripe / HubSpot / Apollo / Zod in `package.json`. | `src/integrations/*/README.md`; `package.json` | UI will call vendors directly under time pressure. | Typed **disabled** adapters with mocked responses, Zod contracts, no network. Add SDKs only when the adapter is implemented. | Code. Sandbox credentials blocked on owners. |
| P1-3 | P1 | No API routes, middleware, session cookies, CSRF, or webhook handlers. | No `src/app/api/**`, no `middleware.ts`; `next.config.ts` has no headers | Public forms and checkout cannot be added safely. | Add `/api/v1/...` per CTO spec §11; SSR Appwrite session via `node-appwrite` + httpOnly cookies (`@appwrite.io/react` Next handlers are the documented path). | Code. Needs P0-5 for live Auth; contracts can land first. |
| P1-4 | P1 | No TablesDB schema, indexes, or permission plan in source. Appwrite default is **deny-all** until granted; table-level grants apply to **all rows**. | Appwrite docs `/docs/products/databases/permissions`; CTO spec §8 | Public-write or table-wide read = cross-tenant leak. | Versioned schema (CLI `appwrite.json` or server bootstrap): `org_id` + team row security; **no** `Role.any()` write; Functions/API key for privileged writes. | Appwrite project (P0-5). |
| P1-5 | P1 | No central policy decision point. Header/footer unused; locale pages duplicate chrome. | `src/components/site/*` unused by `src/app/layout.tsx` / `page.tsx`; no `src/server/` | Duplicate nav (AGENTS.md forbids) and auth checks copied into components. | One layout shell; server `requireMembership(orgId, action)` used by every privileged route. | Code. Coordinate with UI agent on layout files. |
| P1-6 | P1 | Public contact validator is a weak type-guard, not a form contract. | `src/lib/validation/business-contact.ts` | PHI/free-text, disposable email, missing consent/idempotency. | Zod schema: business email, banned PHI keywords, consent version/timestamp, honeypot, size limits. No API until rate-limit + Turnstile plan. | Code. Turnstile site key is external. |
| P1-7 | P1 | Security headers / CSP / CSRF absent. | `next.config.ts` = `{ reactStrictMode: true }` only | XSS/clickjacking once interactive forms exist. | `headers()`: CSP, `frame-ancestors 'none'`, HSTS (prod), `nosniff`, Referrer-Policy. CSRF for cookie mutations. | Code. |
| P1-8 | P1 | Open Dependabot majors are unsafe to merge as-is. | PRs #12–#15; CI **failed** on typescript 7.0.2 (`40836186394`) | TS 7 / ESLint 10 / lucide 1.x can break the skeleton. | Pin current majors; close or narrowly retarget majors; enable security-only updates after P0-2. | Maintainer. |
| P1-9 | P1 | GitHub Environments preview/staging/production = none. | `gh api .../environments` `total_count: 0`; issue [#6](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/6) | Secrets would land in repo or shared env. | Create GH Environments; production requires reviewers; never store prod secrets in preview. | GitHub admin. |
| P1-10 | P1 | No webhook inbox/outbox, idempotency, or signature verification code. | CTO spec §10.3/§10.10; `data/seed/integration-events.example.json` is simulated only | Browser redirect granting entitlements; replayed Stripe events. | Tables: `event_inbox`, `entitlement`. Verify Stripe signatures server-side; never activate on client success URL. | Code + Stripe sandbox (external). |
| P1-11 | P1 | CodeQL **high** in archived Demo 6 HTML (`js/unvalidated-dynamic-method-call`). | GitHub code-scanning alert #1, `reference/demo6/...html:920` | Fine while isolated; catastrophic if copied into `src/` (AGENTS.md forbids the 800KB JS; file is 806 463 bytes). | Do not port Demo 6 JS. Dismiss or scope CodeQL to `src/` after documenting exception. | Security owner. |
| P1-12 | P1 | Public IA vs actual routes: only `/`, `/en`, `/es`. | `src/app/**`; `docs/00-product-blueprint.md`; `docs/03-public-website.md` | SEO/IA gap is expected for foundation; do not invent backend for missing pages. | UI agent owns routes. Backend: do not add live forms until the conversion route exists with disabled adapter. | UI agent (moving). |

## P2

| ID | Sev | Finding | Evidence | Risk | Fix | Blocked on |
| --- | --- | --- | --- | --- | --- | --- |
| P2-1 | P2 | Tests grep files; they do not execute `isBusinessContact` or flags. | `tests/foundation.test.mjs` | False green. | Import modules; add contract/tenancy tests before Auth. | Not blocked. |
| P2-2 | P2 | No E2E, a11y, or Playwright. | no playwright/vitest config | QA gates in `docs/08-qa-approval.md` are unchecked. | Add Playwright after public shell stabilizes. | UI routes (moving). |
| P2-3 | P2 | `tsconfig.tsbuildinfo` untracked; not in `.gitignore`. | `git status`; `.gitignore` | Noise / leak of local paths. | Gitignore it. | Not blocked. |
| P2-4 | P2 | ADR-0002 license is provisional; public ≠ OSS. | `LICENSE`; `docs/decisions/ADR-0002-licensing.md` | Unwanted reuse of brand/copy. | Founder/legal sign-off. | Legal. External. |
| P2-5 | P2 | `lucide-react` in dependencies but unused; shadcn/Radix not installed. | `package.json`; no `@radix-ui` | Bundle drift vs ADR. | Add Radix/shadcn when first interactive primitive is built; don’t add unused deps. | UI agent. |
| P2-6 | P2 | Layout has no `data-theme`; dark tokens unused. `html lang="en"` even on `/es`. | `src/app/layout.tsx`; `src/app/globals.css` | Locale/theme parity gap. | Theme + locale on root layout. | UI agent. |
| P2-7 | P2 | Dependency-review workflow is `workflow_dispatch` only. | `.github/workflows/dependency-review.yml`; comment cites issue #3 | PR dependency diffs not gated. | Restore `pull_request` trigger after graph confirmed. | GitHub security settings. |
| P2-8 | P2 | Figma parity register is all `not-started`; no node IDs. | `docs/figma-parity/parity-register.csv` | Backend must not block on pixel QA. | UI/Figma owner. This review did not open a Figma write session. | Figma access. Unverified frame inventory. |

## P3

| ID | Sev | Finding | Evidence | Risk | Fix | Blocked on |
| --- | --- | --- | --- | --- | --- | --- |
| P3-1 | P3 | `.gitignore` lists `.vercel/` (stack is Appwrite Sites). Harmless. | `.gitignore` | Confusion, not a deploy. | Optional comment; do not add Vercel config. | None. |
| P3-2 | P3 | CODEOWNERS is a single user; without required reviews it is advisory. | `.github/CODEOWNERS` | Bus factor. | Keep; pair with P0-1. | GitHub. |
| P3-3 | P3 | Private advisory channel Unverified (not in `security_and_analysis` payload). | SECURITY.md vs GitHub API | Sensitive reports may go to public issues or email. | Enable private vulnerability reporting. | GitHub admin. |
| P3-4 | P3 | No SBOM, provenance, or deploy workflow (good: no prod deploy). | `.github/workflows/*` | N/A until Sites. | Keep deploy **out** of CI until founder signoff. | None. |
| P3-5 | P3 | `opencode.json` names a model; no keys in repo (good). | `opencode.json` | Spend risk is local. | Keep keys out of git. | None. |

## What is already sound (do not redo)

- ADR-0001 Appwrite stack; no Supabase/Vercel proposal in active docs.
- Integrations **disabled**; robots `disallow: /`; metadata `noindex`.
- `.env.example` correctly separates `NEXT_PUBLIC_*` vs server secrets; empty values.
- Seeds labeled fictional; no patient identifiers observed in fixtures.
- GitHub Pages **not** enabled (`pages` 404; `has_pages: false`) — V1 domain not wired from this repo.
- No deploy-to-production workflow.
- CodeQL + CI `quality` exist and ran green on `main` (with the non-reproducible install caveat).
- Appwrite docs confirm Sites supports Next.js SSR (including Next 16 class setups) **in product docs**; account-level runtime remains **Unverified**.

## Unverified (do not treat as passing)

- Live Appwrite project IDs, Sites GitHub connection, Functions, Storage buckets.
- Stripe/HubSpot/Apollo sandbox accounts.
- Figma 00–08 frame completeness (MCP available; no design session opened to avoid colliding with the UI agent).
- Whether `quality` is selectable as a required check (job name exists; ruleset does not).
- Dependabot **alerts** API returned `[]` (either none or graph/alerts not fully on).
- Primary-agent UI/docs under `docs/engineering/p0-p1/` — not read as a completeness claim.
