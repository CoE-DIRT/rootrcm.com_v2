// Package api exposes deterministic PHI-free healthcare transaction previews.
// It never contacts payers, Stedi, EHR systems, CAQH or PECOS.
package api

import (
	"encoding/json"
	"net/http"
	"strings"
)

var demoOrganizations = map[string]bool{
	"bayview":     true,
	"cedar-grove": true,
	"metro-asc":   true,
}

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
		"mode":       "demonstration",
		"source":     "synthetic",
		"verifiedAt": nil,
		"data":       data,
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
		if !demoOrganizations[org] {
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
			"status": "ok", "service": "root-healthcare-go",
			"mode": "demonstration", "livePayerConnection": false,
		})
	}))

	mux.HandleFunc("/v1/capabilities", getOnly(func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, http.StatusOK, demoEnvelope("", map[string]any{
			"language": "Go", "live": false,
			"transactionFamilies": []string{
				"270/271 eligibility",
				"276/277 claim status",
				"credentialing application status",
			},
			"plannedPrimaryClearinghouse": "Stedi",
			"credentialingNote":           "Payer application status needs authorized evidence; 271/NPPES does not prove enrollment.",
		}))
	}))

	mux.HandleFunc("/v1/eligibility", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, []map[string]any{
			{"id": "DEMO-ELG-01", "payer": "Healthfirst", "transaction": "270/271", "state": "review_required", "nextAction": "Confirm coverage after approved integration"},
			{"id": "DEMO-ELG-02", "payer": "Aetna", "transaction": "270/271", "state": "pending_check", "nextAction": "Prepare benefits inquiry"},
		}))
	}))

	mux.HandleFunc("/v1/claims/status", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, []map[string]any{
			{"id": "DEMO-CLM-1001", "payer": "Healthfirst", "transaction": "276/277", "stage": "payer_processing", "nextAction": "Request authorized payer status"},
			{"id": "DEMO-CLM-1002", "payer": "Aetna", "transaction": "276/277", "stage": "denial_review", "nextAction": "Investigate denial and prepare appeal"},
		}))
	}))

	mux.HandleFunc("/v1/credentialing", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
		jsonResponse(w, http.StatusOK, demoEnvelope(org, []map[string]any{
			{"applicationId": "DEMO-CRED-001", "providerAlias": "Sample Clinician A", "payer": "Healthfirst", "phase": "payer_review", "owner": "Enrollment specialist", "nextAction": "Request payer acknowledgement", "effectiveDate": nil},
			{"applicationId": "DEMO-CRED-002", "providerAlias": "Sample Clinician B", "payer": "Aetna", "phase": "caqh_attestation", "owner": "Credentialing coordinator", "nextAction": "Validate documentation", "effectiveDate": nil},
		}))
	}))

	return mux
}
