# GitHub organization and repository — public project owner checklist

**Verified October 29, 2026:** CoE-DIRT/rootrcm.com_v2 is PUBLIC; default `main`; account aashaukatc has repository admin permission. Existing source includes Demo 6 and synthetic-only fixtures. A public GitHub repository does not make a preview production-ready.

## Controls requiring the GitHub web administrator (connector cannot write these settings)
1. **Settings → Rules → Rulesets:** add active branch ruleset targeting `main`: PR required, >=1 approval, resolve conversations, require status check `quality` after CI runs once, disallow force pushes/deletion, include administrators where supported. If unavailable due to org plan, confirm supported alternative under Branches.
2. **Settings → General:** enable Issues, Discussions and Wiki if supported; enable auto-delete merged head branches; prefer squash merges, retain other merge methods only when needed. Confirm repository description, topics and social preview.
3. **Settings → Security → Code security and analysis:** enable dependency graph, Dependabot alerts and security updates, private vulnerability reporting, secret scanning and push protection if available. Review new alerts on the public history.
4. **Settings → Actions → General:** default `GITHUB_TOKEN` read-only; grant write access only to the label-sync workflow. Limit allowed actions to reviewed publishers, protect workflows from untrusted fork pull requests.
5. **Settings → Environments:** create `preview`, `staging`, `production`. For production require named reviewers, protected branches, and no production secrets in preview. Environment creation/required reviewer configuration is not supported by the current connector.
6. **Organization settings:** require 2FA and least-privilege team membership; do not invite unverified users. Audit third-party OAuth/GitHub App grants quarterly.
7. **GitHub Projects:** create roadmap board with Triage / Ready / In Progress / Review / QA / Done. The connector currently cannot create GitHub Projects.
8. **Wiki:** `docs/wiki/` is wiki-ready source; enabling the Wiki or publishing its pages is a separate administrative action.
9. **Sponsors:** do not publish a sponsorship link or `.github/FUNDING.yml` until a real GitHub Sponsors/approved payment destination is confirmed and eligible.
10. **Pages:** do not enable GitHub Pages over V1. Preview deployment should use a separate ROOT V2 Appwrite Sites project; ChatGPT Sites may host approved static stakeholder previews only.

## Verification after changes
- Open one sample PR, run `quality`, and check whether an unreviewed merge is blocked.
- Verify Discussions, wiki navigation, private advisory entry, security scan results, Dependabot PRs, and environment approval gates.
- Log URL/evidence and owner in `docs/release/readiness.md`; never mark controls complete based on file presence alone.
