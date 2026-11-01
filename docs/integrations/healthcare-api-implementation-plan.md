# ROOT V2 — Healthcare API implementation backlog and Cursor handoff

**Status: STAGED FOR REVIEW, NOT IMPLEMENTED.** 2026-10-31.  
**Base:** `feat/p0-p1-public-shell` / PR #19; preserve ongoing Cursor work.  
**Supporting:** [ADR-0003](../decisions/ADR-0003-healthcare-api-staging.md), [source register](./healthcare-api-register.md), [payer gap matrix](./payer-coverage-matrix-template.csv).  
**Explicitly deferred:** Redox, DataSpring/CAQH Provider Data and AMA CPT licensing. Do not scaffold adapters for them now.

## Relationship to current ROOT V2 delivery

Do **not** modify or prematurely merge current P0/P1 public-site work, the existing PR #19, or `main`. Existing Appwrite/HubSpot/Stripe/Apollo adapters and synthetic ops UX remain unchanged. This backlog adds future healthcare vertical slices after stable design, quality checks, isolated Appwrite projects and proper approval. `ROOT_ENABLE_LIVE_CLAIMS` remains hard false. This planning PR should be draft and docs-only; no environment, IAM, DNS, public website or production data changes.

The existing `src/domain/integrations/payer.ts` and `src/integrations/payer/client.ts` are **typed disabled** scaffolds, not live claims. Never replace them with vendor-specific code in the UI. Build future typed `src/domain/healthcare/` contracts and `src/server/healthcare/` read-only reference facades first; once authorized, integrate with a separate governed DIRT Go/EDI service, not a second authoritative financial ledger in V2.

## Milestones and acceptance gates

| Order | Slice | Deliverables (future PRs, not this documentation PR) | Test and exit evidence | Prerequisite |
| --- | --- | --- | --- | --- |
| H0 | Inventory/governance | This ADR, source register, payer matrix, code/effective-date rules, provider ownership boundaries | Reviewer acceptance; no new dependencies/flags | Current branch review |
| H1 | Reference contract + ingestion | Common types `CodeSystemRelease`, `CodeSearchResult`, `FeeScheduleRate`, `CoveragePolicy`, `ProviderPublicIdentity`, `ExclusionMatch`, `ReferenceProvenance`; official ingestion for ICD-10-CM/PCS, HCPCS Level II, PFS RVU, NCCI, NPPES, OIG | SHA/release provenance; effective-date/digest checks; fixture-only tests; no CPT Level I descriptor repository | H0 |
| H2 | Free reference UX | Read-only provider NPI verification, diagnosis/HCPCS autocomplete, PFS+specialty fee benchmarks, coverage search, excluded-provider REVIEW states. Later add ASC/OPPS/CLFS/DMEPOS/ASP, RxNorm, UMLS/WHO, SAM, HRSA, openFDA, CMS public APIs as distinct read models | EN/ES, accessibility, empty/stale/error states; never claims authoritative network/contract data; sample-only pages where not live | H1 + Figma mapping |
| H3 | Payer capability registry + routing contract | Stable canonical payer key, alias IDs, state/program/product/transaction support, enrollment state, update timestamps, Stedi payer sync (daily when permitted); gap classification; per-transaction adapter selection | `SUPPORTED`, `ENROLLMENT_REQUIRED`, `NOT_SUPPORTED`, unknown; unit tests; fail closed on missing payer/contract/auth | H1 + provider account entitlement |
| H4 | Synthetic clearinghouse integration | Normalized interfaces and safe mocks for 270/271; later 837P, 277CA, 276/277, 835; include 837I/D and 275 only as separate phased capability extensions; Stedi dev harness within documented sandbox limits | OpenAPI contract tests, invalid input/timeout/401/429/webhook forgery, idempotency, no real PHI; **no assumed sandbox test-837 support** | H3 + DIRT contract review |
| H5 | Enrollment/status workflow | Distinct provider Type 1/group Type 2, TIN, practice location, licence, exclusion, payer credentialing/application, payer contract, in-network participation, PECOS, EDI/ERA/EFT enrollment; evidence links, human verified timestamps and owner tasks | Cross-status confusion tests, audit trail, expiry/effective dates; no generic 'provider is in network' derived from 271 | H1/H3 |
| H6 | Conditional coverage gaps | Refresh payer matrix; verify Stedi limitations by transaction and payer ID; evaluate Availity terms and exact incremental coverage; enable no secondary adapter until business case and approval | Verified plan/state/program coverage evidence, cost limits, test accounts, failover replay tests | H3/H4 |
| H7 | Healthcare production decision | Separate PHI/data boundary and vendor contracts; HIPAA/BAA/covered-service inventory, tenant-isolation proof, credential scopes, managed secrets, log redaction, financial reconciliation, Go policy, owner authorization and rollback | Signed legal/security, representative payer transaction tests, restore/replay, per-payer enrollment evidence | G4 decision; not automatic |
| H8 | Optional governed analytics | Versioned public data enrichment, QPP *reference/preview* if separately approved, no automatic reporting submission; controlled DIRT consumption of normalized reference tables | Source/metric lineage, allowable data, cost thresholds and human validation | H7 or a separate approved non-PHI analytics slice |

**Definition of staged:** H0 documents committed on a separate branch and draft PR. **Not staged:** live API keys, actual payer connections, PHI processing, contracts, payer approvals, production eligibility/claims, or completion of H1–H8.

