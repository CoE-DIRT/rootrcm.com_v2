# Isolated HTTPS preview — status

**Recorded:** 2026-10-30 against `feat/ops-preview` @ `1f4f3b2`.
**Durable Appwrite Sites / GitHub preview / Netlify draft: blocked.** No production DNS was changed. V1 was not touched.

## Live destination

Ephemeral Cloudflare quick tunnel against a local `next start` of this worktree (`127.0.0.1:3020`). **Not staging.** Dies when this machine or the tunnel process stops. Do not bookmark.

- Session URL (ephemeral): `https://mixer-ongoing-enjoy-intend.trycloudflare.com/en`
- Verified 2026-10-30: HTTPS 200 on `/en`, `/en/plans` (canonical **$2,500** diagnostic), `/es/specialties/infectious-disease`, and `GET /api/v1/ops/state`. `X-Robots-Tag: none`.
- Indexing remains off (`robots: noindex` in the app shell)

Do not treat this hostname as a client demo once the process exits.

## Why durable hosts are blocked

| Option | Observed 2026-10-30 | Decision |
| --- | --- | --- |
| GitHub Actions preview | Workflows are CI only (`quality`, `e2e`, CodeQL, labels). Environment `preview` exists (`id` 25808364325) with **0 secrets** and 0 protection reviewers. No deploy job. | Cannot publish an HTTPS preview from Actions without founder-supplied host secrets. |
| Netlify draft of this V2 repo | No `.netlify` link, no `netlify.toml`, no `NETLIFY_AUTH_TOKEN`, no Netlify CLI config on this workstation. ADR-0001 keeps Appwrite Sites as the approved host. | Do not create a Netlify site or production deploy from this agent. |
| Appwrite Sites (intended) | Appwrite MCP API namespace is **error** (discovery failed; `mcp_auth` timed out earlier). No isolated V2 project ID exists. V1 Cloud project must not be reused. | Blocked on founder create of a **new** ROOT V2 project. |
| `v2.dirtrcm.app` CNAME | Zone `dirtrcm.app` (account `f5741cef2e8e466e32f431d33943c9f7`) has **no** `v2` record. Apex CNAME, wildcard A, www, api, MX, SPF, DKIM are in place for the existing site + email. | Not written. Founder-approval / possible-charge action. Do not point apex at V2. |
| `rootrcm.com` | Not on this Cloudflare account. | Untouched. |

## Issue #29 (not fixed on `1f4f3b2`)

Independently verified: `src/server/operations/store.ts` still uses a process-global `let live`; `src/app/api/v1/ops/actions/route.ts` still takes `persona` from the JSON body; `authorizeOpsPreview` still mints staff membership from that caller-supplied value. **Agent 1 is fixing isolation.** This agent did not rewrite the ops engine. Playwright contract tests in `tests/e2e/ops-session-isolation.spec.ts` are skip-free and are expected to fail until that fix lands.

## Remaining founder actions (exact)

1. Create a **new** Appwrite Cloud project for ROOT V2 (suggested name `root-v2-preview`). Do not copy V1 `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
2. Bind Appwrite Sites on that project to this GitHub repo; hostname **not** `rootrcm.com`.
3. Add GitHub Environment `preview` secrets for the new project only (no V1 keys). Optional: protection reviewers.
4. Approve (or reject) a **new** `v2.dirtrcm.app` CNAME to the chosen isolated host. Do not edit existing apex/MX/SPF/DKIM records.
5. Optional Netlify: authenticate CLI and link a **draft-only** site for this V2 repo if Appwrite Sites is delayed. Not production.
6. Independent human approval of [PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) before `main`. Author cannot self-approve. This agent will not merge it.

## Explicit non-actions

- `rootrcm.com` DNS, MX, SPF, DKIM, DMARC, and email routing were not changed.
- Existing `dirtrcm.app` apex/wildcard/www/api/MX/SPF/DKIM records were not edited.
- No Appwrite V1 site, function, or table was modified.
- No Netlify/Vercel production host was added.
- Integrations remain typed disabled.
