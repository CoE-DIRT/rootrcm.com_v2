# ROOT V2 — Release / readiness evidence

Do not confuse an implemented repository file with an enabled GitHub/Appwrite control.

| Control | Present in repo | External configuration verified | Evidence / owner |
|---|---|---|---|
| Public repo and main default | yes | yes (GitHub metadata 2026-10-29) | CoE-DIRT/rootrcm.com_v2 |
| `quality` CI | yes | not checked for new PR | GitHub Actions runs required |
| CODEOWNERS | yes | owner membership/review behavior untested | @aashaukatc |
| Main branch ruleset | checklist | no rulesets returned; protection API 403 | Owner must configure |
| Dependency updates | proposed PR | not active until PR merge | Dependabot settings need verification |
| CodeQL and dependency review | proposed PR | not run yet | Actions results required |
| Secret scanning and push protection | checklist | unknown | GitHub Security settings |
| GitHub Discussions / Wiki | content proposals | unknown | GitHub Settings feature toggles |
| GitHub Sponsors | eligibility/plan | not configured | Verified sponsor destination needed |
| Environments preview/staging/production | matrix | not provisioned | GitHub admin |
| Figma exact Demo 6 parity | tracking template | NOT established | Review node/screenshot/interaction matrix |
| Appwrite V2 dev/stage/prod | architecture | not verified | Separate project IDs and access proof |
| HubSpot/Apollo/Stripe | disabled adapters | not activated | Sandbox tests and signoff |

## Approval gate
- [ ] Approved design node per route, locale and visual state; synthetic UX test evidence.
- [ ] CI, dependency, security and permission checks green.
- [ ] Documented third-party license audit and original-content license approval.
- [ ] Appwrite tenant isolation and OAuth tests; secret scans and no PHI.
- [ ] Legal/copy verification for partner logos, client outcomes, reimbursement claims.
- [ ] Production integrations, billing and V1 replacement separately approved in writing.
