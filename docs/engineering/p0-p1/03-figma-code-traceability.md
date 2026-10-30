# 03 — Figma-to-code traceability

**File:** https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52  
**MCP session:** `dfbdf6af-96dd-4e4c-86ca-a1822a6f9533` (2026-10-30 continuation)  
**Do not read this as 100% parity.** Accessible frames on pages 01–05 were used. Pages 06–08 were not fully implemented as interactive prototypes.

| Figma Node ID | Route | Component | Design Variant | Implemented | Visual Evidence | Deviation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1:2 / 2:2 | tokens | `src/app/globals.css` | Foundations specimen | Yes | MCP metadata + implemented semantic tokens | Inter via `next/font`; success/warning/danger added from specimen | implemented |
| 3:21 | global | `Button` | Primary/secondary | Yes | Component + CSS | Ghost variant extra; no hover screenshot matrix | implemented |
| 3:22 / 3:30 | cards | `Card` | Service/plan | Partial | Used on home/services/plans | Evidence/stat/dialog variants not pixel-matched | partial |
| 4:2 | `/en` | Home | Desktop / Dark | Yes | `get_design_context` screenshot used as target | Responsive titles swap; not pixel-perfect spacing | implemented |
| 4:40 | `/en/services` | Services | Desktop / Dark | Yes | Metadata copy | Tile hrefs are IA routes, not unique service nodes | implemented |
| 4:88 | `/en/plans` | Plans | Desktop / Dark | Yes | Catalog cards + node IDs 4:100–4:116 | No live checkout | implemented |
| 4:126 | `/en` | Home | Mobile / Dark | Yes | 375px `next start` 2026-10-30; no horizontal overflow after header fix | Theme/locale remain in header (product requirement vs Figma ROOT+☰ only) | implemented |
| 4:153 | `/en` | Home | Tablet / Dark | Yes | 768px title + RCM/DIRT/Credentialing/Practice operations tiles | Desktop nav hidden until `lg`; Figma tablet nav overflowed its own 768 frame | implemented |
| 5:24 / 5:2 | `/en/why-root` | Why ROOT | Blueprint architecture + personas | Yes | Section cards from buyer steps | No painted public-site frame | implemented-from-inventory |
| 6:7 | `/en/solutions` | Solutions | Route inventory | Yes | Concern sections | No painted public-site frame | implemented-from-inventory |
| 6:22 | `/en/technology` | Technology | Route inventory | Yes | DIRT sections + synthetic banner | Dashboards remain synthetic | implemented-from-inventory |
| 6:49 | `/en/resources` | Resources | Route inventory | Yes | Official-forms/templates/education + FAQ | No CMS PDFs hosted | implemented-from-inventory |
| 6:34 | `/en/company` | Company | Route inventory | Yes | Architecture steps + FAQ | Bios/certs still withheld | implemented-from-inventory |
| 5:46 | `/en/account` | Free account | Conversion | Partial | Step list + inquiry form; title matches Figma | Auth disabled | partial |
| 5:69 | `/en/consultation` | Consultation | Conversion | Partial | Form + disabled API; node id corrected to 5:69 | No live HubSpot | partial |
| 5:92 | `/en/diagnostic` | Diagnostic $2,500 | Conversion | Partial | Steps; no Stripe | Payment labeled planned | partial |
| 5:115 | `/en/custom` `/en/custom-rcm` | Custom MSO | Conversion | Partial | Same catalog, two routes | Subscribe planned | partial |
| 5:138 | `/en/preview/client` | Client workspace | Synthetic | Partial | App shell + sample org | Not a live portal | partial |
| 5:195 | `/en/preview/staff` | Employee workspace | Synthetic | Partial | Staff queue | Labeled preview | partial |
| 5:227 | client mobile | Portal mobile | Mobile | No dedicated frame mapping | App shell stacks on small screens | untested | not-started |
| 1:7, 1:8, 1:9 | prototypes / QA | — | — | Blocked / not coded | Pages listed by MCP `get_metadata` | Interaction prototypes not implemented as motion | blocked |

Why ROOT / Solutions / Technology / Resources / Company have **no painted frames** on page `03 — Public Website` (only Home `4:2`/`4:126`/`4:153`, Services `4:40`, Pricing `4:88`). Inner pages now render blueprint inventory copy (`6:7`, `6:22`, `6:34`, `6:49`, personas `5:2` / architecture `5:24`) as section cards and FAQs. They are still not pixel-painted screens.

Demo 6 HTML (806 KB) was **not** ported into `src/`.
