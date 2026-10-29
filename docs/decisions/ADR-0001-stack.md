# ADR-0001 — Finalized V2 stack and precedence

**Decision:** adopt the newer ROOT V2 approval: Next.js/TypeScript/Tailwind/shadcn/Radix, Appwrite Sites/Auth/Teams/TablesDB/Functions, HubSpot, Stripe, Apollo. Figma native system is design source of truth. Cursor Premium + metered OpenRouter/DeepSeek/OpenCode + Codex/Claude are development agents.

**Context:** one historical attached planning document contains a preliminary proposal for Supabase and Vercel. That is superseded by the user's later specific approval to retain Appwrite and avoid premature hosting/backend churn. Do not change vendors without new ADR.

**Consequences:** fewer duplicated services; one paid Appwrite platform but project isolation, server integration design and tenant-permission audits are mandatory. Future switching only with measurable cost/security benefits and migration plan.
