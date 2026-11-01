// ROOT healthcare edge service — synthetic claim-edit validation only.
// Binds to loopback. Rejects PHI. Never contacts payers or clearinghouses.
package main

import (
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/CoE-DIRT/rootrcm.com_v2/services/healthcare-go/pkg/rcm"
)

func main() {
	addr := os.Getenv("ROOT_HEALTHCARE_LISTEN")
	if addr == "" {
		addr = "127.0.0.1:8787"
	}
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		log.Fatal("invalid ROOT_HEALTHCARE_LISTEN: ", err)
	}
	ip := net.ParseIP(host)
	if host != "localhost" && (ip == nil || !ip.IsLoopback()) {
		log.Fatal("edge service must bind to loopback; use a reviewed authenticated gateway for deployment")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", handleHealthz)
	mux.HandleFunc("/validate-claim-edits", handleValidateClaimEdits)

	server := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       30 * time.Second,
		MaxHeaderBytes:    1 << 14,
	}
	log.Printf("ROOT healthcare-go (synthetic, PHI prohibited) listening on %s", addr)
	log.Fatal(server.ListenAndServe())
}

func handleHealthz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"status":              "ok",
		"service":             "root-healthcare-go",
		"mode":                "demonstration",
		"livePayerConnection": false,
		"phiAccepted":         false,
	})
}

func handleValidateClaimEdits(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}

	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<16))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_body"})
		return
	}

	var raw map[string]any
	if err := json.Unmarshal(body, &raw); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}
	if err := rcm.RejectPHI(raw); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	var req rcm.ClaimEditRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_claim_payload"})
		return
	}

	result, err := rcm.ValidateClaimEdits(req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"mode":   "demonstration",
		"source": "synthetic",
		"result": result,
	})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Demo-Data", "synthetic")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
