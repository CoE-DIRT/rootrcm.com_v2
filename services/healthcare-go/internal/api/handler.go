// Package api implements a PHI-free, deterministic healthcare transaction
// simulator. It deliberately makes no external payer or credentialing calls.
package api

import (
 "encoding/json"
 "net/http"
 "strings"
)

type envelope struct {
 Mode string `json:"mode"`
 Source string `json:"source"`
 OrgID string `json:"orgId,omitempty"`
 VerifiedAt *string `json:"verifiedAt"`
 Data any `json:"data"`
}

type eligibility struct {
 ID string `json:"id"`
 Payer string `json:"payer"`
 Transaction string `json:"transaction"`
 State string `json:"state"`
 NextAction string `json:"nextAction"`
}
type claim struct {
 ID string `json:"id"`
 Payer string `json:"payer"`
 Transaction string `json:"transaction"`
 Stage string `json:"stage"`
 NextAction string `json:"nextAction"`
}
type credentialing struct {
 ApplicationID string `json:"applicationId"`
 ProviderAlias string `json:"providerAlias"`
 Payer string `json:"payer"`
 Phase string `json:"phase"`
 Owner string `json:"owner"`
 NextAction string `json:"nextAction"`
 EffectiveDate *string `json:"effectiveDate"`
}

var demoOrg = map[string]string{
 "bayview": "Bayview Multi-Specialty Group",
 "cedar-grove": "Cedar Grove Family Practice",
 "metro-asc": "Metro Surgical Center",
}

func jsonResponse(w http.ResponseWriter, code int, payload any) {
 w.Header().Set("Content-Type", "application/json; charset=utf-8")
 w.Header().Set("Cache-Control", "no-store")
 w.Header().Set("X-Content-Type-Options", "nosniff")
 w.Header().Set("X-Demo-Data", "synthetic")
 w.WriteHeader(code)
 _ = json.NewEncoder(w).Encode(payload)
}

func verifiedEnvelope(org string, data any) envelope {
 return envelope{Mode: "demonstration", Source: "synthetic", OrgID: org, VerifiedAt: nil, Data: data}
}

func getOnly(fn http.HandlerFunc) http.HandlerFunc {
 return func(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodGet {
   w.Header().Set("Allow", http.MethodGet)
   jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
   return
  }
  fn(w, r)
 }
}

func withOrg(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
 return getOnly(func(w http.ResponseWriter, r *http.Request) {
  org := strings.TrimSpace(r.URL.Query().Get("orgId"))
  if _, ok := demoOrg[org]; !ok {
   jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "unknown_synthetic_organization", "hint": "Supported: bayview, cedar-grove, metro-asc"})
   return
  }
  fn(w, r, org)
 })
}

// NewHandler exposes read-only preview endpoints over the same public response
// contracts expected from future audited vendor adapters. No PHI is accepted.
func NewHandler() http.Handler {
 mux := http.NewServeMux()
 mux.HandleFunc("/healthz", getOnly(func(w http.ResponseWriter, r *http.Request) {
  jsonResponse(w, http.StatusOK, map[string]any{"status": "ok", "service": "root-healthcare-go", "mode": "demonstration", "livePayerConnection": false})
 }))
 mux.HandleFunc("/v1/capabilities", getOnly(func(w http.ResponseWriter, r *http.Request) {
  jsonResponse(w, http.StatusOK, verifiedEnvelope("", map[string]any{
   "language": "Go", "live": false, "transactionFamilies": []string{
    "270/271 eligibility", "276/277 claim status", "credentialing application status",
   },
   "plannedPrimaryClearinghouse": "Stedi",
   "credentialingNote": "Payer application status needs authorized payer-specific evidence; 271/NPPES cannot prove enrollment.",
  }))
 }))
 mux.HandleFunc("/v1/eligibility", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
  jsonResponse(w, http.StatusOK, verifiedEnvelope(org, []eligibility{
   {ID: "DEMO-ELG-01", Payer: "Healthfirst", Transaction: "270/271", State: "review_required", NextAction: "Confirm coverage after approved integration"},
   {ID: "DEMO-ELG-02", Payer: "Aetna", Transaction: "270/271", State: "pending_check", NextAction: "Prepare benefits inquiry"},
  }))
 }))
 mux.HandleFunc("/v1/claims/status", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
  jsonResponse(w, http.StatusOK, verifiedEnvelope(org, []claim{
   {ID: "DEMO-CLM-1001", Payer: "Healthfirst", Transaction: "276/277", Stage: "payer_processing", NextAction: "Request authorized payer status"},
   {ID: "DEMO-CLM-1002", Payer: "Aetna", Transaction: "276/277", Stage: "denial_review", NextAction: "Investigate denial and prepare appeal"},
  }))
 }))
 mux.HandleFunc("/v1/credentialing", withOrg(func(w http.ResponseWriter, r *http.Request, org string) {
  jsonResponse(w, http.StatusOK, verifiedEnvelope(org, []credentialing{
   {ApplicationID: "DEMO-CRED-001", ProviderAlias: "Sample Clinician A", Payer: "Healthfirst", Phase: "payer_review", Owner: "Enrollment specialist", NextAction: "Request payer acknowledgement", EffectiveDate: nil},
   {ApplicationID: "DEMO-CRED-002", ProviderAlias: "Sample Clinician B", Payer: "Aetna", Phase: "caqh_attestation", Owner: "Credentialing coordinator", NextAction: "Validate documentation", EffectiveDate: nil},
  }))
 }))
 return mux
}
