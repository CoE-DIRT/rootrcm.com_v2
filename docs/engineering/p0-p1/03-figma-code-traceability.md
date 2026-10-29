# 03 — Figma-to-code traceability

**File:** https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52  
**MCP session:** `dcfd9802-31ce-4c57-b848-e25893722c6b`  
**Do not read this as 100% parity.** Accessible frames on pages 01–05 were used. Pages 06–08 were not fully implemented as interactive prototypes.

| Figma Node ID | Route | Component | Design Variant | Implemented | Visual Evidence | Deviation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1:2 / 2:2 | tokens | `src/app/globals.css` | Foundations specimen | Yes | MCP metadata + implemented semantic tokens | Inter via `next/font`; success/warning/danger added from specimen | implemented |
| 3:21 | global | `Button` | Primary/secondary | Yes | Component + CSS | Ghost variant extra; no hover screenshot matrix | implemented |
| 3:22 / 3:30 | cards | `Card` | Service/plan | Partial | Used on home/services/plans | Evidence/stat/dialog variants not pixel-matched | partial |
| 4:2 | `/en` | Home | Desktop / Dark | Yes | `get_design_context` screenshot used as target | Responsive titles swap; not pixel-perfect spacing | implemented |
| 4:40 | `/en/services` | Services | Desktop / Dark | Yes | Metadata copy | Tile hrefs are IA routes, not unique service nodes | implemented |
| 4:88 | `/en/plans` | Plans | Desktop / Dark | Yes | Catalog cards + node IDs 4:100–4:116 | No live checkout | implemented |
| 4:126 | `/en` | Home | Mobile / Dark | Partial | CSS `md:hidden` title/tiles | 375px browser pass limited this session | partial |
| 4:153 | `/en` | Home | Tablet / Dark | Partial | CSS `md` title | 768px not fully exercised in browser this session | partial |
| 5:46 | `/en/account` | Free account | Conversion | Partial | Step list only | Auth disabled | partial |
| 5:69 | `/en/consultation` | Consultation | Conversion | Partial | Form + disabled API | Node on page was 6:78 in an earlier draft; copy matches 5:69 | partial |
| 5:92 | `/en/diagnostic` | Diagnostic $2,500 | Conversion | Partial | Steps; no Stripe | Payment labeled planned | partial |
| 5:115 | `/en/custom` `/en/custom-rcm` | Custom MSO | Conversion | Partial | Same catalog, two routes | Subscribe planned | partial |
| 5:138 | `/en/preview/client` | Client workspace | Synthetic | Partial | App shell + sample org | Not a live portal | partial |
| 5:195 | `/en/preview/staff` | Employee workspace | Synthetic | Partial | Staff queue | Labeled preview | partial |
| 5:227 | client mobile | Portal mobile | Mobile | No dedicated frame mapping | App shell stacks on small screens | untested | not-started |
| 1:7, 1:8, 1:9 | prototypes / QA | — | — | Blocked / not coded | Pages listed by MCP `get_metadata` | Interaction prototypes not implemented as motion | blocked |

Why ROOT / Solutions / Technology / Resources / Company routes exist from approved IA + Figma nav labels; they do **not** have dedicated frames on page `03 — Public Website` (only Home, Services, Pricing, mobile/tablet home). Those inner pages are IA shells with pending-verification copy.

Demo 6 HTML (806 KB) was **not** ported into `src/`.
