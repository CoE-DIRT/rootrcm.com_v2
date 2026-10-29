# 01 — Baseline and git recovery

**Date:** 2026-10-30  
**Operator:** Cursor Grok 4.6 High Fast  
**Repo:** `C:\Dev\ROOT\rootrcm.com_v2` (existing clone; no re-clone, no setup-script rerun)

## Git state as found

| Item | Value |
| --- | --- |
| Active branch | `chore/local-setup-20261030-020544` |
| HEAD | `16ba2c3` `chore: automatically sync ROOT V2 issue label catalog` |
| `main` | `16ba2c3` tracking `origin/main` |
| `chore/local-setup-20261029-185831` | same SHA `16ba2c3` |
| Unique commits on setup branches | none |

Two `chore/local-setup-*` branches exist because the Windows setup script ran twice (2026-10-29 18:58 and 2026-10-30 02:05). Both are checkouts of `main` with **no unique commits**. Local work was uncommitted:

- modified: `next-env.d.ts` (Next 16 generated route/root-param imports)
- modified: `tsconfig.json` (`.next/dev/types` include; CRLF from Next)
- untracked: `package-lock.json`
- untracked: `tsconfig.tsbuildinfo`

Those artifacts were preserved onto `fix/config-stabilization`. No stash, reset, clean, or duplicate commit was used.

## Cursor launcher

`cursor.cmd` resolves to `C:\Users\aasha\AppData\Local\Programs\cursor\resources\app\bin\cursor.cmd`. Cursor IDE is working. Setup-script PATH errors are classified as a **setup-script defect**, not an OS PATH change. PATH was not modified.

## Baseline quality (as found, before config repair)

| Command | Exit code | Notes |
| --- | --- | --- |
| `npm run lint` | 0 | 1 warning: `postcss.config.mjs` `import/no-anonymous-default-export` |
| `npm run typecheck` | 0 | `tsc --noEmit` |
| `npm run test` | 0 | 2 passing foundation tests |
| `npm run build` | 0 | Next.js 16.4.3; routes `/`, `/_not-found`, `/[locale]`, `/robots.txt` |

Node `v24.19.0`, npm `11.13.0`. `node_modules` already present; no reinstall.

## Repair decisions

1. **postcss.config.mjs** — assign config object before default export (clears ESLint warning).
2. **tsconfig.tsbuildinfo** — gitignore incremental TS artifacts; do not commit.
3. **next-env.d.ts** — keep Next 16 generated file; commit. `typecheck` now runs `next typegen && tsc --noEmit` so CI does not depend on a local `.next` tree.
4. **tsconfig.json** — keep Next 16 `.next/dev/types` include; rewrite with LF.
5. **package-lock.json** — commit the already-generated lockfile; CI switches to `npm ci` + setup-node npm cache.
6. **Favicon/metadata** — `src/app/icon.svg` and `src/app/apple-icon.tsx` using approved navy/cyan tokens (no third-party logo file exists in-repo). Indexing remains off.

Demo 6 HTML **is present** at `reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html` (806,463 bytes) but is listed in `.cursorignore`, so agent file search does not index it. It was not copied into `src/`. Figma master `x5HJC3HjJNCCTUOwEdUc52` was inspected via MCP (session `dcfd9802-31ce-4c57-b848-e25893722c6b`).

Config slice landed on `fix/config-stabilization` (`17fb82c`). Public shell continues on `feat/p0-p1-public-shell` fast-forwarded to that commit.
