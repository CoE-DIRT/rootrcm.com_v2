# Isolated HTTPS preview — status

**Recorded:** 2026-10-31 00:16 PKT against `feat/p0-p1-public-shell` @ `5c025cd`.
**Durable Appwrite Sites / GitHub preview / Netlify draft: still blocked.** No production DNS was changed. V1 was not touched.

## Live destination

Isolated founder snapshot `C:\Dev\ROOT\_ROOT_V2_PREVIEW_20261031-000225` (detached `5c025cd`, matches `origin/feat/p0-p1-public-shell`) is serving `http://127.0.0.1:3021`. A second `next start` from `rootrcm-ops-a` is on `127.0.0.1:3020` at the same SHA. **Neither is staging.**

Ephemeral Cloudflare quick tunnel (this workstation → `127.0.0.1:3021`). Dies when this machine or the tunnel process stops. Do not bookmark.

- Session URL (ephemeral): `https://exhibit-debate-dont-and.trycloudflare.com/en`
- Verified 2026-10-31: HTTP 200 on `127.0.0.1:3021` for `/en`, `/en/plans`, `/es/specialties/infectious-disease`, `/en/preview/sales`, `/en/preview/client`, `/en/preview/staff`, `/en/preview/credentialing`, and `GET /api/v1/ops/state?orgId=bayview&persona=client`.
- Same paths returned HTTPS 200 through the tunnel with a browser user-agent. A non-browser fetch received Cloudflare 403; that is bot filtering, not an app outage.
- Previous hostname `https://mixer-ongoing-enjoy-intend.trycloudflare.com/en` returned 504 (expired).

Do not treat this hostname as a client demo once the process exits.

## Why durable hosts are blocked

| Option | Observed 2026-10-30 | Decision |
| --- | --- | --- |
| GitHub Actions preview | Workflows are CI only (`quality`, `e2e`, CodeQL, labels). Environment `preview` exists (`id` 25808364325) with **0 secrets** and 0 protection reviewers. No deploy job. | Cannot publish an HTTPS preview from Actions without founder-supplied host secrets. |
| Netlify draft of this V2 repo | No `.netlify` link, no `netlify.toml`, no `NETLIFY_AUTH_TOKEN`, no Netlify CLI config on this workstation. ADR-0001 keeps Appwrite Sites as the approved host. | Do not create a Netlify site or production deploy from this agent. |
| Appwrite Sites (intended) | Appwrite MCP API namespace is **error** (discovery failed; `mcp_auth` timed out earlier). No isolated V2 project ID exists. V1 Cloud project must not be reused. | Blocked on founder create of a **new** ROOT V2 project. |
| `v2.dirtrcm.app` CNAME | Zone `dirtrcm.app` (account `f5741cef2e8e466e32f431d33943c9f7`) has **no** `v2` record. Apex CNAME, wildcard A, www, api, MX, SPF, DKIM are in place for the existing site + email. | Not written. Founder-approval / possible-charge action. Do not point apex at V2. |
| `rootrcm.com` | Not on this Cloudflare account. | Untouched. |

## Issue #29

Engine isolation is on the consolidated candidate via [PR #30](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/30) (`5c025cd`): signed httpOnly presentation cookies, per-session snapshots, operator capability from `/preview/staff` (not JSON `persona`). Skip-free Playwright coverage is `tests/e2e/ops-session-isolation.spec.ts`. Durable **cross-instance** storage still needs an authorized Appwrite V2/KV project; the Node process Map is not a multi-instance store.

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
