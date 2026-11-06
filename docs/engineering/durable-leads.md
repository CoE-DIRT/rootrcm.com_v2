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
