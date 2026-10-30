# ROOT V2 — Healthcare API / source registry (non-secret)

**State:** proposed integration inventory, not a connection audit or active API claim. Owner decision recorded 2026-10-31.  
**Authority:** [ADR-0003](../decisions/ADR-0003-healthcare-api-staging.md) and existing [ROOT V2 connector register](./connection-register.md).  
**Architecture:** ROOT V2 owns non-PHI user interaction; the separately gated DIRT healthcare boundary owns future live EDI/PHI, Go policy and PostgreSQL reconciliation. Each source has one assigned job.

## A. Free/public data and developer services (scheduled for ROOT V2)

| ID | Source / canonical URL | Unique capability | Interface | Planned landing | Status |
| --- | --- | --- | --- | --- | --- |
| REF-01 | [CMS/NCHS ICD-10-CM & CMS ICD-10-PCS](https://www.cms.gov/medicare/coding-billing/icd-10-codes) | U.S. diagnoses and inpatient PCS, separate code systems with DOS/discharge effective dates | Dated downloads | Versioned read-only reference cache/search | Planned G1 |
| REF-02 | [CMS HCPCS Level II](https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system/quarterly-update) | Supplies, drugs, devices and Level II procedure codes | Quarterly downloads | Versioned HCPCS Level II search | Planned G1 |
| REF-03 | [NLM Clinical Tables](https://clinicaltables.nlm.nih.gov/) | ICD/HCPCS search/autocomplete UI convenience | HTTP API | Search adapter, not source of record | Planned G1 |
| REF-04 | [CMS Physician Fee Schedule RVU](https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files) | Medicare professional RVU/fee locality baseline | Releases/files | PFS rate evaluator, effective-dated | Planned G1 |
| REF-05 | [CMS ASC/OPPS/CLFS/DMEPOS/Part B ASP](https://www.cms.gov/medicare/payment) | Distinct Medicare facility, lab, equipment and drug pricing benchmarks | Files/calculators by program | Separate modules, single fee-schedule service | Planned G1/G2 by specialty |
| REF-06 | [CMS NCCI PTP/MUE](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits) | PTP and medically unlikely edits | Versioned files | Validation rule/reference engine | Planned G1 |
| REF-07 | [CMS Medicare Coverage API](https://api.coverage.cms.gov/) | National/local coverage determinations and articles | API / subject to terms | Medical-necessity policy search | Planned G1 |
| REF-08 | [CMS NPPES NPI Registry](https://npiregistry.cms.hhs.gov/) | Type 1/2 NPI identity, taxonomy and public location | API + bulk | Provider identity lookup only | Planned G1 |
| REF-09 | [CMS Open Data](https://data.cms.gov/api-docs) | Eligible Medicare public enrollment, revalidation and reference datasets | API/downloads, dataset-specific | Medicare status reference with date/limitations | Planned G1 |
| REF-10 | [PECOS](https://pecos.cms.hhs.gov/) | Medicare individual/group application status via verified user access | **Portal**, not universal public API | Human-verified task/evidence entry | Planned G3 |
| REF-11 | [HHS OIG LEIE](https://oig.hhs.gov/exclusions/) | Federal healthcare exclusion screening | Official downloadable files | Periodic exclusion screening/reference | Planned G1 |
| REF-12 | [SAM.gov public API](https://open.gsa.gov/api/entity-api/) | Federal entity/exclusion-reference corroboration | API subject to key/terms | Separate compliance fact with match review | Planned G1 |
| REF-13 | [NLM RxNorm/RxNav](https://lhncbc.nlm.nih.gov/RxNav/) | Drug nomenclature normalization | API | Optional specialty drug terminology | Planned G1 |
| REF-14 | [NLM UMLS](https://www.nlm.nih.gov/research/umls/) | Controlled vocabulary/mapping metadata | Account/API/licence restrictions | Licensed/terms-gated mapping only | Planned G2 |
| REF-15 | [WHO ICD API](https://icd.who.int/icdapi/) | International ICD reference/mappings (not U.S. ICD-10-CM authority) | Registered API | Optional crosswalk reference | Planned G2 |
| REF-16 | [openFDA](https://open.fda.gov/apis/) | Public drug/device/regulatory attributes | API | Optional clinical-adjacent reference, not advice | Planned G2 |
| REF-17 | [HRSA Data](https://data.hrsa.gov/) | Shortage area and geographic/public access datasets | API / files as available | Optional provider-market analytics | Planned G2 |
| REF-18 | [CMS developer / Marketplace public APIs](https://developer.cms.gov/public-apis/) | Market/plan directory reference where access and dataset allow | API varies | Supplemental plan cross-check only, not network proof | Planned G2 |
| REF-19 | [CMS QPP Developer Preview](https://qpp.cms.gov/developers) | Optional MIPS/QPP quality program reference/preview | Preview APIs with access controls | Optional future governed compliance workflow | Deferred to later G3; no production submission |
| DEV-01 | [Stedi developer docs/sandbox](https://www.stedi.com/docs/healthcare) | Synthetic eligibility and permitted nonproduction developer experiments | Sandbox/API (account required) | Single synthetic adapter harness; inspect supported endpoints | Planned G2 |
| DEV-02 | [Stedi payer/transaction enrollment APIs](https://www.stedi.com/docs/healthcare/api-reference) | Payer capability statuses and **EDI/ERA** enrollment life cycle | API / account | Capability cache and non-PHI metadata; no credentialing inference | Planned G2 |

**Note:** REF-05 is a *single Medicare payment reference service* with distinct program-specific datasets. REF-01 keeps CM and PCS separate, REF-03 is only an index over official terminology, and REF-08 cannot determine credentialing/network/contracting. Government datasets are not automatically general-purpose APIs or free of redistribution restrictions. The 2026-10-01 ICD-10-CM release belongs to FY 2027; every source needs release/version and effective dates.

## B. Production/commercial integrations (planned, not activated)

| ID | Provider / link | Exclusive role | Cost/contract | Target |
| --- | --- | --- | --- | --- |
| TX-01 | [Stedi healthcare](https://www.stedi.com/docs/healthcare/api-reference) | Single primary clearinghouse for eligibility 270/271, 837P/I/D (phased), 277CA, 276/277, 835, transaction enrollment, payer support and later 275 | Production transactions billed; verify rate/card/account and network access | G2 synthetic; G4 live only |
| TX-02 | [Availity](https://www.availity.com/) | **Conditional** secondary for proven payer+transaction gaps where commercial API entitlement exists | Business/API agreement required | No integration until measured gap |
| TX-03 | Authorized plan/MAC/Medicaid payer interfaces | First-party provider/group credentialing decisions, contracts, network rosters and payer-specific application status | Individual payer agreement/portal rights; no universal endpoint | Per-payer G3/G4 |
| BIZ-01 | [Appwrite](https://appwrite.io/) | V2 customer identity, orgs/teams, onboarding, requests, business entitlements, hosting | Existing commercial foundation | Separate V2 dev/stage; no live healthcare data |
| BIZ-02 | [HubSpot](https://developers.hubspot.com/) | Sales CRM lifecycle (not a healthcare record store) | Existing commercial foundation | Existing disabled adapter |
| BIZ-03 | [Stripe](https://docs.stripe.com/api) | Payment/subscription truth (not claim payments) | Transaction/service fees | Existing disabled adapter |
| BIZ-04 | [Apollo](https://docs.apollo.io/) | Business prospect enrichment only | Account/API entitlement-dependent | Existing disabled adapter |

## C. Explicit deferrals / exclusions from V2 implementation

| ID | Provider | Disposition | Why |
| --- | --- | --- | --- |
| HOLD-01 | Redox | **DEFERRED by owner** | EHR interoperability is not first-scope; do not purchase or configure |
| HOLD-02 | DataSpring/CAQH Provider Data | **DEFERRED by owner** | No paid CAQH API or credentialing feed; use authorized manual status records and free official reference where applicable |
| HOLD-03 | AMA CPT Level I commercial licensing | **DEFERRED by owner** | No full AMA CPT database, restricted descriptors or unlicensed redistribution; product surfaces must say limited/reference only |
| OUT-01 | Optum/Change Healthcare | Not selected | Do not add a third clearinghouse by default |
| OUT-02 | Waystar | Not selected | Existing-client enterprise alternative only after separate decision |
| OUT-03 | Rhapsody Health | Not selected | Do not silently replace deferred Redox |
| OUT-04 | RCI / unspecified coding API | Not selected / identity unverified | No API contract or vendor provenance established |

## Implementation truth and statuses

- `planned` means **no working integration**.
- `connected` requires a verified dev connection and schema tests, not a reference link.
- `live` requires separate contract, privacy, security, verified payer routing/enrollment, production evidence and release approval.
- `deferred` means no new runtime dependency, key, marketing claim, purchase or task to activate.
- Free developer systems may run on no-PHI, synthetic fixtures only. Do not send live insurance identifiers to unapproved sandboxes.

## No-overlap rules

1. Official ICD/HCPCS/CMS releases = coding/payment reference truth; NLM/WHO = UI/mapping adjunct. **Never treat public CPT appearances in RVU or NCCI as a replacement for the deferred AMA license.**
2. One clearinghouse route per actual submission: Stedi primary; Availity secondary only after capability and duplicate-submission safety checks.
3. Credentialing, contracting, payer network, PECOS Medicare, CAQH attestation (deferred), EDI transaction enrollment, EFT and ERA enrollment are separate status dimensions.
4. Network benefit data in a 271 cannot prove a provider is contracted to that specific network/product/location.
5. Only approved server adapters make provider calls; front end does not hold secrets and makes no production payer calls.
6. Freeze routing by transaction, not by insurer brand. Medicare FFS/MAC, state Medicaid FFS/MCO, Medicare Advantage, BCBS licensees, commercial ASO, workers compensation, TRICARE and other specialty products require separate evidence.
