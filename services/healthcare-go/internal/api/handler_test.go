package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/CoE-DIRT/rootrcm.com_v2/services/healthcare-go/internal/seed"
)

func TestEndpointsSyntheticAndNoPHI(t *testing.T) {
	routes := []string{
		"/healthz",
		"/v1/capabilities",
		"/v1/eligibility?orgId=bayview",
		"/v1/claims/status?orgId=bayview",
		"/v1/credentialing?orgId=bayview",
	}
	for _, path := range routes {
		t.Run(path, func(t *testing.T) {
			w := httptest.NewRecorder()
			NewHandler().ServeHTTP(w, httptest.NewRequest(http.MethodGet, path, nil))
			if w.Code != http.StatusOK {
				t.Fatalf("status %d: %s", w.Code, w.Body.String())
			}
			if w.Header().Get("X-Demo-Data") != "synthetic" {
				t.Fatal("source header missing")
			}
			if w.Header().Get("Cache-Control") != "no-store" {
				t.Fatal("cache policy missing")
			}
			if !json.Valid(w.Body.Bytes()) {
				t.Fatal("invalid JSON")
			}
			output := strings.ToLower(w.Body.String())
			for _, sensitive := range []string{"patientName", "dateOfBirth", "ssn", "memberId", "npi"} {
				if strings.Contains(output, strings.ToLower(sensitive)) {
					t.Fatalf("unexpected sensitive field: %s", sensitive)
				}
			}
			if path != "/healthz" && !strings.Contains(output, "\"synthetic\"") {
				t.Fatal("synthetic provenance missing")
			}
			if strings.Contains(output, "demo-clm") || strings.Contains(output, "demo-cred") || strings.Contains(output, "demo-elg") {
				t.Fatal("legacy DEMO-* identities must not appear")
			}
		})
	}
}

func TestFailClosedRequests(t *testing.T) {
	cases := []struct {
		method   string
		path     string
		expected int
	}{
		{"POST", "/v1/eligibility?orgId=bayview", 405},
		{"GET", "/v1/eligibility", 400},
		{"GET", "/v1/claims/status?orgId=root-internal", 400},
		{"GET", "/v1/credentialing?orgId=patient-123", 400},
		{"DELETE", "/v1/credentialing?orgId=bayview", 405},
		{"GET", "/v1/nope", 404},
	}
	for _, tc := range cases {
		w := httptest.NewRecorder()
		NewHandler().ServeHTTP(w, httptest.NewRequest(tc.method, tc.path, nil))
		if w.Code != tc.expected {
			t.Errorf("%s %s: got %d want %d", tc.method, tc.path, w.Code, tc.expected)
		}
	}
}

func TestOrgScopedSeedIdentities(t *testing.T) {
	cases := []struct {
		path string
		id   string
	}{
		{"/v1/eligibility?orgId=bayview", "elg-bv-01"},
		{"/v1/eligibility?orgId=cedar-grove", "elg-cg-01"},
		{"/v1/eligibility?orgId=metro-asc", "elg-asc-01"},
		{"/v1/claims/status?orgId=bayview", "clm-bv-1001"},
		{"/v1/claims/status?orgId=cedar-grove", "clm-cg-2001"},
		{"/v1/claims/status?orgId=metro-asc", "clm-asc-3001"},
		{"/v1/credentialing?orgId=bayview", "cred-bv-001"},
		{"/v1/credentialing?orgId=cedar-grove", "cred-cg-001"},
		{"/v1/credentialing?orgId=metro-asc", "cred-asc-001"},
	}
	for _, tc := range cases {
		w := httptest.NewRecorder()
		NewHandler().ServeHTTP(w, httptest.NewRequest(http.MethodGet, tc.path, nil))
		if w.Code != http.StatusOK {
			t.Fatalf("%s: status %d", tc.path, w.Code)
		}
		if !strings.Contains(w.Body.String(), tc.id) {
			t.Fatalf("%s: missing identity %s", tc.path, tc.id)
		}
		if strings.Contains(w.Body.String(), "clm-bv-") && strings.Contains(tc.path, "cedar-grove") {
			t.Fatalf("%s leaked bayview claim identities", tc.path)
		}
	}
}

func TestCapabilitiesDeclareSharedCatalog(t *testing.T) {
	w := httptest.NewRecorder()
	NewHandler().ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/v1/capabilities", nil))
	body := w.Body.String()
	if !strings.Contains(body, seed.IdentityCatalog) {
		t.Fatal("identity catalog missing")
	}
	for _, org := range seed.OrganizationIDs {
		if !strings.Contains(body, org) {
			t.Fatalf("missing org %s", org)
		}
	}
	if !strings.Contains(body, `"status":"disabled"`) {
		t.Fatal("Stedi must remain disabled")
	}
}

func TestBayviewClaimCountMatchesSeed(t *testing.T) {
	w := httptest.NewRecorder()
	NewHandler().ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/v1/claims/status?orgId=bayview", nil))
	var payload struct {
		Data []seed.ClaimRecord `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Data) != len(seed.ClaimsByOrg["bayview"]) {
		t.Fatalf("got %d claims", len(payload.Data))
	}
}
