# ROOT Healthcare Go — claim-edit edge service

Lightweight loopback microservice for **synthetic ASC claim-edit validation**.
It never contacts payers, clearinghouses, or EHR systems and **rejects PHI**.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/healthz` | Liveness |
| `POST` | `/validate-claim-edits` | ASC unbundling, bilateral `-50`, and MPPR checks |

## Rules (`pkg/rcm`)

- Unbundled CPT pairs (e.g. `29877` with `29881`) require a distinct-procedure modifier or removal of the component code
- Modifier `-50` only against allowed anatomical code sets; ASC facility billing often prefers RT/LT
- MPPR: 50% discount on subordinate surgical fees when multiple surgical lines are present
- Any payload key for `patientName`, `ssn`, or `dob` (including nested `patient`) returns **400** with `PHI prohibited on edge service`

## Run

```powershell
cd services/healthcare-go
go test -v ./...
go run .
```

Default listen address: `http://127.0.0.1:8787` (override with `ROOT_HEALTHCARE_LISTEN`, loopback only).

## Example (synthetic, no PHI)

```json
{
  "claimId": "SYN-ASC-001",
  "lines": [
    { "cpt": "29881", "feeCents": 120000 },
    { "cpt": "29877", "feeCents": 40000 }
  ]
}
```
