# ROOT V2 — Digital Customer Platform

**Revenue Operations & Outcomes Technology · One product. One identity. One customer journey.**

![Status](https://img.shields.io/badge/status-foundation--only-0d2137) ![Design](https://img.shields.io/badge/design-Figma--first-11e1ee) ![Privacy](https://img.shields.io/badge/data-synthetic--only-1680ff)

> ROOT V2 is the independently developed successor to rootrcm.com. **ROOT V1 remains untouched.** This repository starts with a runnable Next.js skeleton, the approved Demo 6 reference, Figma link, developer instructions, governance, safe example fixtures, integration boundaries, and CI. Neither the screenshots nor the mock workspace are live RCM systems.

## Start here

- **[Figma master](https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52)** — 00–08 design areas, native foundations, component/spec handoff.
- **[Final Demo 6 browser reference](reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html)** — the approved browser demo; do not turn embedded JS into production business logic.
- **[Product / execution plan](docs/00-product-blueprint.md)** — Discover → Convert → Operate.
- **[Tech architecture](docs/architecture.md)** — provider boundaries and integration ownership.
- **[Developer guide](docs/07-developer-handoff.md)** — Cursor, Codex, Claude, OpenCode.
- **[Governance](AGENTS.md)** — mandatory security, design and PR rules.

## Finalized stack

| Layer | Choice |
| --- | --- |
| Design | Figma native variables, component variants, developer handoff |
| UI | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui patterns, Radix, Lucide |
| Hosting | Appwrite Sites, separate V2 project and preview domain |
| Data/identity | Appwrite Auth, Teams, TablesDB, Functions, Storage as required |
| Revenue CRM | HubSpot (sales source of truth) |
| Billing | Stripe Checkout, Billing, Customer Portal (financial source of truth) |
| Prospecting | Apollo (not a second CRM) |
| Dev / agents | Cursor Premium + Codex + Claude + OpenCode via metered OpenRouter/DeepSeek |
| QA | Typecheck, lint, build, unit/E2E, WCAG 2.2 AA target |

## Local prerequisites

Node.js active LTS, Git, GitHub account with SSO access, Cursor, optional OpenCode, VS Code, and a separate Appwrite development project. Do not copy API keys into agents, code, Figma, or GitHub files.

```bash
git clone https://github.com/CoE-DIRT/rootrcm.com_v2.git
cd rootrcm.com_v2
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. CI uses `npm ci` against the committed `package-lock.json`. This is a **foundation**, not a finished deployed application.

## Production release policy

No production credentials, verified payment collection, live identity, PHI or actual patient records are configured. The V2 domain and cutover remain unassigned pending privacy, legal, QA, tenant security and founder approval. Unverified customer results/partnerships/certifications stay labeled **Pending verification**.

See `docs/08-qa-approval.md` for the gates.
