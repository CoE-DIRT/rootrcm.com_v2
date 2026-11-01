# 02 — Architecture and dependency audit

**Date:** 2026-10-30  
**HEAD at audit:** `feat/p0-p1-public-shell` based on `17fb82c` (lockfile/CI) over `origin/main` `16ba2c3`.

## Stack (unchanged)

ADR-0001 remains in force: Next.js App Router, Appwrite (identity/data/Sites), HubSpot CRM, Stripe billing, Apollo prospecting. No Supabase/Vercel primary backend was added.

## What landed in this phase

| Area | Path | Status |
| --- | --- | --- |
| Feature flags | `src/lib/flags.ts` | Reads `ROOT_ENABLE_*`; only the string `true` enables; `liveClaims` hard-denied |
| Canonical roles | `src/domain/identity/roles.ts` | CTO spec enum; legacy seed mapped |
| Server PDP | `src/server/auth/policy.ts` | Membership-required; SUPERADMIN does not bypass tenant |
| Offer catalog | `src/content/catalog.ts` | Single $2,500 diagnostic + scoped offers |
| Disabled adapters | `src/integrations/disabled.ts` | Typed `{ ok:false, status:'disabled' }` — no SDKs |
| Public inquiry stub | `src/app/api/v1/public/inquiries/route.ts` | Validates; calls disabled HubSpot adapter; no CRM write |
| Security headers | `next.config.ts` | CSP, nosniff, DENY frame, referrer policy |
| CI | `.github/workflows/ci.yml` | `npm ci` + setup-node cache |

## Dependencies

`package-lock.json` committed on `fix/config-stabilization`. No new runtime packages added this phase (no Zod/Radix/node-appwrite/Stripe). Radix/shadcn remain a later primitive upgrade. Dependabot majors (TypeScript 7, lucide 1.x) were **not** merged; TS 7 CI failed on PR #14.

## Still missing (backend activation gates)

- Appwrite V2 project, `appwrite.json`, TablesDB schema, Sites connection
- GitHub Environments (`total_count: 0` — not fabricated)
- Live webhook inbox/outbox
- Zod/OpenAPI packages
- Playwright/E2E
