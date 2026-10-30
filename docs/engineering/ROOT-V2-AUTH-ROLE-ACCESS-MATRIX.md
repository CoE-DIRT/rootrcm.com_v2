# ROOT V2 — Auth / role / access matrix

**SHA:** `470b76c` · **Owner:** Agent D (documentation). Implementation remains Agent B.  
**Do not read this as a live IdP.** Appwrite V2 is `BLOCKED_EXTERNAL` (issue #6).

| Actor | Intended control | What exists on `470b76c` | Server enforcement | Status |
| --- | --- | --- | --- | --- |
| Anonymous visitor | Public IA, no PHI | All public `src/app/[locale]` pages; `robots: noindex` | None needed | **DONE** as public shell |
| Business inquirer | Consent + HubSpot | Form visible; submit **disabled**; API fail-closed | Route returns non-success without CRM | **PARTIAL** |
| Client owner | Appwrite email/OAuth, org membership | `/sign-in` links to `/preview/client` | `principalFromCookieHeader` always null | **MISSING** real auth |
| ROOT staff | Invite-only, MFA later | `/sign-in` → `/preview/staff` | Ops capability from **signed presentation cookie**, not Appwrite role | **PARTIAL** preview only |
| Operator / demo reset | Staff-only actions | `DemoOperator` + `/api/v1/ops/actions` | Cookie signature; omitted capability fails closed to `client` | **PARTIAL** (PR #30/#34) |
| Auditor | Read-only | No auditor role in Appwrite | N/A | **MISSING** |
| Cross-org read | Forbidden | Org `<select>` disabled; seed orgs Bayview / Cedar Grove / Metro ASC | Ops store filters by `orgId`; Playwright isolation | **PARTIAL** in-process Map only |
| Billing admin | Stripe customer portal | `/preview/billing` catalog map | No Stripe session | **MISSING** |
| Google / Microsoft IdP | Appwrite OAuth | No buttons wired to live providers | N/A | **MISSING** — would be disabled until V2 credentials exist |

Persistence: `ROOT_DEMO_SESSION_BACKEND` is `memory` plus a fail-closed durable stub. Keep issue #29 open until a reviewed Appwrite V2/KV driver exists. Do not invent credentials.

V1 Appwrite project **ROOT — Revenue Operations & Outcomes Technology** must not receive V2 secrets, Sites, or webhooks.
