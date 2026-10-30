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
