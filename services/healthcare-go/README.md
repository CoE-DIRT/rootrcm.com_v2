# ROOT Go Healthcare API — local, PHI-free simulator

This service is the first executable **Go** boundary for ROOT's healthcare API architecture. It is a **read-only, deterministic simulated transaction provider**, not a live Stedi, payer, EHR, CAQH or PECOS connection. It uses only fictional organization IDs.

## Run

```powershell
cd services/healthcare-go
go test ./...
go run ./cmd/healthcare-api
```

Loopback address: `http://127.0.0.1:8787`.

## Endpoints

- `GET /healthz`
- `GET /v1/capabilities`
- `GET /v1/eligibility?orgId=bayview`
- `GET /v1/claims/status?orgId=bayview`
- `GET /v1/credentialing?orgId=bayview`

Other supported fictional organizations: `cedar-grove`, `metro-asc`.

The response envelope includes `mode: demonstration`, `source: synthetic`, `verifiedAt: null`, and `X-Demo-Data: synthetic`. This service accepts no PHI, live requests, credentials or mutations and serves no CORS headers. It binds to loopback only; a future public deployment needs a reviewed authenticated gateway, durable tenant scoping and separate secrets. No real transaction access is implied.

## Future adapter boundary

1. **Stedi 270/271** eligibility; source evidence and response timestamps.
2. **Stedi 276/277** payer claim-status inquiry and responses; do not confuse with 277CA.
3. **Credentialing** payer/CAQH/PECOS authorized status evidence; do not infer payer-network approval from NPPES or eligibility.
4. **Go regulated data backend** with tenant/role policy, webhook/event audit, encrypted protected storage under applicable contracts and PHI agreement boundaries.
5. Keep the current Next.js synthetic UI compatible with this envelope via a typed adapter. Do not introduce a second claim ledger in Appwrite.
6. Production credentials arrive as the founder-controlled final step; do not enable live calls without approved test evidence.

The H0-H8 implementation staging plan in PR #36 should be reviewed and reconciled before production vendor activation.


## Integrate the Go preview with ROOT V2 Next.js locally

Run the Go service and the Next.js frontend in separate PowerShell terminals. In the Next.js process, set only the **local preview** configuration:

```powershell
$env:ROOT_GO_HEALTHCARE_PREVIEW_URL = "http://127.0.0.1:8787"
npm run dev
```

Open `/en/technology` or `/es/technology` and interact with the new Go healthcare API architecture panel. The Next.js read-only endpoint `/api/v1/healthcare/demo?kind=capabilities` proxies only approved static paths to a **loopback-only** Go process, verifies synthetic provenance and returns HTTP 503 when Go is absent. No live patient, clearinghouse or payer credentials are accepted or required.

This preview bridge is **not** the planned production regulated API. A real hosted Go service requires an authenticated gateway, verified server-only configuration, durable tenant controls, event ingestion, source provenance and approved vendor contracts. Never publish this demo service directly or bind it to a public network interface.
