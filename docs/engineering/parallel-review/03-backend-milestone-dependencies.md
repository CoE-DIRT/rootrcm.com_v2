# Next backend milestone — ordered dependencies

**Milestone intent (CTO spec P3→P4, architecture P2→P3):** conversion APIs on **disabled** adapters + Appwrite **dev** identity/tenancy, **no** production, **no** PHI, **no** V1 DNS.

UI Figma work can proceed in parallel. Backend must not wait for pixel parity (`parity-register.csv` is `not-started`).

## Ready now (no external access)

- [ ] Freeze **role enum + permission matrix** in `src/domain/identity/roles.ts` (CTO spec canonical; seed JSON becomes a fixture of that enum).
- [ ] Typed **disabled** adapters: Appwrite, HubSpot, Stripe, Apollo — same method signatures as future live clients; return `disabled`.
- [ ] Zod (or equivalent) contracts: inquiry, org, membership, checkout session, webhook envelope, error envelope `{ data, meta, error }`.
- [ ] Feature flags module that **reads** `ROOT_ENABLE_*`, default `false`; unit tests.
- [ ] `src/server/auth/policy.ts` + tests with fake memberships (two orgs). No network.
- [ ] Public inquiry route **stub**: validate, persist to memory/outbox mock, do not call HubSpot.
- [ ] Security headers in `next.config.ts`.
- [ ] Commit `package-lock.json` + switch CI to `npm ci` (coordinate: lockfile is currently **local untracked**).
- [ ] Ignore `tsconfig.tsbuildinfo`.
- [ ] Contract tests that import real modules (replace `tests/foundation.test.mjs` greps).

## Blocked on GitHub admin (issue #3, #4)

- [ ] `main` ruleset + required `quality` check. **Blocked: GitHub permissions.**
- [ ] Secret scanning, push protection, Dependabot alerts/security updates, private vulnerability reporting. **Blocked: GitHub settings.**
- [ ] Org 2FA required. **Blocked: org admin.**
- [ ] GitHub Environments `preview` / `staging` / `production` (prod: required reviewers). **Blocked: GitHub admin.** Issue #6.

## Blocked on Appwrite console (issue #6) — Unverified project state

Do **not** reuse V1. Record non-secret IDs only.

1. Create project `root-v2-dev` (name flexible). Web platform hostname `localhost` + future preview host. **Not** `rootrcm.com`.
2. API key scopes (least privilege, split keys if possible):
   - SSR auth handler: `users.read`, `users.write`, `sessions.write` (per Appwrite Next docs).
   - Schema bootstrap (CI or one-off): `databases.write`, `tables.write`, `columns.write`, `rows.read/write` — **not** shipped to Sites runtime if avoidable.
3. Teams: factory “create org = create team + owner membership”. Roles = frozen enum.
4. TablesDB (row security on; **no** `Role.any()` write):

   | Table | Min columns | Isolation |
   | --- | --- | --- |
   | organizations | legal_name, lifecycle_state, team_id | team |
   | memberships | org_id, user_id, role, invitation_state | team; unique (org,user) |
   | contacts | org_id nullable, business_email, consent_* | team or server-only |
   | inquiries | idempotency_key unique, status, summary (no PHI) | server-only create |
   | offers | sku, price, currency, version, status | public read optional |
   | orders | org_id, stripe_checkout_id, status | team read; server write |
   | entitlements | org_id, feature_code, status, source | team read; server write |
   | event_inbox | provider, provider_event_id unique, signature_verified, process_status | server-only |
   | activity_audit | actor, org_id, action, result, correlation_id | server write; auditor read |

5. Storage: skip until onboarding files exist. If created: file security, MIME allowlist, team permissions, no PHI.
6. Auth: email/password first. OAuth later with exact redirect URLs.
7. Sites: connect **this** GitHub repo to the **dev** project; SSR mode; **do not** `output: 'export'`. Env: public endpoint/project id + server key in Sites secrets. Flags remain false until tests pass.
8. Functions (optional v1): Stripe webhook consumer if raw body is easier than Next; cron for entitlement reconcile.

**Appwrite API MCP could not inspect the cloud account (error).** Treat “no V2 project” as documented intent, not a live audit.

## Stripe / HubSpot / Apollo — adapters first, live later

| Vendor | Ready without secrets | Blocked on | Activation rule |
| --- | --- | --- | --- |
| Stripe | Checkout/portal/webhook **types**; entitlement state machine; inbox dedupe | Stripe test account, webhook secret in GH Environment `staging` | `ROOT_ENABLE_PAYMENTS=true` only after signature tests; **never** grant entitlement on success URL |
| HubSpot | Contact/company upsert types; idempotency key; consent fields | Sandbox private app token | `ROOT_ENABLE_CRM=true` only after dedupe + failed-sync status (no fake success) |
| Apollo | Enrichment DTO; never a CRM | API key + mapping policy | Prospecting flag; no automatic import |

Do not add these SDKs to `package.json` until the disabled adapter is merged and the flag is still false.

## Env checklist (names only — no values)

Already in `.env.example` (good):  
`NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_SITE_URL`, `APPWRITE_API_KEY`, `HUBSPOT_PRIVATE_APP_TOKEN`, `APOLLO_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ROOT_ENABLE_AUTH|CRM|PAYMENTS|PROSPECTING`.

Add when implementing (still empty in example):  
`APPWRITE_DATABASE_ID`, `TURNSTILE_SECRET_KEY`, `ROOT_ENABLE_LIVE_CLAIMS` (must stay false).

Never `NEXT_PUBLIC_` on keys.

## CI additions for this milestone (after lockfile)

- `npm ci`
- existing lint / typecheck / test / build
- contract tests for policy + inquiry schema
- optional: `npm audit --omit=dev` with allowlist
- restore dependency-review `pull_request` trigger once graph is on
- **no** production deploy job

## Explicitly out of scope (do not pull into this milestone)

- DIRT live claims / PHI / BAAs (CTO P8)
- V1 `rootrcm.com` DNS, GitHub Pages, email MX
- Fake HIPAA/SOC2/partner logos
- Merging Dependabot TypeScript 7 / lucide 1.x
- Copying `reference/demo6` JavaScript

## Blocked vs ready (summary)

| Workstream | Status |
| --- | --- |
| Domain contracts, disabled adapters, policy tests, flags, headers, inquiry stub | **Ready** |
| Lockfile + `npm ci` | **Ready locally, not on main** — needs PR; don’t collide with UI agent |
| GitHub protection, scanning, 2FA, Environments | **Blocked** — admin |
| Appwrite project, Teams, TablesDB, Sites preview | **Blocked** — console; state Unverified |
| Live Stripe/HubSpot/Apollo | **Blocked** — sandbox owners + previous rows |
| Figma parity | **Not a backend dependency** |
