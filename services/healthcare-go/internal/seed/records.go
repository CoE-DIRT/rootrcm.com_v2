package seed

// EligibilityRecord is a PHI-free 270/271 preview row.
type EligibilityRecord struct {
	ID          string `json:"id"`
	Payer       string `json:"payer"`
	Transaction string `json:"transaction"`
	State       string `json:"state"`
	NextAction  string `json:"nextAction"`
}

// ClaimRecord is a PHI-free 276/277 preview row aligned to ops claim IDs.
type ClaimRecord struct {
	ID          string `json:"id"`
	Payer       string `json:"payer"`
	Transaction string `json:"transaction"`
	Stage       string `json:"stage"`
	NextAction  string `json:"nextAction"`
}

// CredentialingRecord is a PHI-free enrollment preview row aligned to ops application IDs.
type CredentialingRecord struct {
	ApplicationID string  `json:"applicationId"`
	ProviderAlias string  `json:"providerAlias"`
	Payer         string  `json:"payer"`
	Phase         string  `json:"phase"`
	Owner         string  `json:"owner"`
	NextAction    string  `json:"nextAction"`
	EffectiveDate *string `json:"effectiveDate"`
}

func elg(id, payer, state, next string) EligibilityRecord {
	return EligibilityRecord{
		ID: id, Payer: payer, Transaction: "270/271", State: state, NextAction: next,
	}
}

func clm(id, payer, txn, stage, next string) ClaimRecord {
	return ClaimRecord{ID: id, Payer: payer, Transaction: txn, Stage: stage, NextAction: next}
}

func cred(id, alias, payer, phase, next string) CredentialingRecord {
	return CredentialingRecord{
		ApplicationID: id,
		ProviderAlias: alias,
		Payer:         payer,
		Phase:         phase,
		Owner:         "preview-staff",
		NextAction:    next,
		EffectiveDate: nil,
	}
}

// EligibilityByOrg is the static seed snapshot. Next.js operations remain the mutable ledger.
var EligibilityByOrg = map[string][]EligibilityRecord{
	"bayview": {
		elg("elg-bv-01", PayerNames["payer-healthfirst"], "271_active", "Coverage snapshot on file for this slot"),
		elg("elg-bv-02", PayerNames["payer-aetna"], "needs_review", "Confirm plan-level coverage before service"),
	},
	"cedar-grove": {
		elg("elg-cg-01", PayerNames["payer-healthfirst"], "270_submitted", "Await 271 response"),
	},
	"metro-asc": {
		elg("elg-asc-01", PayerNames["payer-uhc"], "271_active", "Coverage snapshot on file for this slot"),
	},
}

// ClaimsByOrg uses the same claim IDs as src/domain/operations/seed.ts.
var ClaimsByOrg = map[string][]ClaimRecord{
	"bayview": {
		clm("clm-bv-1001", PayerNames["payer-healthfirst"], "276/277", "payer_processing", "Next 276/277 status inquiry"),
		clm("clm-bv-1002", PayerNames["payer-aetna"], "276/277", "denied", "Review payer response and prepare appeal"),
		clm("clm-bv-1003", PayerNames["payer-uhc"], "835", "835_posted", "Reconcile posted remittance"),
		clm("clm-bv-1004", PayerNames["payer-healthfirst"], "837", "837_submitted", "Await 999 acknowledgement"),
		clm("clm-bv-1005", PayerNames["payer-aetna"], "999", "999_acknowledged", "Await 277CA acceptance"),
		clm("clm-bv-1006", PayerNames["payer-healthfirst"], "277CA", "277ca_accepted", "Track payer processing"),
		clm("clm-bv-1007", PayerNames["payer-fidelis"], "internal", "queued", "Submit 837"),
		clm("clm-bv-1008", PayerNames["payer-healthfirst"], "276/277", "276_277_pending", "Follow up 276/277 inquiry"),
	},
	"cedar-grove": {
		clm("clm-cg-2001", PayerNames["payer-healthfirst"], "835", "835_posted", "Reconcile posted remittance"),
		clm("clm-cg-2002", PayerNames["payer-aetna"], "277CA", "277ca_rejected", "Correct 837 and resubmit"),
		clm("clm-cg-2003", PayerNames["payer-healthfirst"], "276/277", "276_277_pending", "Follow up 276/277 inquiry"),
	},
	"metro-asc": {
		clm("clm-asc-3001", PayerNames["payer-uhc"], "276/277", "payer_processing", "Next 276/277 status inquiry"),
		clm("clm-asc-3002", PayerNames["payer-aetna"], "837", "837_submitted", "Await 999 acknowledgement"),
		clm("clm-asc-3003", PayerNames["payer-healthfirst"], "internal", "appealed", "Track appeal acknowledgement"),
	},
}

// CredentialingByOrg uses the same application IDs as src/domain/operations/seed.ts.
var CredentialingByOrg = map[string][]CredentialingRecord{
	"bayview": {
		cred("cred-bv-001", ProviderAliases["prv-bv-a"], PayerNames["payer-healthfirst"], "payer_review", "Request payer review status"),
		cred("cred-bv-002", ProviderAliases["prv-bv-b"], PayerNames["payer-aetna"], "caqh_attestation", "Validate CAQH attestation"),
		cred("cred-bv-003", ProviderAliases["prv-bv-c"], PayerNames["payer-uhc"], "submitted", "Confirm payer acknowledgement — submission is not an effective date"),
		cred("cred-bv-004", ProviderAliases["prv-bv-a"], PayerNames["payer-fidelis"], "additional_information", "Supply requested payer information"),
	},
	"cedar-grove": {
		cred("cred-cg-001", ProviderAliases["prv-cg-a"], PayerNames["payer-healthfirst"], "documents_pending", "Collect outstanding enrollment documents"),
	},
	"metro-asc": {
		cred("cred-asc-001", ProviderAliases["prv-asc-a"], PayerNames["payer-uhc"], "approved_pending_effective", "Await payer-stated effective date — not inferred from submission"),
	},
}
