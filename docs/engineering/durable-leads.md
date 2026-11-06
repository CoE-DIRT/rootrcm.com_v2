# Durable lead capture (Appwrite TablesDB)

Status: implemented, **OFF by default**. No live write has been exercised (no fixtures or key available to CI).

Flow: `POST /api/v1/public/inquiries` → same-origin JSON, 8 KB cap → honeypot → validation + PHI hint screen → per-IP/per-email limits →
`lead_submissions` (deterministic id = idempotency; same-UTC-day duplicate is acknowledged identically) → `consent_records` →
`crm_sync_jobs` (`hubspot`, `notify`, status `pending`) → `audit_events`. `202 accepted_persisted` only after the lead row is written; any store error returns 503.

Outbox: `drainOutbox()` (src/server/leads/outbox-worker.ts) applies exponential backoff (1 min doubling, 6 h cap, 6 attempts → `dead`). A target with no enabled
transport is skipped without consuming attempts, so backlog delivers once HubSpot/notifications are approved. No CRM or email is called inline.

Activation (owner approval required, in order):
1. Run `scripts/ROOT_V2_Audit_Lead_Tables.ps1` (read-only); reconcile any column warnings (do not recreate tables).
2. Create `APPWRITE_LEADS_API_KEY` scoped to rows read/write on the four tables; set `ROOT_LEAD_HASH_SALT`; set `ROOT_ENABLE_LEAD_CAPTURE=true`.
3. Enable the form: `inquirySubmissionEnabled` in `src/components/forms/business-inquiry-form.tsx` is a frontend-owned file and still `false`.
4. Wire a scheduled caller for `drainOutbox` (Appwrite Function/cron) and the HubSpot transport behind `ROOT_ENABLE_CRM`.

## Schema contract (live `root_v2_core`, verified read-only in the PR #82 audit)
`src/server/leads/lead-schema.ts` encodes required/optional columns for `lead_submissions`, `consent_records`, `crm_sync_jobs`, `audit_events`, `crm_contacts`, `crm_companies`.
Write order: company → contact → consent → jobs (`hubspot`, `internal`) → audit → **lead (last)**. Every id is deterministic and every create idempotent, so a retry repairs any
partial chain; 202 only when all rows are confirmed. The free-text `message` is PHI-screened but **not stored** (no live column). Consent is `service_contact`, never marketing.
Enum-like values (`LEAD_VALUES`) must be confirmed against the live columns in the isolated hosted smoke test.

## Activation gates (all required, else route stays 503)
`ROOT_ENABLE_LEAD_CAPTURE=true`, `APPWRITE_LEADS_API_KEY`, `ROOT_LEAD_HASH_SALT` (>=16 chars), `ROOT_LEAD_SHARED_RATE_LIMIT=true` (attests a shared edge limit; the in-process limiter is only a backstop), `ROOT_AUTH_ORIGIN`.
The outbox has no scheduler or transport wired; HubSpot/Apollo are never auto-enabled. The Appwrite store has no compare-and-set, so transports must be idempotent on `idempotencyKey`.

## Reconciliation with `worktrees/root-lead-intake` (uncommitted, left untouched)
That worktree holds a competing uncommitted intake (`appwrite-intake.ts`, `lead-intake` validation, own limiter) that enables the route whenever `intakeConfigured()`, with no salt/shared-limit gate. Do not merge it; port any unique validation ideas into this module after review.
