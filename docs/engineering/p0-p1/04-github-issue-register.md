# 04 — GitHub issue register

Repo: [CoE-DIRT/rootrcm.com_v2](https://github.com/CoE-DIRT/rootrcm.com_v2). Issues were **not** closed.

| # | Priority | Title | Disposition | Notes |
| --- | --- | --- | --- | --- |
| 1 | umbrella | Bootstrap completion gates | Open / partial | Split across #3–#6 |
| 3 | P0 | Protected main, quality check, public-repo security | **Partial, still open** | `protect-main` ruleset **created** (id 26163186): PR + 1 approval, no force-push/delete. Secret scanning + push protection **enabled**. Dependabot security updates **enabled**. Private vulnerability reporting PUT succeeded. Org 2FA still **false** (PATCH did not enable). Required status `quality` **not** attached (follow-up patch blocked by client policy). |
| 4 | P0 | Lockfile + `npm ci` | **Fixed in code, not closed** | PR [#17](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/17) `17fb82c`. CI uses `npm ci`. Still not on `origin/main` (`16ba2c3`) until a required review lands. |
| 5 | P1 | Figma Demo 6 exact parity | **Partial, still open** | Public IA shell + 2026-10-30 reconciliation (tablet tiles, conversion titles, mobile overflow). Not 100%. |
| 6 | P1 | Appwrite V2 + GitHub Environments | **Blocked** | Environments `total_count: 0` (not fabricated). No Appwrite project. Adapters stay disabled. |
| 7 | P2 | Wiki/Discussions/sponsorship | Open / out of scope | Discussions appear enabled in repo metadata; sponsorship not configured. |
| 8 | P2 | Integration contracts | Partial | Disabled adapters + inquiry stub; no live vendors. |

Open Dependabot majors **not merged:** #12–#15. TypeScript 7 CI failed (`40836186394`).

Cursor A3: Cursor.exe is running; launcher PATH issues are a setup-script defect. PATH was not changed.
