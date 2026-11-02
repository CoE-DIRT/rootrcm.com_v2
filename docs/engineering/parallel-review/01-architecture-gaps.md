# Architecture gaps vs approved ADR / blueprint

**Severity legend:** P0 blocker · P1 before backend activation · P2 later.  
**Snapshot:** 2026-10-30, `origin/main` `16ba2c3`. `src/` is a foundation skeleton; a parallel UI agent may rewrite it.

## Current vs approved

| Layer | Approved (ADR-0001, architecture.md, CTO spec §4–§5) | Observed in repo | Gap |
| --- | --- | --- | --- |
| Hosting | Appwrite Sites, Next.js SSR | Next 16 App Router; **no** Sites config, `appwrite.json`, or deploy workflow | P1 for preview; do not use Vercel/Netlify/Pages. `.gitignore` has `.vercel/` only as ignore hygiene (P3). |
| Identity | Appwrite Auth + Teams; server membership on every privileged op | Flags hardcoded off; no SDK; no session cookie | P0-6 / P1-1 / P1-3 |
| Data | TablesDB with tenant permissions | No database, tables, columns, indexes | P1-4 |
| Compute | Functions + Next server routes | No Functions; no `app/api` | P1-3 |
| Storage | Optional, team/file isolation | None | Needed only when onboarding uploads exist |
| CRM / pay / prospect | Typed **disabled** adapters | README-only folders | P1-2 |
| UI system | Figma tokens, one header/footer, shadcn/Radix, EN/ES, light/dark | CSS variables in `globals.css`; `SiteHeader`/`SiteFooter` **unused**; no Radix | UI track (moving). Architecture risk: duplicate chrome. |
| Domain modules | `src/domain`, `src/server`, `src/features`, `src/integrations` | `features/` + `integrations/` are README stubs; no `domain/` or `server/` | P1-5 |
| IA / routes | Why ROOT, Services, Plans, Diagnostic, Login, portal, … | `/`, `/en`, `/es` only | Expected for foundation. Do not invent live APIs for missing pages. |
| Claims / SEO | Crawlable, truthful, pending-verification labels | `robots.ts` disallows all; `noindex` — correct for foundation | Keep until public launch gate. |

No premature microservices: the repo is a single Next app. **Keep it that way.** Do not add a Functions-per-resource mesh. Use: Next route handlers for session/SSR + a small set of Appwrite Functions for webhooks/cron/outbox only.

## Modular boundaries that must exist (code, still disabled)

Create these **before** `ROOT_ENABLE_*=true`. Keep adapters returning `{ ok:false, disabled:true }` until signoff.

```
src/
  server/
    auth/session.ts          # cookie session → user
    auth/policy.ts           # requireSession, requireOrgRole, requireEntitlement
    http/errors.ts           # { data, meta.correlationId, error }
  domain/
    identity/roles.ts        # single enum — reconcile CTO spec vs seed
    identity/org.ts
    catalog/offers.ts
    billing/entitlement-state.ts
    intake/lead.ts
  integrations/
    appwrite/{client,admin,types,disabled}.ts
    hubspot/{client,disabled}.ts
    stripe/{client,webhooks,disabled}.ts
    apollo/{client,disabled}.ts
  app/api/v1/
    public/inquiries/route.ts
    webhooks/stripe/route.ts
    orgs/...                 # only after policy.ts
```

**Do not** call HubSpot/Stripe/Appwrite from React components.

## Contract gaps (must exist before backend activation)

| Contract | Status | Why it matters | Smallest fix |
| --- | --- | --- | --- |
| Role enum + permission matrix | **Conflict.** Seed: `guest, client_owner, client_admin, client_viewer, root_employee, root_operations, root_admin`. CTO spec: `ROOT_SUPERADMIN, ROOT_ACCOUNT_MANAGER, ROOT_SPECIALIST, CLIENT_OWNER, CLIENT_ADMIN, CLIENT_FINANCE, CLIENT_MEMBER, AUDITOR_READ_ONLY`. | Teams roles become table permissions. Renaming later is a migration. | Adopt CTO spec as canonical; map seed names in one `roles.ts`. Missing `CLIENT_FINANCE` / `AUDITOR_READ_ONLY` is a real product gap. |
| Public inquiry | Type-guard only; no consent, idempotency, attribution, PHI denylist | Public write surface | Zod + OpenAPI fragment for `POST /api/v1/public/inquiries` |
| Org / membership | None | IDOR class | DTOs with `orgId` always from membership, never from untrusted body alone |
| Entitlement | Seed tiers Free/Growth/Managed/Add-on; no state machine | Browser checkout must not grant access | Implement `none → checkout_pending → active → past_due → …` in domain; Stripe webhook is the only activator |
| Event inbox | Fixture `status: simulated`, `consent: false` | Replay / duplicate | `provider + provider_event_id` unique; signature_verified boolean |
| Error model | None | Stack traces to clients | Shared `{ code, message, fieldErrors }` |
| Offer catalog | Docs mention $2,500 diagnostic; no typed catalog in `src/` | Duplicate prices (AGENTS.md forbids) | One `offers.ts` source; UI imports it |

## Appwrite mapping (docs-backed, project Unverified)

Appwrite product docs (not this account):

- **Teams = tenant.** Create a team per org; `Role.team(teamId)` / `Role.team(teamId, ['admin'])` on rows. Query filters on `tenant_id` are **not** a security boundary by themselves — permissions are.
- **Tables default deny.** Table-level permission grants access to **every row**. Enable row security for tenant data. Never `Role.any()` on write.
- **SSR Auth:** documented Next path is `@appwrite.io/react` + `node-appwrite` + `createAppwriteHandlers` at `/api/appwrite/[...appwrite]` with scopes `users.read`, `users.write`, `sessions.write`. API key stays server-only.
- **Sites:** Next.js SSR is supported; default output `.next`; optional `output: 'standalone'` for smaller cold starts. **Do not** set `output: 'export'` (that is static and would break Auth/API).
- **Storage:** default deny; enable file security; never bucket-wide `Any` CREATE/READ (quick-start examples do that for demos — **do not copy**).
- **Functions:** HTTP + events + schedule. Use for Stripe webhook if Sites request body/raw signature is awkward; otherwise Next route is enough for v1.

**Unverified:** whether this org already has a V2 Appwrite project, region, or Sites GitHub app. Appwrite API MCP was in **error**. `docs/setup/environment-matrix.md` states none were created by the docs.

## IA vs routes (observe only)

Blueprint nav: Why ROOT · Services · Technology · Plans · Resources · Company. Conversion: free account, consultation, diagnostic, plans, custom. Portal: client vs employee shells.

**Code today:** marketing placeholder + locale landings. Header/footer components are not mounted. Locale pages roll their own header. That violates “one header/footer” **once** the UI agent starts cloning pages — flag for that agent, do not dual-edit those files from this review.

## What must exist before backend activation (exit criteria)

1. Canonical roles + matrix in `src/domain` (not only JSON seed).
2. Typed disabled adapters + Zod request/response types.
3. `policy.ts` used by a **dummy** privileged route in tests (deny by default).
4. TablesDB schema spec committed (`docs` or `appwrite.json`) with row security + team permissions; no public write.
5. Flags read env, default false; CI asserts flags off on `main`.
6. Dev Appwrite project ID recorded (non-secret); Sites preview **not** on `rootrcm.com`.
7. Stripe/HubSpot webhook verification design (even if adapters remain disabled).

UI Figma parity is **not** a backend gate. Do not wait on `docs/figma-parity/parity-register.csv` (all `not-started` at snapshot).
