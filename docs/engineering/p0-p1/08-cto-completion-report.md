# 08 — CTO completion report (P0/P1 execution)

**Date:** 2026-10-30  
**Workspace:** `C:\Dev\ROOT\rootrcm.com_v2`  
**Did not:** clone, run `ROOT_V2_Setup_Windows.ps1`, touch V1, merge to `main`, close GitHub issues, deploy, or enable Appwrite/HubSpot/Stripe/Apollo.

## 1. Baseline Git status and preserved changes

Found on `chore/local-setup-20261030-020544` at `16ba2c3` (same SHA as `main` and `chore/local-setup-20261029-185831`). Two setup branches exist because the Windows setup script ran twice; **no unique commits**. Uncommitted Next typegen + untracked lockfile were preserved onto `fix/config-stabilization` (`17fb82c`) then fast-forwarded into `feat/p0-p1-public-shell`.

Cursor IDE is running (`Cursor.exe`). A3 classified as setup-script launcher defect; PATH not changed.

## 2. Files/components implemented

Shared chrome: `SiteHeader`, `MobileNav`, `SiteFooter`, theme toggle, locale switch, skip link. Public IA and conversion routes under `src/app/[locale]/`. Synthetic previews under `src/app/[locale]/preview/`. One catalog `src/content/catalog.ts`. Flags, roles, PDP, disabled adapters, inquiry API. Tests under `tests/`.

## 3. Figma parity (not 100%)

MCP session against file `x5HJC3HjJNCCTUOwEdUc52`. Implemented from accessible frames on Foundations, Components, Public Website (Home/Services/Pricing + mobile/tablet home), Conversion, Customer Portal. Inner marketing pages without dedicated Figma frames are IA shells. See `03-figma-code-traceability.md`. **Do not claim 100%.**

Browser: `/en` home matches Figma copy/layout at ~1366 dark; `/en/plans` shows one catalog including **$2,500** diagnostic; `/en/consultation` form labeled HubSpot-disabled; `/en/preview/client` synthetic Bayview workspace with **disabled** org switch. `/es/plans` was observed with Spanish copy. 375/768/2560 not fully certified. Next.js overlay reported CSP `eval` (dev) and a SkipLink hydration warning.

## 4. GitHub issues

| Issue | Result |
| --- | --- |
| #4 lockfile/`npm ci` | Fixed in `17fb82c`. Not closed. |
| #3 protection/scanning | Partial: ruleset + secret scanning + push protection + Dependabot security updates enabled. Org 2FA still off. `quality` not a required check. |
| #5 Figma parity | Partial public shell. Not closed. |
| #6 Appwrite/Environments | Blocked. Environments still 0. |

Dependabot majors not merged (TS 7 CI failed).

## 5. PRs

See GitHub after push. Intended: `fix/config-stabilization` (#4) and `feat/p0-p1-public-shell` (#5 + policy).

## 6. Actual tests

| Command | Exit |
| --- | --- |
| `npm run lint` | 0 |
| `npm run typecheck` | 0 |
| `npm run test` | 0 (20 pass) |
| `npm run build` | 0 (57 routes) |

Build warning: Next 16 `middleware` → `proxy` deprecation. Not migrated.

## 7. Security/dependency findings

Flags default deny. PDP two-tenant tests pass. Inquiry does not call HubSpot. Headers present; production CSP omits `unsafe-eval`; dev CSP allows it for React overlay. No PHI. Lockfile committed. No vendor SDKs.

## 8. Remaining blockers

- Org 2FA; required `quality` check on ruleset
- Appwrite V2 project; GitHub Environments
- Auth/payments flags must stay false until PDP is wired to real sessions
- Full Figma width/locale/theme matrix
- SkipLink hydration / locale-switch client navigation under overlay
- Playwright E2E; Radix/shadcn; Zod package

## 9. Next milestone

Attach `quality` as required check after this PR’s CI run. Provision isolated Appwrite **dev** project (issue #6) without enabling flags. Then P3: session cookies + TablesDB row security using the frozen role enum. Keep Demo 6 JS out of `src/`.
