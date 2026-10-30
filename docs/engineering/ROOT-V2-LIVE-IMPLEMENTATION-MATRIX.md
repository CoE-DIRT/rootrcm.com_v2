# ROOT V2 — Live implementation matrix

**SHA:** `470b76c` · **When:** 2026-10-31 ~04:00 PKT · **Owner:** Agent D (status only; no A/B/C source edits)

API / integration labels: `PUBLIC_LIVE_READ_ONLY` · `SYNTHETIC_DEV` · `CONNECTED_SANDBOX_VERIFIED` · `PLANNED` · `BLOCKED_EXTERNAL` · `DEFERRED_BY_OWNER` · `LIVE_APPROVED`.

| Surface | Code | Label | Evidence | Not claimed |
| --- | --- | --- | --- | --- |
| Public IA pages | `src/app/[locale]/*` | `SYNTHETIC_DEV` | Routes exist; Playwright public/commercial/demo6-chrome | Pixel Figma, production SEO |
| Mega nav / footer / Ask ROOT | `src/components/site/*` | `SYNTHETIC_DEV` | PR #42, 72 Playwright on that head | Live chat, HubSpot newsletter |
| Specialty + NY catalogs | `src/content/specialties.ts` | `SYNTHETIC_DEV` | PR #25; commercial-routes e2e | Clinical protocol, recovery % |
| Price catalog | `src/content/catalog.ts` | `SYNTHETIC_DEV` | `$2,500` Playwright | Stripe charges |
| Public inquiry API | `src/app/api/v1/public/inquiries` | `PLANNED` / fail-closed | PR #21; submit disabled in UI | CRM delivery |
| Ops state/actions | `/api/v1/ops/*` | `SYNTHETIC_DEV` | Session cookies; isolation e2e | Multi-instance durable store |
| Go healthcare | `127.0.0.1:8787` | `SYNTHETIC_DEV` | `/healthz` + `/v1/capabilities` 200 this pass | Stedi, CAQH, PECOS, PHI |
| Next→Go proxy | `/api/v1/healthcare/demo` | `SYNTHETIC_DEV` | 503 if Go down | Public healthcare API |
| Stripe | checkout route stub | `BLOCKED_EXTERNAL` | Adapter disabled | Payments |
| HubSpot | inquiry adapter | `BLOCKED_EXTERNAL` | MCP reconnect is human; writes off | CRM upsert |
| Apollo | prospecting flag false | `DEFERRED_BY_OWNER` | Info Desk only | Sequences / credit spend |
| Appwrite Auth / Sites | none in V2 | `BLOCKED_EXTERNAL` | V1 project only in console | OAuth, tenancy, staging host |
| Durable HTTPS preview | — | `BLOCKED_EXTERNAL` | See `preview-url-status.md` | Client demo URL |
| `rootrcm.com` | V1 | `LIVE_APPROVED` (V1 only) | Untouched | V2 cutover |

Full route DONE/MISSING table: [`ROOT-V2-FIGMA-DEMO6-E2E-PARITY.md`](./ROOT-V2-FIGMA-DEMO6-E2E-PARITY.md).
