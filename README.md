# ROOT V2 — Digital Customer Platform

**Revenue Operations & Outcomes Technology · One product. One identity. One customer journey.**

![Status](https://img.shields.io/badge/status-staged--production--acceptance--pending-0d2137) ![Design](https://img.shields.io/badge/design-Figma--first-11e1ee) ![Privacy](https://img.shields.io/badge/data-synthetic--only-1680ff)

> ROOT V2 is the Appwrite-hosted successor to rootrcm.com. Its public shell and authentication foundation are deployed, but hosted sign-in, role-gated operational workspace, durable inquiries and real integrations need acceptance. The Demo 6 examples and synthetic operations remain demonstrations, not live payer/RCM systems.

## Start here

- **[Figma master](https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52)** — 00–08 design areas, native foundations, component/spec handoff.
- **[Final Demo 6 browser reference](reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html)** — the approved browser demo; do not turn embedded JS into production business logic.
- **[Product / execution plan](docs/00-product-blueprint.md)** — Discover → Convert → Operate.
- **[Tech architecture](docs/architecture.md)** — provider boundaries and integration ownership.
- **[Developer guide](docs/07-developer-handoff.md)** — Claude Code, ChatGPT/Codex, Gemini, Copilot CLI, Netlify preview, terminal, GitHub.
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
| Dev / agents | Claude Code primary implementation; ChatGPT/Codex architecture/review; Gemini analysis; Copilot CLI narrow assist; Netlify UI previews; terminal and GitHub quality gates |
| QA | Typecheck, lint, build, unit/E2E, WCAG 2.2 AA target |

## Local prerequisites

Node.js supported by this Next.js release, Git, GitHub CLI, Claude Code, optional Copilot CLI, and an isolated Appwrite staging environment. Netlify is optional for synthetic-only frontend previews. Do not copy API keys into agents, code, Figma, or GitHub files.

```bash
git clone https://github.com/CoE-DIRT/rootrcm.com_v2.git
cd rootrcm.com_v2
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. CI uses `npm ci` against the committed `package-lock.json`. Do not infer production readiness from a local build. Follow the hosted acceptance gates and the EOD plan.

## Production release policy

Public V2 routes are hosted on Appwrite; authentication code exists but hosted session and role acceptance must be proved. Durable lead submission and Stripe/CRM/payer activation remain gated. Never include PHI in public forms or synthetic fixtures. Unverified results/partnerships/certifications stay unpublished. See `docs/engineering/ROOT_V2_EOD_MULTIAGENT_DELIVERY_2026-11-06.md` for the immediate release cycle.

See `docs/08-qa-approval.md` for the gates.
