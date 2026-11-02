// Package api exposes deterministic PHI-free healthcare transaction previews.
// It never contacts payers, Stedi, EHR systems, CAQH or PECOS.
// Identities match the Next.js operations seed; this service is not a second ledger.
package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/CoE-DIRT/rootrcm.com_v2/services/healthcare-go/internal/seed"
)

func jsonResponse(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Demo-Data", "synthetic")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func demoEnvelope(org string, data any) map[string]any {
	response := map[string]any{
		"mode":            "demonstration",
		"source":          "synthetic",
		"verifiedAt":      nil,
		"identityCatalog": seed.IdentityCatalog,
		"ledger":          "operations",
		"data":            data,
	}
	if org != "" {
		response["orgId"] = org
	}
	return response
}

func getOnly(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", http.MethodGet)
			jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
			return
		}
		handler(w, r)
	}
}

func withOrg(handler func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return getOnly(func(w http.ResponseWriter, r *http.Request) {
		org := strings.TrimSpace(r.URL.Query().Get("orgId"))
		if !seed.Organizations[org] {
			jsonResponse(w, http.StatusBadRequest, map[string]string{
				"error": "unknown_synthetic_organization",
				"hint":  "Supported: bayview, cedar-grove, metro-asc",
			})
			return
		}
		handler(w, r, org)
	})
}

// NewHandler only serves read-only, synthetic, non-PHI example status records.
func NewHandler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", getOnly(func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, http.StatusOK, map[string]any{
			"status":              "ok",
			"service":             "root-healthcare-go",
			"mode":                "demonstration",
			"livePayerConnection": false,
			"identityCatalog":     seed.IdentityCatalog,
		})
	}))

	mux.HandleFunc("/v1/capabilities", getOnly(func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, http.StatusOK, demoEnvelope("", map[string]any{
			"language":                    "Go",
			"live":                        false,
			"transactionFamilies":         []string{"270/271 eligibility", "276/277 claim status", "credentialing application status"},
			"plannedPrimaryClearinghouse": "Stedi",
			"identityCatalog":             seed.IdentityCatalog,
			"syntheticOrganizations":      seed.OrganizationIDs,
			"stedi":                       map[string]any{"status": "disabled", "live": false, "role": "planned_primary"},
			"credentialingNote":           "Payer application status needs authorized evidence; 271/NPPES does not prove enrollment.",
			"ledgerNote":                  "Next.js operations snapshot is the mutable demonstrator ledger; this service is a static identity-aligned preview.",
		}))
	}))

	mux.HandleFunc("/v1/eligibility", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, seed.EligibilityByOrg[org]))
	}))

	mux.HandleFunc("/v1/claims/status", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, seed.ClaimsByOrg[org]))
	}))

	mux.HandleFunc("/v1/credentialing", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, seed.CredentialingByOrg[org]))
	}))

	return mux
}
