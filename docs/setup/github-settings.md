# GitHub organization settings — Manual owner checklist

1. Keep `CoE-DIRT/rootrcm.com_v2` **Private**; confirm approved team/collaborator access (least privilege).
2. Settings → Rules → Rulesets → **New branch ruleset** for `main`: require pull request, one approving review, conversations resolved, required status check `quality`, prevent force pushes and deletion; apply to admins unless emergency waiver.
3. Settings → General → Pull Requests: default to squash merges, auto-delete head branches; consider disabling merge commits to preserve history.
4. Settings → Actions → General: allow approved official/reviewed actions; read-only `GITHUB_TOKEN` by default; restrict fork secrets.
5. Enable Dependabot security updates, dependency graph, Dependabot alerts and secret scanning/push protection if available under your plan.
6. Add organization GitHub teams with Admin for founders, Write for engineers, Read for auditors; require 2FA and hardware security keys when practical.
7. Connect **Figma GitHub / Code Connect** after Figma node IDs and actual production components exist. Connect **Appwrite Sites GitHub** in the separate V2 project; bind staging branch first, not V1 DNS.
8. Use only scoped GitHub Apps for Cursor/Codex/Claude or approved OAuth; revoke unused authorizations. **Never store API keys in repository secrets for local AI** unless workflow actually needs them.
9. Configure repository environments `preview`, `staging`, `production`; require manual reviewer on production and prevent unreviewed deploys.
10. Confirm CODEOWNERS matches actual GitHub organization members/teams; adjust placeholder `@CoE-DIRT` if it isn't a valid reviewer identity. Run first PR and confirm status check name before enforcing ruleset.
