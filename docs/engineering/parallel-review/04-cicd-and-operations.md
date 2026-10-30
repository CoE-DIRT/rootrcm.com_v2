# CI/CD and operations

**Snapshot:** 2026-10-30. `origin/main` `16ba2c3`. GitHub repo public: `CoE-DIRT/rootrcm.com_v2`.  
This review did not change branches, workflows, or GitHub settings.

## Workflows (observed)

| Workflow | File | Triggers | Permissions | Notes |
| --- | --- | --- | --- | --- |
| ROOT V2 CI (`quality` job) | `.github/workflows/ci.yml` | PR→`main`; push `main`/`feat/**`/`fix/**` | `contents: read` | Good least privilege. Uses `npm install --no-audit --no-fund` because lockfile was not on `main`. |
| CodeQL | `codeql.yml` | push/PR `main` + weekly | `security-events: write` | Runs; 3 open alerts, all in Demo 6 HTML. |
| Dependency review | `dependency-review.yml` | **`workflow_dispatch` only** | `contents: read` | Intentionally gated until dependency graph; `fail-on-severity: high`. Not protecting PRs. |
| Label sync | `label-sync.yml` | `workflow_dispatch` + push `main` on label files | `issues: write` | Pin action SHA when touching it. Dependabot PR #10 bumps labeler 5→6 — review before merge. |

CI on `main` (label-sync commit): `quality` **success** (44s), CodeQL **success**. That success used floating `npm install`, not `npm ci`.

Dependabot version updates **are** opening PRs (npm weekly, actions monthly). **Security updates are disabled.** Open PRs #9–#15 include majors (TypeScript 7 CI **failed**, lucide 1.x, ESLint 10, Node types 26, Actions v5–v7). Treat as **do not merge** until an owner pins policy.

## Lockfile

| Fact | Evidence |
| --- | --- |
| Not on `origin/main` | `git ls-tree origin/main` lists `package.json` only |
| Present locally, untracked | `package-lock.json` lockfileVersion 3, ~238 KB; `node_modules` exists |
| Docs still say pending | `README.md`, `CONTRIBUTING.md`, `ci.yml` comments, issue #4 |

**Fix (implementation agent, one PR):** commit the verified lockfile, change CI to `npm ci`, enable `actions/setup-node` cache, remove `--no-audit --no-fund` or replace with an explicit audit job. Do not regenerate the lockfile from Dependabot majors.

**Hygiene:** add `tsconfig.tsbuildinfo` to `.gitignore` (currently untracked).

## Branch protection — Unverified as “configured”; verified as **absent**

- Rulesets API: `[]`
- Classic protection: HTTP 404 “Branch not protected”
- CODEOWNERS `@aashaukatc` is advisory without a ruleset
- Issue #3 remains OPEN

Anyone with write (and currently, unreviewed workflow from `main` itself) can push. **P0.** This review cannot enable it.

`chore/local-setup-*` branches exist locally pointing at the same commit; AGENTS.md prefers `feat/*`/`fix/*` — operational smell, not a deploy.

## Deploy risk to V1 / production

| Path | Observed | Risk |
| --- | --- | --- |
| GitHub Pages | `has_pages: false`; Pages API 404 | **No** Pages deploy from this repo |
| GitHub Environments | 0 | No protected prod secrets — also means none are isolated yet |
| Workflows | No `deploy`, no Appwrite Sites action, no `rootrcm.com` | **No automated V1 cutover** — good |
| `next.config.ts` | No `output: 'export'` | Would be wrong for SSR; currently default (SSR-capable) |
| README / AGENTS | Explicit: do not deploy V2 to rootrcm.com | Policy only; not enforced by CI |

**Appwrite Sites** GitHub connection is **Unverified** (no `appwrite.json`, API MCP error, env matrix says not created). If someone connects Sites later: use a **V2** project, preview hostname, never attach `rootrcm.com` until founder signoff (`docs/08-qa-approval.md`).

Appwrite Sites default install command is `npm install`. After lockfile lands, set Sites install to `npm ci` to match GitHub Actions.

## Missing checks (ordered)

1. Required status `quality` on `main` (needs P0-1).
2. `npm ci` + committed lockfile (P0-4).
3. Secret scanning + push protection (P0-2).
4. Dependabot **security** updates (not majors).
5. Dependency-review on `pull_request` once graph is on (P2-7).
6. CodeQL path ignore `reference/demo6/**` (or accept alerts as archive-only).
7. Policy/contract tests before Auth flag.
8. Optional later: Playwright, axe, SBOM — not this milestone.
9. **Do not** add a production deploy job.

## Supply chain notes

- CI `permissions.contents: read` default is correct.
- Actions are unpinned tags (`@v4`). Pin SHAs when tightening (P2).
- `eslint-config-next` / Next 16 in `package.json` — keep majors in lockstep; do not take Dependabot TypeScript 7.
- No `.npmrc` with tokens observed.

## Ops gaps (non-CI)

- No on-call, SLO, or incident runbook beyond `SECURITY.md` disclosure email.
- No preview URL.
- Org 2FA **not** required (`two_factor_requirement_enabled: false`).
- Private vulnerability reporting: **Unverified**.

## What this review did not change

No workflow edits, no `package-lock` commit, no GitHub settings, no Appwrite, no issue closes. Findings are for the primary/admin owners.
