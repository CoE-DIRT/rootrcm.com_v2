# 06 — Test and visual evidence

Recorded 2026-10-30 on Node v24.19.0 / npm 11.13.0 / Next.js 16.4.3. Commands run from `C:\Dev\ROOT\rootrcm.com_v2`.

| Command | Exit code | Result |
| --- | --- | --- |
| `npm run lint` | **0** | ESLint clean (PostCSS anonymous-export warning previously fixed) |
| `npm run typecheck` | **0** | `next typegen && tsc --noEmit` |
| `npm run test` | **0** | 20 pass / 0 fail (`tests/*.test.ts` + `tests/*.test.mjs`) |
| `npm run build` | **0** | 57 routes generated; inquiry API + locale pages present |

Build warning (not a failure): Next.js 16 reports the `middleware` file convention is deprecated in favor of `proxy`. Not migrated this phase.

## Unit/contract coverage added

- Feature flags default deny; `'1'`/`'yes'` do not enable; `liveClaims` stays false
- Two-tenant PDP: owner of A cannot read B; auditor cannot invite
- Business contact: consent required; PHI-like text rejected
- One catalog; `$2,500` diagnostic once
- Public route files exist; EN/ES copy in one module

## Browser

Dev server started via `npm run dev` after build. End-to-end clicks are recorded in `08-cto-completion-report.md`. Full 375/768/1366/2560 + both locales + both themes was **not** completed for every route.

## Not run

- Playwright/E2E suite (not in package.json)
- Screen reader pass
- Turnstile / rate-limit
- Live Appwrite/Stripe/HubSpot
