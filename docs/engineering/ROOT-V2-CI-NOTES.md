# ROOT V2 — CI notes (Agent D)

**SHA documented:** `470b76c69550eeefb3f2d706a1232cc4b2fa3650`  
**Recorded:** 2026-10-31 ~04:00 PKT

## Checks on `470b76c` (feature head, not `main`)

| Workflow | Job | Conclusion | URL |
| --- | --- | --- | --- |
| ROOT V2 CI | `quality` | success | https://github.com/CoE-DIRT/rootrcm.com_v2/actions/runs/41127355838 |
| ROOT V2 CI | `e2e` | success | same run |
| ROOT Go Healthcare API CI | `go-healthcare` | success | https://github.com/CoE-DIRT/rootrcm.com_v2/actions/runs/41127355835 |
| CodeQL | `codeql` | success | https://github.com/CoE-DIRT/rootrcm.com_v2/actions/runs/41127355897 |
| Cursor Bugbot | — | neutral | usage limit; not a pass |

Combined commit status API still reports `pending` / `total_count: 0` because this repo uses check-runs, not legacy commit statuses. Read check-runs, not `GET /status`.

Playwright on this head: PR #42 comment recorded **108 unit / 72 Playwright** on the nav-footer-guide head that landed in `470b76c`. Agent D did not re-run the full suite in this docs slice (would occupy 3010 and extra compute). CI green on GitHub is the evidence for this SHA.

## Protect-main vs required `quality`

`protect-main` ruleset id `26163186` requires 1 approving review, conversation resolution, and blocks force-push/delete. It does **not** require the Actions job `quality`. Issue [#3](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/3) remains open. Exact admin JSON is in `docs/engineering/github-required-quality-check.md`. Agent D will not weaken or rewrite the ruleset.

[PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) `mergeStateStatus: BLOCKED` despite `mergeable: MERGEABLE` — blocked by review/conversation rules, not by Git conflict. Author cannot self-approve. **Do not merge to `main`.**

## Workflow shape (`.github/workflows/ci.yml`)

- Triggers: PR/push to `main`, `feat/**`, `fix/**`.
- `quality`: forbid committed `.env.local` → `npm ci` → lint → typecheck → unit → build. Node **22**. Checkout/setup-node still SHA-pinned v4 (Node 20 *action runtime* deprecation is commented; bump is a dedicated cache-key change).
- `e2e`: needs `quality`; Playwright Chromium; artifact `playwright-report`.
- Go healthcare workflow is path-filtered to `services/healthcare-go/**`. Docs-only PRs will not run it.

## Open CI debt (not this PR)

| Item | State | Owner |
| --- | --- | --- |
| Dependabot majors #9–#15 | Open. TypeScript 7 previously failed CI. | Do not merge blindly. |
| Duplicate stacked PRs #17/#18 vs #19 | All open. Same feature commits. | Human chooses one path onto `main`. |
| Bugbot / Codex review quotas | Usage limits on #19 | Not a quality signal. |
| Visual 4-width × EN/ES × dark/light job | Not in CI | Issue #43 remaining. |
| Isolated preview deploy job | None | Blocked on Appwrite V2 secrets. |

## Local vs CI ports

CI Playwright starts `npx next start --port 3010` (see `playwright.config.ts`). This workstation currently serves Next on **3032**, **3020**, and founder **3021**. Go is on **8787**. Do not assume CI port = laptop port. Do not kill 3021.
