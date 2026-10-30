// Package seed holds fictional organization, claim and credentialing identities
// that match src/domain/operations/seed.ts. This is not a second ledger.
package seed

const IdentityCatalog = "ops-seed-v1"

var Organizations = map[string]bool{
	"bayview":     true,
	"cedar-grove": true,
	"metro-asc":   true,
}

var OrganizationIDs = []string{"bayview", "cedar-grove", "metro-asc"}

var PayerNames = map[string]string{
	"payer-healthfirst": "Healthfirst",
	"payer-aetna":       "Aetna",
	"payer-uhc":         "UnitedHealthcare",
	"payer-fidelis":     "Fidelis Care",
}

var ProviderAliases = map[string]string{
	"prv-cg-a":  "Clinician A",
	"prv-bv-a":  "Sample Clinician A",
	"prv-bv-b":  "Sample Clinician B",
	"prv-bv-c":  "Sample Clinician C",
	"prv-asc-a": "ASC Clinician A",
}
