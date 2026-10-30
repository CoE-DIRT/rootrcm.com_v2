package main

import (
 "log"
 "net"
 "net/http"
 "os"
 "time"

 "github.com/CoE-DIRT/rootrcm.com_v2/services/healthcare-go/internal/api"
)

func main() {
 addr := os.Getenv("ROOT_HEALTHCARE_LISTEN")
 if addr == "" { addr = "127.0.0.1:8787" }
 host, _, err := net.SplitHostPort(addr)
 if err != nil { log.Fatal("invalid ROOT_HEALTHCARE_LISTEN: ", err) }
 ip := net.ParseIP(host)
 if host != "localhost" && (ip == nil || !ip.IsLoopback()) {
  log.Fatal("demo service must bind to loopback; use a reviewed authenticated gateway for other deployment")
 }
 server := &http.Server{
  Addr: addr, Handler: api.NewHandler(),
  ReadHeaderTimeout: 5 * time.Second,
  ReadTimeout: 10 * time.Second,
  WriteTimeout: 10 * time.Second,
  IdleTimeout: 30 * time.Second,
  MaxHeaderBytes: 1 << 14,
 }
 log.Printf("ROOT Go healthcare preview (synthetic, no PHI) listening on %s", addr)
 log.Fatal(server.ListenAndServe())
}
