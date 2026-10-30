# ROOT V2 — Release readiness

**Timestamp:** 2026-10-31T04:00+05:00  
**Feature HEAD:** `470b76c` (`origin/feat/p0-p1-public-shell`)  
**This docs branch:** `feat/release-qa`  
**Target:** isolated V2 preview / client showcase — **not** production cutover.

## Go / No-Go

| Path | Verdict | Basis |
| --- | --- | --- |
| **PATH A — public UX / Demo 6 chrome** | **PARTIAL** | PR #42 mega/footer/guide DONE. Brand WebPs and licensed photos not on this SHA (in-flight on ops-b/ops-c / PR #44). Figma inner pages unpainted. |
| **PATH B — auth / portal / Go** | **PARTIAL / BLOCKED** | Synthetic ops + Go loopback exist. Appwrite V2 OAuth **BLOCKED_EXTERNAL** (#6). 18 modules not split to routes. Go↔portal ledger (#41) open. |
| **PATH C — staging / release** | **NO-GO** | No durable HTTPS. PR #19 blocked. `quality` not a required status on `main`. Founder snapshot is `5c025cd`, behind `470b76c`. |

**Release recommendation:** **Do not merge PR #19 to `main`.** Do not deploy V2 to `rootrcm.com`. Keep work on `feat/p0-p1-public-shell`. Treat `127.0.0.1:3032` + `8787` as developer loopback only.

## Independent PRs in flight (do not merge from this agent)

| PR | Title | Base | State | Note |
| --- | --- | --- | --- | --- |
| [#44](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/44) | Pexels sourcing CLI, no published stock photos | `feat/p0-p1-public-shell` | OPEN, MERGEABLE, quality+e2e green | Media lane. Follow-up brand import is uncommitted on ops-b/ops-c. |
| [#19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) | Public commercial shell onto `main` | `main` | OPEN, `BLOCKED` | Independent review + unresolved threads. **Do not merge.** |
| #17 / #18 | Stacked lockfile + IA | `main` / stacked | OPEN | Duplicate merge path vs #19. Human chooses. |
| Brand / Go / commercial follow-ups | — | feature branch | Upcoming | Commercial #24/#25 and Go #39 **already merged** into the feature path. Next brand PR must not collide with #44. |

## Critical blockers

1. Isolated Appwrite V2 project + Sites HTTPS (#6). V1 project must not be reused. No paid resources created by Agent D.
2. Independent approval of PR #19 and disposition of remaining review threads. Attach `quality` to `protect-main` (#3) before relying on CI as a merge gate.
3. Issue #43 complete action matrix with screenshots — this PR only inventories DONE vs MISSING; it does not close #43.
4. Original Demo 6 brand WebPs + licensed photos (#40) — files exist locally in other worktrees, not on `470b76c`.
5. Go / Next operations single ledger (#41).
6. Durable inquiry delivery (#20) before enabling the consultation submit button.

## Next three ranked executable steps

1. Human review of PR #44; then a **separate** brand-import PR from the ops-b/ops-c working tree (Agent A), not a dump onto this docs branch.
2. Founder creates Appwrite V2 project; Agent D wires preview secrets only after IDs exist.
3. Independent reviewer on PR #19 after #43/#40/#6 gates, never author-merge.

## Rollback

Feature branch only. `main` remains `16ba2c3` (label catalog). V1 DNS/email/Appwrite Site unchanged. Founder snapshot at `5c025cd` remains the pinned local demo until explicitly rebuilt by the founder.
