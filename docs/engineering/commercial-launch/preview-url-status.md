# Isolated HTTPS client demo — preview URL status

**Status: BLOCKED.** No preview hostname was created in this pass. Do not treat any URL as live.

## What is blocked

An isolated HTTPS client demo (Appwrite Sites or equivalent preview, separate from V1) cannot be published until all of the following exist:

| Gate | Observed 2026-10-30 | Required |
| --- | --- | --- |
| Dedicated **ROOT V2** Appwrite project | Not provisioned. See `docs/engineering/appwrite-v2-isolated-dev.md`. V1 Cloud project must not be reused. | New project ID, origin allowlist, no `NEXT_PUBLIC_APPWRITE_PROJECT_ID` pointing at V1 |
| GitHub Environment (`preview` / `dev`) | Environments `total_count: 0` (`GET /repos/CoE-DIRT/rootrcm.com_v2/environments`) | Protected environment with reviewers; secrets never copied into this PR |
| Independent approval of [PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) | Open, targets `main` from `feat/p0-p1-public-shell`. This commercial slice PRs into that feature branch, **not** `main`. | Reviewer signoff; do not self-merge |

## Explicit non-actions

- No deploy job was added to GitHub Actions.
- `rootrcm.com` and existing V1 were not touched.
- No GitHub Pages site was enabled.
- No Appwrite Sites host, function, or paid resource was created.
- No Lighthouse run; no fabricated performance scores.
- No preview URL is listed here because none was issued.

## Intended later shape (not provisioned)

Documented only in `docs/setup/environment-matrix.md`: local → dedicated V2 preview project on a **separate** hostname → staging → production after founder/security signoff. Production cutover is out of scope until written migration approval.

Issue: [#6](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/6).
