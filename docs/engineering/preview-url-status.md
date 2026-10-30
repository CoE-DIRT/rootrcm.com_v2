# Isolated HTTPS preview — status

**Recorded:** 2026-10-31 ~04:00 PKT by Agent D against `feat/release-qa` documenting `origin/feat/p0-p1-public-shell` @ `470b76c`.  
**Durable Appwrite Sites / GitHub preview / Netlify draft: still BLOCKED.** No production DNS was changed. V1 was not touched. Founder snapshot was not killed or rebuilt.

## Ports actually listening (this workstation)

| Port | Process | Origin | SHA / note | Agent D action |
| --- | --- | --- | --- | --- |
| `127.0.0.1:3032` | Next (`next start`, pid 2228) | Live V2 UI | HTTP 200 `/en`, `/en/plans`, `/en/specialties/infectious-disease`, `/es/specialties/infectious-disease`, `/en/preview/{sales,client,staff}`, `/en/cookies`. `/en/careers` and `/en/sitemap` 404. | Documented. Did not bind a second Next. |
| `127.0.0.1:8787` | Go healthcare simulator | `GET /healthz` 200; `GET /v1/capabilities` 200, `live: false`, `source` synthetic | Matches `services/healthcare-go` loopback default. `/health` 404 (not an outage). | Documented. Did not restart. |
| `127.0.0.1:3021` | Founder snapshot Next | Isolated `C:\Dev\ROOT\_ROOT_V2_PREVIEW_20261031-000225` detached `5c025cd` | HTTP 200 `/en`. **Left running.** | Do not kill, rebuild, or retarget. |
| `127.0.0.1:3020` | `rootrcm-ops-a` `next start` | HTTP 200 `/en` | Older/parallel preview. | Untouched. |
| `127.0.0.1:3010` | Playwright default | Nothing listening | `playwright.config.ts` default | Not started (would collide if CI-local). |

Playwright in CI uses an ephemeral `next start` on 3010. Local humans should not assume 3032 is the Playwright port.

## Ephemeral tunnels

Cloudflared processes are already running against **3020** (several) and **3021** (one). Agent D did **not** open another tunnel and did **not** kill existing ones.

| Hostname | Check 2026-10-31 ~04:00 PKT | Verdict |
| --- | --- | --- |
| `https://exhibit-debate-dont-and.trycloudflare.com/en` (previously documented) | DNS NXDOMAIN | **Expired. Do not bookmark.** |
| `https://mixer-ongoing-enjoy-intend.trycloudflare.com/en` | previously 504 | Expired |
| `https://closure-pets-byte-odds.trycloudflare.com/en` (PR #19 comment) | not re-verified this pass | Treat as dead unless a browser tab still loads |

**No durable client HTTPS URL exists.** Workstation tunnels die with the process. Optional new tunnel was skipped because (1) founder 3021 must stay up, (2) four cloudflared processes already exist, (3) previous hostnames are unverifiable.

## Why durable hosts are blocked

| Option | Observed 2026-10-31 | Decision |
| --- | --- | --- |
| GitHub Actions preview | Workflows are CI only (`quality`, `e2e`, CodeQL, labels, go-healthcare). Environment `preview` (`id` 25808364325) has **0 secrets**. | Cannot publish HTTPS from Actions without founder host secrets. |
| Netlify draft | No `.netlify` link, no `netlify.toml`, no `NETLIFY_AUTH_TOKEN`. ADR-0001 keeps Appwrite Sites. | Do not create a Netlify site. |
| Appwrite Sites | Connected workspace still lists only the live V1 ROOT project. No isolated V2 project ID. | **BLOCKED** on founder create of **new** `root-v2-preview`. Do not reuse V1. Do not create paid resources from this agent. |
| `v2.dirtrcm.app` CNAME | Not written. | Founder-approval / possible-charge. Do not point apex at V2. |
| `rootrcm.com` | Not on the connected Cloudflare account. | **Untouched.** |

## Remaining founder actions (exact)

1. Create a **new** Appwrite Cloud project for ROOT V2 (suggested name `root-v2-preview`). Do not copy V1 `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
2. Bind Appwrite Sites on that project to this GitHub repo; hostname **not** `rootrcm.com`.
3. Add GitHub Environment `preview` secrets for the new project only.
4. Approve or reject a **new** `v2.dirtrcm.app` CNAME. Do not edit apex/MX/SPF/DKIM.
5. Independent human approval of [PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) before `main`. This agent will not merge it.
6. Optional: authenticate Netlify CLI for a **draft-only** site if Appwrite Sites is delayed. Not production.

## Explicit non-actions

- Founder snapshot `C:\Dev\ROOT\_ROOT_V2_PREVIEW_20261031-000225` was not modified, reset, or stopped.
- `rootrcm.com` DNS, MX, SPF, DKIM, DMARC, and email routing were not changed.
- Existing `dirtrcm.app` records were not edited.
- No Appwrite V1 site, function, or table was modified.
- No paid cloud resource was created.
- Integrations remain typed disabled.
