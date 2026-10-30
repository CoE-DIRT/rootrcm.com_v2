# ROOT V2 — Founder last-step integration activation

This is a credential **map**, not authorization to turn integrations on. Adapters in `src/integrations/` are production-shaped and **disabled**. Do not set any `ROOT_ENABLE_*` flag to `true` until the matching row is signed off. Do not reuse the live V1 Appwrite project. Do not put secret values in git, issues, or this file.

## Order of activation (later; not this PR)

1. Isolated **Appwrite V2** project (dev) + GitHub Environment `dev` secrets.
2. Auth/Teams/TablesDB row security using the frozen role enum, then `ROOT_ENABLE_AUTH`.
3. Durable inquiry **outbox** (still with `ROOT_ENABLE_CRM=false`) before the public inquiry route may leave HTTP 503.
4. HubSpot sandbox + consent/dedupe, then `ROOT_ENABLE_CRM`.
5. Stripe test mode + webhook secret + inbox, then `ROOT_ENABLE_PAYMENTS`. Entitlements activate only from a verified webhook, never from a browser success URL.
6. Apollo mapping/opt-out policy, then `ROOT_ENABLE_PROSPECTING`.
7. `ROOT_ENABLE_LIVE_CLAIMS` stays **false** until a separate DIRT/PHI ADR.

Public `POST /api/v1/public/inquiries` stays fail-closed (503, no body parse) until step 3 exists **and** live CRM is still denied.

## Secret store map (names only)

Place values in the Appwrite Sites / GitHub Environment secret store for that environment. Never `NEXT_PUBLIC_` on keys.

| Variable | Owner | Used by (when enabled) | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite | SSR client | Public identifier only |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite V2 **new** project | SSR client | Must not be the V1 project id |
| `NEXT_PUBLIC_APPWRITE_PROJECT_LABEL` | Appwrite | Docs/ops | Non-secret label |
| `NEXT_PUBLIC_SITE_URL` | Hosting | Redirects | Environment origin |
| `APPWRITE_API_KEY` | Appwrite | Server Auth/Teams/TablesDB | Least privilege; never browser |
| `APPWRITE_DATABASE_ID` | Appwrite | TablesDB | After schema exists |
| `APPWRITE_SESSION_COOKIE_NAME` | Appwrite | Session helper | Unverified cookies must not mint principals |
| `HUBSPOT_PRIVATE_APP_TOKEN` | HubSpot sandbox | CRM upsert | Server only |
| `HUBSPOT_PORTAL_ID` | HubSpot | Idempotent upsert | Non-secret portal id |
| `STRIPE_SECRET_KEY` | Stripe test | Checkout factory | Server only |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Webhook verifier | Missing/empty → fail closed |
| `STRIPE_PRICE_ID_DIAGNOSTIC` | Stripe test | Checkout line item | Catalog remains `$2,500` in code |
| `STRIPE_CHECKOUT_SUCCESS_PATH` | Site | Redirect path | Success URL does **not** grant access |
| `STRIPE_CHECKOUT_CANCEL_PATH` | Site | Redirect path | |
| `APOLLO_API_KEY` | Apollo | Enrichment | Prospecting only; not a CRM |
| `APOLLO_BASE_URL` | Apollo | Client | |
| `TURNSTILE_SECRET_KEY` | Cloudflare | Public forms | After inquiry outbox exists |
| `ROOT_AUDIT_DRIVER` | ROOT | Audit sink | `memory` / future store; default no-op |
| `ROOT_OUTBOX_DRIVER` | ROOT | Inquiry outbox | Unused by public route until founder activation |

## Flag map (default deny)

| Flag | Exact enable value | Default | Live effect (future) |
| --- | --- | --- | --- |
| `ROOT_ENABLE_AUTH` | `true` | deny | Appwrite session + PDP |
| `ROOT_ENABLE_CRM` | `true` | deny | HubSpot writes |
| `ROOT_ENABLE_PAYMENTS` | `true` | deny | Stripe checkout + webhook processing |
| `ROOT_ENABLE_PROSPECTING` | `true` | deny | Apollo enrichment |
| `ROOT_ENABLE_LIVE_CLAIMS` | never from env | hard false | DIRT/PHI — separate ADR |

Unset, empty, `1`, `yes`, and any value other than the string `true` is deny.

## Explicitly out of this step

- Creating Appwrite projects, Sites, Functions, or paid resources
- Pointing env at V1
- Enabling flags in `.env.example` or CI
- Wiring `src/integrations/outbox` into `POST /api/v1/public/inquiries`
- Payer/EHR live connections (operational contracts only; not frontend marquees)
