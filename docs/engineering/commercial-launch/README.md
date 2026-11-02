# Commercial launch — DevSecOps / release notes

**Branch:** `feat/commercial-release`  
**Base:** `feat/p0-p1-public-shell` @ `2ce689c`  
**Date:** 2026-10-30  
**Does not merge `main`.** Does not deploy to `rootrcm.com`.

This slice owns CI extension, Playwright commercial/a11y coverage, secret-scan hygiene, and launch traceability. Frontend commercial routes and backend adapters are other agents.

| Artifact | Path | Status |
| --- | --- | --- |
| Preview / isolated HTTPS demo | [preview-url-status.md](./preview-url-status.md) | **BLOCKED** — no URL created |
| Figma → production matrix | [figma-traceability.md](./figma-traceability.md) | **pending-until-frontend-merge** |
| Playwright | `tests/e2e/*` | Reduced-motion, 2560 overflow, skip-if-404 commercial routes |
| CI | `.github/workflows/ci.yml` | `quality` + `e2e` kept; actions SHA-pinned |

Lighthouse / Core Web Vitals are **not** claimed. No scores were collected in this pass.

## Secret scan

- `.env.example` is the only env file tracked (`git ls-files` 2026-10-30).
- `.env.local` is ignored via `.env.*` in `.gitignore` and was **not** committed.
- `quality` fails if a tracked `.env.local` appears.
- GitHub secret scanning / push protection remain repo settings (issue #3); this workflow does not weaken `protect-main`.