## Canonical API contracts (proposed for later coding)

- `GET /api/v1/healthcare/reference/releases`: releases, source digests, effective dates and allowed uses.
- `GET /api/v1/healthcare/codes/search?system=icd10cm|icd10pcs|hcpcs2&date=...`: versioned public code lookup; CPT Level I FULL CONTENT DISABLED.
- `GET /api/v1/healthcare/fee-schedules/estimate?program=mpfs|asc|opps|clfs|dmepos|asp&date=...&locality=...`: public Medicare baseline only, never a private negotiated rate.
- `GET /api/v1/healthcare/providers/npis/:npi`: NPPES public identity; clearly not payer enrollment or network status.
- `GET /api/v1/healthcare/coverage/policies`: public CMS policy reference with effective date/source.
- `GET /api/v1/healthcare/payers/capabilities`: internal, authenticated, non-PHI transaction-support matrix with source freshness and enrolment requirements; no assumed plan coverage.
- `GET /api/v1/healthcare/enrollment/tracker`: authorized organization-scoped metadata with evidence and human verification, **not** automatic payer decision feed.
- Future `POST /api/v1/healthcare/eligibility/check`, `/claims/submit`, `/claims/status`, `/remittances/import`: **DISABLED** until H7; PHI routes must remain inside approved regulated execution boundary with Go policy/tenant enforcement.

Return `{data,meta:{correlationId,source,release,effectiveDate,asOf,status},error:{code,message}}` with provenance and explicit errors. Read-only public routes may use normal rate limits/cache; PHI-bearing actions require their own authentication, policy, logging, audit and data path. Avoid using a fake 200 success for disabled providers.

## Payer capability model

Canonical key: `payer_ref` + source payer ID + payer family + state + program (Medicare FFS/MA, Medicaid FFS/MCO, commercial, TRICARE, workers comp etc.) + plan/product (where known) + transaction + provider/group enrollment context. Store alias history, contract rights, route priority, supported/enrollment-required/not-supported/unknown and last successful sandbox/live evidence with provenance. Never use insurer brand alone as routing key.

For each transaction:
1. Reject missing patient authorization/payer-provider enrollment, insufficient credentials or unsupported capabilities.
2. Route to Stedi only when `SUPPORTED` or successfully enrolled. Track unique outbound intent and vendor submission reference.
3. Evaluate Availity only on a verified gap AND authorized secondary account; do not bill through both by default.
4. If no approved electronic route, create a **manual portal follow-up work item** with owner, evidence and date; no fabricated query result.
5. Reconcile ambiguous 837 outcomes and 277CA before any alternative submission; 835/ERA must match remittance identity and signed adjustments, reversals, offsets.
6. Daily capability refresh where permitted; keep historical support decisions for audit; review significant payer ID changes.

## Provider/group credentialing status model

Track separate `provider_identity`, `license_verification`, `exclusion_screening`, `caqh_profile` (manual/unknown while paid DataSpring deferred), `payer_credentialing`, `payer_application`, `payer_contract`, `payer_network_participation`, `medicare_pecos`, `edi_claim_enrollment`, `era_enrollment`, `eft_enrollment` records. Each includes Type1/Type2 NPI, TIN/reference, payer, state, product, location, status, submitted/effective/expiry date, verified as-of, primary evidence link, source and human reviewer; absent information is `UNKNOWN`, never inferred `ACTIVE`. A signed contract is not the same as payer effective-network date.

## No-PHI free development lane

Reuse V2's existing TypeScript tests, `tests/payer-ehr.test.ts`, synthetic ops seed and disabled adapters. Do **not** create a competing new mock-server runtime if existing fixtures and the same testing stack can support these contracts. When authorized, add deterministic contract fixtures for 270/271, 837P/277CA, 276/277, 835 with fabricated identities and synthetic control totals. Use the existing GitHub Actions pipeline for schema/type/test/secret-scan checks. Stedi sandbox is optional and scope-restricted; confirm entitlement and supported calls before spending or believing 837 test can be submitted through it. No purchase needed to produce mock contracts and code-system import tests.

## Implementation guardrails and Cursor work separation

- This branch edits **only** new documents. Do not rebase, force push, modify or merge `feat/p0-p1-public-shell`, `main`, PR #19 or Cursor's local files.
- The engineering team should start H1 only as an independent `feat/healthcare-reference-h1` branch/worktree with a precise issue, Figma component mapping, and no concurrent edits to Cursor's current files.
- All proposed APIs are server-side adapters, isolated by exact source ID and data class. No credential in `NEXT_PUBLIC_*`, GitHub, Figma or issue bodies. Do not create `.env` changes in this planning PR.
- Commercial Appwrite/HubSpot/Stripe/Apollo activation remains governed by `docs/engineering/integrations-activation.md`; this healthcare plan is an extension, not an override.
- No live payment/claim/EHR data, payer checks on real members, code certification, PHI-ready claims or third-party partnership claims until separate approval.

## Acceptance / rollback for this documentation PR

- [ ] Approver verifies all included source IDs and three deferrals.
- [ ] Existing P0/P1 repo code unchanged; no dependency, environment, secret or CI mutation.
- [ ] Source and payer status unknowns are labeled; neither free APIs nor clearinghouses imply all-payer coverage.
- [ ] No live healthcare integration claimed.
- [ ] Merge only by normal review on the established feature-branch flow; closing the PR restores status quo with zero runtime impact.
