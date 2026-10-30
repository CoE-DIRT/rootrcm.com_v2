# POST-CURSOR EXECUTION REVIEW — P0/P1 reconciliation

**Date:** 2026-10-30  
**Workspace:** `C:\Dev\ROOT\rootrcm.com_v2` (existing clone; no reinstall, no Windows setup script, no V1, no production deploy, no live Appwrite/HubSpot/Stripe/Apollo).  
**Operator:** ROOT V2 CTO reconciliation pass.  
**Figma file:** https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52 (MCP session `3de99bfe-934b-43de-8857-a350de81fe61`).  
**Demo 6 HTML:** present at `reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html` (806,463 bytes). Not copied into `src/`. Agent search does not index it (`.cursorignore`).

## 1. Verified completion matrix

| Area | Status | Evidence |
| --- | --- | --- |
| Shared chrome (one header/footer, skip link, theme, locale) | **Working** | `SiteHeader` / `SiteFooter` wired in `src/app/[locale]/layout.tsx`. Browser 375/768/1366. |
| Public IA routes EN/ES | **Working shells** | Home, Why ROOT, Services, Solutions, Technology, Plans, Resources, Company, legal placeholders. Inner pages without dedicated Figma frames remain IA shells. |
| Figma public frames (Home / Services / Pricing + mobile/tablet home) | **Partial — not 100%** | Desktop home copy/layout matches frame `4:2`. Tablet home title + tiles match `4:153`. Mobile title/tiles match `4:126`. Services `4:40`, Plans `4:88` + `$2,500` catalog. Pixel spacing not certified. Ultrawide 2560 not run. |
| Conversion (account / consultation / diagnostic / custom) | **Prototype** | Figma step lists + inquiry form. Consultation title now matches `5:69` (“Talk with a revenue expert”). Auth/Stripe labeled planned. HubSpot disabled. |
| Synthetic app shells | **Synthetic** | `/en/preview/client` Bayview workspace; org `<select>` **disabled**. Staff/DIRT/credentialing/billing/onboarding/subscriptions labeled preview. |
| Feature flags | **Working (default deny)** | `getFeatureFlags()`; only string `true` enables; `liveClaims` hard-false. |
| Server PDP | **Working (code + tests)** | `requireMembership` two-tenant tests now run in `npm test` via `tests/policy.test.ts`. Auth flag off in this environment. |
| Inquiry API | **Disabled adapter** | POST `/api/v1/public/inquiries` stores a local receipt. Browser: “Inquiry stored locally as a receipt. CRM sync is disabled.” |
| Lockfile / `npm ci` / favicon / PostCSS | **Fixed in branch, not on `main`** | `17fb82c` on `fix/config-stabilization`. `main` is still `16ba2c3` until PR #17 merges. |
| CI quality + CodeQL on PRs #17/#18/#19 | **Green** | `quality` SUCCESS, CodeQL SUCCESS. Merge blocked by ruleset review, not checks. |

**Honest Figma coverage:** accessible frames on pages 01–05 were used. Implemented public frames ≈ Home desktop/mobile/tablet, Services, Pricing, Conversion step boards, Customer Portal synthetic shell. Pages 06–08 (prototypes / handoff / QA) not implemented as motion. **Do not read this as 80–100%.** A fair statement is **high-confidence mapping of the public marketing frames that exist, with inner IA pages as labeled shells**.

## 2. GitHub issues (#3 #4 #5 #6 #8)

Issues were **not closed**.

