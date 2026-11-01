# ROOT V2 — Client command center: operational data and integration contract

**Implementation branch:** `feat/client-rcm-credentialing-command-center-20261030`  
**Figma source:** 05 Customer Portal, node `5:138`; additive enhancement to existing workflow coverage, not a redesign.  
**Current state:** All sample entries are synthetic; no patient data, live EHR calls, or actual payer/provider enrollment status is displayed.

## Client-visible outcomes

On sign-in, an authorized organization member must land on a tenant-scoped workspace containing:
- **Scheduling/practice operations:** appointment readiness, benefit verification exceptions, authorization queue, charge capture, and staff-assigned next actions.
- **Full RCM lifecycle:** appointment → eligibility → authorization → charge coding → 837 submission → 999/277CA acceptance → 276/277 payer status → 835 remittance → denial/appeal/A/R follow-up and reconciliation.
- **Credentialing (first class):** provider × payer × location × application type, current milestone, submission/acknowledgement, payer-specific review, owner, next action, due/SLA, effective date, outstanding evidence and audit trail.
- **Client vs internal:** clients see only their org and approved updates; internal staff queues show work assigned to their role. Do not expose cross-tenant data in aggregate counts or filters.
- **Truthful provenance:** record source (API, attested portal, staff verified, synthetic), last confirmed timestamp, stale indicator, and whether the value is externally verified.

## Minimum normalized records before live data

**Organization:** `orgId`, Appwrite Team ID, subscriptions, enabled modules.

**Payer connection:** `orgId`, payer internal ID, external payer code, approved vendor, supported transaction types, authorized credential reference (server only), health, last successful sync, last error class, environment.

**Claims:** `orgId`, opaque claim ID, payer, submission ID, stage, 837/999/277CA/276/277/835 references where relevant, source, lastCheckedAt, nextAction, assignedOwner, record version. Claim details with PHI remain in approved protected repositories, not public fixtures or browser logs.

**Eligibility:** `orgId`, opaque eligibility request ID, payer ID, coverage effective window, 270 correlation ID, 271 response category, transaction timestamp, source, freshness, exception queue; never display an unverified 'eligible' status.

**Credentialing application:** `orgId`, `applicationId`, `providerId`, `payerId`, practice location ID, enrollment type, CAQH/PECOS reference (restricted), signed packet status, payer submission date/receipt, source-verified stage, associated task owner, due date, payer follow-up history, payer effective date, revalidation date, verifiedAt, source and audit event ID.

**Event:** monotonic `version`, actor (staff/integration), old/new state, evidence reference, timestamp, idempotency key, correlation ID. Historical events immutable.

## Credentialing milestones (payer × provider tracked independently)

1. Intake and completeness.
2. CAQH / attestations / document readiness.
3. Primary-source verification and regulatory checks.
4. Payer packet submission, acknowledgement and application reference.
5. Payer review, requests for additional information and follow-ups.
6. Approved / effective, rejected, withdrawn, or revalidation due.

The six-stage visual is not a blanket claim that every payer uses the same internal process. Support branch states `needs_information`, `on_hold`, `rejected`, `withdrawn`, `expired`, `not_applicable`, `revalidation_due`. A payer submission is not equivalent to approval or a billable effective date.

## Selected transaction / connectivity approach

- **Eligibility:** X12 270/271 via an authorized clearinghouse / Stedi or equivalent configured vendor. Demonstration uses synthetic data until the practice signs and access is granted.
- **Claim status:** X12 276/277 or payer-supported authorized API; 277CA is claim acknowledgement, not current adjudication. 835 is remittance, not a real-time status source. Maintain separate statuses and timestamps.
- **Authorization:** payer-specific portal / authorized 278 or FHIR workflow where available.
- **Practice scheduling:** per-EHR supported APIs (FHIR Appointment/Schedule where available) or approved integration imports. No universal EHR API should be assumed.
- **Credentialing:** CAQH and PECOS where contractually authorized, plus payer portal, roster and credentialing vendor integrations. **No universal real-time payer credentialing status API exists.** If a payer does not expose an authorized programmatic status feed, show the last documented portal/staff-verified update and timestamp, not fabricated real-time status.
- **Transport:** server-only connector; durable queue/outbox, webhook ingestion with signatures, dedupe keys, retry/backoff, reconciliation and dead-letter review. Never expose API keys to browser.
- **Updates:** push through Appwrite Realtime when authorized backend events change, poll external providers only within permitted rate limits and retention; do not equate UI live refresh with new payer information.

## Security and activation gates

- Server re-derives member identity and checks `orgId` with PDP before every data operation; never trust browser tenant selectors.
- Appwrite records enforce tenant scoping and least privilege. No public create/read/update for claim/credentialing records.
- PHI handling requires approved BAA/contract coverage, encryption, audit, retention, access controls and security signoff. Keep public forms and seed/demo free of PHI.
- Credential references, provider numbers and member identifiers are redacted as appropriate; consent controls apply to contact capture.
- Prior to API activation: sandbox test by payer/clearinghouse, reconciliation examples, exact role tests, stale-data fallback, resilience tests and logged last-verified source.
- MCP connectivity to HubSpot/Apollo/Cloudflare alone does **not** establish Next.js backend integration or a production credential. Each integration must be implemented, tested and explicitly activated.

## Demo acceptance

At 375px and desktop widths, the client overview must display synthetic claims, eligibility, scheduling and at least two credentialing application states; the dedicated credentialing tab shows full milestones and next action per payer. All entries visibly carry demo provenance. EN/ES and keyboard selection work. No placeholder should be interpreted as a production status.
