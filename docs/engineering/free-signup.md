# Free signup workspace provisioning

Status: implemented, **OFF by default**; no live write exercised. Backend only (no UI change; the Netlify-owned form must call it).

Flow: existing `POST /api/v1/auth/signup` creates the Appwrite user + sends verification. After the email is verified and the user is signed in,
the client calls `POST /api/v1/account/workspace` with `firstName, lastName, phone, practiceName, termsAccepted:true` (+ optional `specialty`, `practiceSize`, `marketingConsent`, `locale`).
Identity is the verified session only; no body field selects a user, org or role. Unverified/pending users get 401 until they verify.

Writes (deterministic ids, idempotent, membership LAST so a retry repairs partial chains): `organizations` → `crm_companies` → `crm_contacts` (phone) →
`consent_records` (`account_terms`; `marketing_email` always recorded explicitly (granted true or false), separate, optional, never implied; reconciled to the final submission on retry) → `audit_events` → `memberships` (`CLIENT_OWNER`).
Specialty/practice size/locale go to the Appwrite account prefs (best-effort). No `entitlements` row: FREE = basic workspace + consultation from the catalog; paid access only from server grants.
A user already in another org (e.g. staff) gets 409; one workspace per user; same practice name for two users = two tenants.

Activation: `ROOT_ENABLE_SIGNUP_PROVISIONING=true`, `ROOT_ENABLE_LIVE_AUTH=true`, `APPWRITE_PROVISION_API_KEY` (never the auth key).
Unverified before enabling: live `organizations` required columns/enum values (`SIGNUP_VALUES`), `crm_contacts.phone`, and consent `consentType` values — confirm in the isolated hosted smoke test.
Follow-up: converge the row writer with the lead-capture store (PR #82) into one module once both are merged.
