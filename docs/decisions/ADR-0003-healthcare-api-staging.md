# ADR-0003 — Stage healthcare reference and payer API capabilities in ROOT V2

**Status:** PROPOSED / IMPLEMENTATION NOT AUTHORIZED  
**Date:** 2026-10-31  
**Parent branch / review path:** `feat/p0-p1-public-shell` (PR #19 to `main`)  
**Related existing issue:** #8 (integration contracts), #6 (isolated Appwrite), #20 (fail-closed public inquiry).  
**Scope:** planning, non-secret contracts, safe synthetic dev only. No implementation or production enablement is claimed by this ADR.

## Decision and precedence

The owner wants the healthcare reference, payer-transaction, provider-verification, enrollment/status, and free developer capabilities in the ROOT V2 product roadmap. Preserve current V2 Next.js/TypeScript + Appwrite Sites/Auth/Teams/TablesDB/Functions architecture, the commercial CRM/payment ownership, and the active Cursor work. Retain DIRT's vendor-neutral clearinghouse / governed Go and PostgreSQL healthcare boundary rather than placing PHI and claims processing in public web or commercial Appwrite tables without a separate reviewed architecture.

**Defer explicitly (no license purchase, vendor signup, SDK, credentials, production dependency or marketing activation):**
1. Redox / managed EHR interoperability (and do not silently replace it with Rhapsody);
2. DataSpring / CAQH Provider Data and paid CAQH organization API access;
3. AMA CPT Level I licensing (no unlicensed CPT descriptions or code-content redistribution).

Do not treat these as implementation blockers for the public-reference and synthetic components below. A production-grade CPT editor/comprehensive CPT content requires a future licensed source and separate approval.

## Architectural placement and single authority per concern

| Boundary | Owns | Must NOT own |
| --- | --- | --- |
| ROOT V2 Next.js + Appwrite | Public/reference UI, authenticated non-PHI client workspace, business onboarding, provider/organization task metadata, account permissions, approved non-PHI sync status | Unapproved PHI, EDI payloads, complete financial/claim ledger or autonomous payer submissions |
| Public reference ingestion/cache | Versioned CMS/NLM/OIG/SAM/HRSA/FDA releases with effective dates, provenance/digests and license metadata | Live enrolment/network determination, CPT Level I content, payer contract rates |
| ROOT healthcare domain contracts | Canonical payer, transaction, enrollment, code-system, fee-schedule, coverage and status DTOs; typed **disabled** facades; payer capability registry | Vendor business logic in client components or unverified live claims |
| Future DIRT regulated services (separate approval) | PHI-bearing requests, vendor-neutral Go adapters, authoritative claim/ERA reconciliation, tenant-scoped PostgreSQL ledger, governed human review | Secret-bearing API calls in browsers, duplicating the V2 CRM/account database |
| Stedi | Preferred single clearinghouse for 270/271, 837P then 837I/837D as justified, 277CA, 276/277, 835, transaction enrollments, payer discovery; 275 later | Credentialing, provider network contracting decisions, every payer/transaction by implication |
| Availity | Secondary **conditional** route only for verified payer+transaction gaps with account/API authorization | Parallel default submissions or blanket automatic failover |
| Payer/MAC/PECOS/other authorized portal | Source evidence for credentialing decisions, network participation, applications, Medicare enrollment, payer-specific workflow | Claimed universal publicly callable REST status API |
| Appwrite / HubSpot / Stripe / Apollo | Appwrite: identity/orgs/onboarding; HubSpot: sales; Stripe: payment; Apollo: prospect enrichment | Redundant healthcare system of record |

The existing `src/integrations/payer/client.ts` returns a **disabled** adapter, and `src/domain/integrations/payer.ts` enumerates only eligibility, claim status, ERA and prior-auth status. Future claims/277CA/enrollment/attachment capabilities must be introduced as separate reviewed contracts; do not mutate Cursor's files in this planning PR. Prior authorization is neither available merely because the enum says so nor provided automatically by 270/271.

## Safety invariants

- Zero production PHI, member IDs, claim payloads, credentials or private payer contract rates in public repo, tests, analytics, screenshots, demo fixtures or agent prompts.
- `ROOT_ENABLE_LIVE_CLAIMS` stays hard false. No new env flag, outbound call or submission route is activated by this ADR.
- Version all terminology and fee schedules by code system + source release + effective date + jurisdiction + modifier/POS where applicable. Validate license terms, including CPT codes referenced in CMS rate releases.
- NPPES identity, licensure, exclusion, CAQH/attestation, payer credentialing, payer contracting, network participation, Medicare enrollment, EDI submitter enrollment, EFT and ERA enrollment are **distinct facts** with distinct sources and provenance.
- A 271 response is patient-plan coverage/benefit evidence, not definitive provider in-network proof. An X12 834 member-enrollment transaction is not a provider credentialing application.
- Coverage is measured by payer ID **and** transaction, plan/program, location and authorization. Stedi's payer catalog is a changing routing dataset, not proof ROOT is enabled; refresh daily where permitted.
- Never retry an ambiguous 837 via a second network until receipt/277CA and submission IDs are reconciled. ERA routing changes require explicit enrollment review.
- No paid APIs, licenses, BAA obligations or chargeable account actions without commercial and security approval. Free dev means synthetic mocks and permitted sandbox usage only; check current entitlements and quotas.
- Public marketing must display disabled/demo indicators and may not advertise live payer connections, HIPAA readiness or universal payer coverage.

## Required documentation and safe handoff

- [Healthcare API registry](../integrations/healthcare-api-register.md): each included and deferred source, source type, unique responsibility and activation status.
- [Implementation backlog](../integrations/healthcare-api-implementation-plan.md): milestones, adapter contracts, dev test approach, security/financial quality gates and handoff.
- [Payer coverage audit template](../integrations/payer-coverage-matrix-template.csv): unknown until evidence-backed; never label a payer connected from name alone.

## Decision gates

**G0 Planning only:** this ADR plus registry, matrix and actionable backlog, reviewed against existing V2 and DIRT decisions.  
**G1 Safe reference-data development:** official public terms checked; fixtures cached/versioned; no PHI; import and schema tests.  
**G2 Clearinghouse synthetic contracts:** provider-neutral mock, contract schema, denied-by-default API, sandbox features independently verified.  
**G3 Authorized non-PHI provider/portal workflows:** source and human evidence, no fabricated enrollment statuses.  
**G4 Production healthcare consideration (separate decision):** legal/BAA/covered services, approved hosting/data boundary, payer enrollment agreements, tenant isolation, policies, audit, billing, reconciliation, rollback and named human signoff. A G0–G3 pass never auto-approves G4.

This ADR is a *proposal* on a separate branch; PR review and formal approval are required. It does not supersede ADR-0001, PR #19, or the DIRT Go/PostgreSQL policies.
