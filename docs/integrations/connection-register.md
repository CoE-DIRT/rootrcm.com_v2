# ROOT V2 — Connector and integration register

**This is an architecture register, not evidence that connected credentials or production integrations are active.**

| Platform | Purpose / system of record | Source boundary | Target readiness | Activation gate |
|---|---|---|---|---|
| Figma | Approved design variables, screens, component identities | Read/handoff links | Design source identified | Node parity audit and review |
| GitHub | Version control, PR, Actions, Issues | CoE-DIRT/rootrcm.com_v2 | Connected; public repo | Branch protection, approvals and CI checks |
| Cursor / Codex / Claude / OpenCode | Code assistance | Local, least-privilege branch access | Developer tooling only | Repo rules and model spend limits |
| Appwrite | V2 Auth, Teams, TablesDB, Functions, Storage, Sites | Separate V2 projects only | Adapter scaffold | Nonproduction project and tenant security review |
| HubSpot | Sales CRM, contacts, companies, deals | Server API only | Adapter disabled | Consent/deduplication and sandbox |
| Apollo.io | Prospecting and enrichment | Authorized B2B contacts only | Adapter disabled | Mapping, provenance and opt-out policy |
| Stripe | Checkout, billing and subscriptions | Verified server webhooks | Adapter disabled | Sandbox, financial reconciliation and legal approval |
| Google Drive | Working docs and reviewed handoffs | Approved non-PHI files | Optional manual sync | File ownership, sharing and scope check |
| Google Review Link & QR | Relevant business review links, when appropriate | Approved business profiles | Optional | Ownership and advertising/review-policy verification |
| ChatGPT Sites / Google Sites | Stakeholder static preview | Synthetic-only Demo 6 | Optional publication | Distinct preview URL, approval, no PHI |
| Analytics/Data | Events and synthetic metrics | Privacy-reviewed fields | Disabled | Cookie consent, retention policy and privacy review |

## Routing and data authority
Appwrite = application identity, orgs, memberships, requests, entitlements.
HubSpot = sales lifecycle. Stripe = financial lifecycle. Apollo = lead enrichment/provenance.
**Never write private API credentials into the repository; public frontend directly calls none of these secret APIs.**

## Handshake for each integration
1. Confirm organization/account and project explicitly; verify access level.
2. Approve data categories and documented processing/legal basis.
3. Write typed contract + mocked/disabled adapter.
4. Configure environment-specific credentials in the provider secret store.
5. Test authentication, retries, error handling, rate limits, dedupe, idempotency and rollback.
6. Record smoke test + owner signoff in issue/PR. Only then enable the feature flag.

No automatic prospect imports, CRM writes, authentication accounts, payment products or production Appwrite data creation are authorized by this register.
