# ROOT V2 — Architecture & Data Ownership

```text
Public visitor -> Next.js App Router on Appwrite Sites (SSR)
  -> public content and consultation forms (business-only contact data)
  -> Appwrite Functions / server routes
     |-> Appwrite Auth + Teams + TablesDB  (identity, org, onboarding, memberships, entitlements, requests)
     |-> HubSpot API                       (sales contacts, companies, deals)
     |-> Stripe Checkout + Billing         (financial records, subscriptions)
     |-> Apollo                            (enrichment/prospecting only)
Authenticated client / employee -> tenant-verified service access -> audited Appwrite data
```

## Privacy and security
No direct calls from exposed frontend to HubSpot private API or Stripe secret key. API keys stored in Appwrite environment or other approved secret store only. Verify signatures, use idempotency keys and backoff. Audit tenant membership at each server request. Separate V2 dev/stage/prod projects and origins. Data retention, DPA/BAAs and processor roles must be reviewed before any PHI-containing workflow.

## Delivery phases
P0 docs/design -> P1 UI shell -> P2 synthetic full workflows -> P3 Appwrite auth/tenant data -> P4 commercial/CRM -> P5 DIRT integrations -> P6 security/SEO/launch.
