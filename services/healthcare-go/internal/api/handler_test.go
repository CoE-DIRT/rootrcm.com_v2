package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
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
