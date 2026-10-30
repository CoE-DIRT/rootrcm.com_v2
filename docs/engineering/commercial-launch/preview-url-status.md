# Isolated HTTPS client demo — preview URL status

Canonical live status: [../preview-url-status.md](../preview-url-status.md).

**Durable Appwrite Sites preview: still blocked.** A GitHub Environment named `preview` now exists. No Appwrite V2 project, Sites host, or production hostname was created. V1 was not touched.

## What is live in this workstation session

An ephemeral Cloudflare quick tunnel was opened against a local `next start` of this branch. It is **not** a durable client demo and dies when this machine or the tunnel process stops.

- Session URL (ephemeral): see [../preview-url-status.md](../preview-url-status.md) (`https://mixer-ongoing-enjoy-intend.trycloudflare.com/en` as of this workstation session)
- Verified 2026-10-30: HTTPS 200, Plans catalog including **$2,500** diagnostic, Spanish Infectious Disease page
- Indexing remains off (`X-Robots-Tag: none`)

Do not bookmark this hostname. Do not treat it as staging.

## Remaining founder approvals (exact)

| Gate | Observed 2026-10-30 | Required |
| --- | --- | --- |
| Dedicated **ROOT V2** Appwrite Cloud project | Not provisioned. V1 Cloud project must not be reused. | Org-admin create of a **new** project (suggested name `root-v2-preview`). Do not copy V1 `NEXT_PUBLIC_APPWRITE_PROJECT_ID`. Cost: Appwrite Sites on the existing Cloud plan; escalate only if this org is on a paid Sites add-on rather than Starter. |
| Appwrite Sites host bound to that project | None | Founder/admin connect this GitHub repo to the new project’s Sites, hostname **not** `rootrcm.com`. |
| GitHub Environment `preview` | Created (`id` 25808364325). No protection reviewers, no secrets. | Add environment secrets after the Appwrite project ID exists. Do not paste V1 keys. |
| Independent approval of [PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) | Open, `mergeable_state` blocked by 1-approval ruleset. Author cannot self-approve. | Reviewer who is not `aashaukatc`. |

## Explicit non-actions

- `rootrcm.com` and existing V1 were not touched.
- No Appwrite V1 Site, function, or table was modified.
- No Netlify/Vercel production host was added (ADR-0001).
- Integrations remain typed disabled. Proof slots remain unpublished.

Issue: [#6](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/6).