| Issue | Result | Evidence |
| --- | --- | --- |
| [#3](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/3) P0 protection | **Partial** | Ruleset `protect-main` id `26163186`: PR + 1 approval, no force-push/delete, conversation resolution required. `quality` is **not** a required check. Org 2FA still `false`. Secret scanning + push protection enabled. |
| [#4](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/4) P0 lockfile/CI | **Fixed in code, not on `main`** | PR [#17](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/17) `17fb82c`. CI uses `npm ci`. Not closed until merge + `main` CI is proven. |
| [#5](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/5) P1 Figma parity | **Partial** | Public shell + this reconciliation (tablet tiles, conversion titles, node `5:69`, mobile header overflow). Not 100%. Not closed. |
| [#6](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/6) P1 Appwrite/Environments | **Blocked** | GitHub Environments `total_count: 0`. No Appwrite V2 project in this pass. Flags stay false. |
| [#8](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/8) P2 contracts | **Partial** | Typed disabled adapters + inquiry stub. No live vendors. No Zod package. |

## 3. Quality commands (this pass)

Recorded 2026-10-30, Node v24.19.0, after reconciliation fixes. Commands from `C:\Dev\ROOT\rootrcm.com_v2`.

| Command | Exit |
| --- | --- |
| `npm run lint` | **0** |
| `npm run typecheck` | **0** |
| `npm run test` | **0** (20 pass / 0 fail) |
| `npm run build` | **0** (57 routes) |

`npm test` now includes `tests/policy.test.ts` (executable two-tenant PDP) with `--test-concurrency=1` so env mutation cannot race. Build still warns that Next 16 `middleware` is deprecated in favor of `proxy`. Not migrated.

## 4. Browser verification (localhost:3000, `next start` after build)

No second `next dev` was started. Production server on :3000 used for this pass.

| Check | Result |
| --- | --- |
| 375 mobile home | Title “Your practice. Your revenue. Your control.” Mobile tiles. Header `ROOT / Theme / ES / ☰`. `scrollWidth === clientWidth` (375). Overflow **fixed** this pass (`.btn-ghost { display:inline-flex }` had overridden Tailwind `hidden`). |
| 768 tablet home | Title “More clarity, without changing what works.” Tiles RCM / DIRT intelligence / Credentialing / Practice operations (Figma `4:153`). Nav remains hamburger below `lg` (Figma tablet nav overflowed its own 768 frame). |
| 1366 desktop home | Title matches Figma `4:2`. Primary nav visible. |
| `/en/plans` | One catalog including **$2,500** diagnostic. |
| `/es/plans` | Spanish copy + `$2,500`. Locale switch required Enter after click in this browser tool; href itself is correct (`/es/plans`). |
| Light theme | `data-theme="light"` after toggle; light surfaces observed. |
| Consultation | Title “Talk with a revenue expert”. Form submitted; receipt + CRM disabled. No PHI entered. |
| Preview client | Bayview Multi-Specialty Group; org switch **disabled**. |

Keyboard: skip link present (`href="#main"`). Full screen-reader pass **not** run. Reduced-motion CSS exists. Playwright **not** in package.json.

## 5. Fixes landed in this reconciliation (on `feat/p0-p1-public-shell`)

Confirmed incomplete/broken only — no redesign, no Demo 6 JS, no live integrations.

- Include and **run** `tests/policy.test.ts` (was omitted; Node could not resolve extensionless imports).
- Consultation Figma node `5:69` (was `6:78`).
- Conversion titles aligned to Figma (`5:46`, `5:69`, `5:115`).
- Tablet home tiles; localized form concern options; localized app-shell chrome.
- Route metadata for Figma-mapped pages.
- Form control `aria-describedby` on the actual inputs.
- Mobile header overflow (wrapper around `hidden` + shorter theme label).
- `overflow-x: clip` on `html`.

## 6. Remaining blockers

1. **Cannot merge to `main` without a human approval.** Ruleset requires 1 approving review; `current_user_can_bypass: never`. Authenticated GitHub user `aashaukatc` is the PR author and cannot satisfy that rule alone. Quality/CodeQL are green. This is the git-sync blocker.
2. Org 2FA still off (`two_factor_requirement_enabled: false`).
3. Required status check `quality` still not attached to `protect-main`.
4. GitHub Environments = 0; no Appwrite V2 project. Do not enable `ROOT_ENABLE_*`.
5. Inner marketing pages lack dedicated Figma frames; Customer Portal mobile `5:227` untested as a dedicated frame.
6. No Playwright/E2E; no Radix/shadcn; no Zod package; no webhook inbox.
7. Dependabot majors #12–#15 not merged (TypeScript 7 CI previously failed).
8. Next 16 `middleware` → `proxy` deprecation.

## 7. GitHub sync status

Verified at start of this pass (read-only):

| Ref | SHA | Notes |
| --- | --- | --- |
| `origin/main` | `16ba2c3` | Unchanged vs historical. |
| `fix/config-stabilization` | `17fb82c` | PR [#17](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/17) → `main`. CI green. `mergeStateStatus: BLOCKED` (reviews). |
| `feat/p0-p1-public-shell` | `3d1b68b` (this pass) | Pushed. PR [#18](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/18) stacked on #17. PR [#19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) same head onto `main` (combined). |
| `chore/local-setup-*` | `16ba2c3` | No unique commits. Preserved. |
| `feat/design-system-and-marketing-ia` | `17fb82c` | Local-only alias of #17 SHA. Preserved. |

**Merge results (executed):**

- `git fetch origin` — `origin/main` still `16ba2c3`; no divergence rewrite.
- `git push origin feat/p0-p1-public-shell` — `b5081ed..3d1b68b` succeeded.
- `gh pr merge 17 --merge` — **denied**: “the base branch policy prohibits the merge.” Ruleset requires 1 approving review; no bypass actor.
- `--auto` merge — **denied**: repository does not have `enablePullRequestAutoMerge`.
- `--admin` was **not** used (ruleset `current_user_can_bypass: never`).
- Local `main` not fast-forwarded (nothing new on origin).
- PRs #17/#18/#19 left open with comments. Issues #3/#4/#5/#6/#8 left open with comments.

**No force-push. No `--no-verify`. No production deploy.** Local `feat/p0-p1-public-shell` == `origin/feat/p0-p1-public-shell` at `3d1b68b`. Local `main` == `origin/main` at `16ba2c3`.

PR #17 body incorrectly said Demo 6 HTML was missing; the file exists (806,463 bytes). Corrected in PR comment, not by rewriting history.

## 8. Product truth

| Layer | What it is |
| --- | --- |
| Public marketing | Working Next.js IA shell, Figma-mapped home/services/plans, EN/ES, dark/light. |
| Conversion | Prototype forms; inquiry persists locally only. |
| App preview | Synthetic fixtures. Not a live tenant portal. |
| Integrations | Typed **disabled** adapters. No vendor SDKs. |
| Backend | Missing. No Appwrite project, no Environments, no session cookies, no TablesDB. |

## 9. Next three implementation priorities

1. **Human review + merge** PR #17 then PR #19 onto `main` (do not merge both #18 and #19). Attach `quality` as a required check after `main` has a passing run. Keep issues open until `main` CI is proven.
2. **Issue #6 (external):** isolated Appwrite **dev** project + GitHub Environments. Do not set `ROOT_ENABLE_AUTH` / payments / CRM until PDP is wired to real sessions.
3. **P3 identity slice:** httpOnly session + TablesDB row security using the frozen role enum. Add Playwright against the public shell. Keep Demo 6 JS out of `src/`.
