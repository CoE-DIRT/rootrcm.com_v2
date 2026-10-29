# 07 — Cursor / Claude / Codex / OpenCode Handoff

## Stage order
1. Review Demo 6 reference, attached master plan and Figma 00–08.
2. Lock variables and component variants; map each code component to Figma node/variant.
3. Build responsive public shell and route skeleton.
4. Build five conversion paths with disabled server API adapters.
5. Build role-specific app shell, synthetic tenant stories, error/empty/loading states.
6. Integrate Appwrite only after API contracts/roles approved.
7. Add HubSpot, Stripe and Apollo sequentially with sandbox and audit.
8. Run QA/security/legal and authorize controlled cutover to rootrcm.com.

## Agent costs and concurrency
Cursor Premium acts as primary workstation. OpenCode uses metered OpenRouter/DeepSeek keys held locally, subject to explicit per-key spending limits. Codex handles difficult code review and architecture; Claude reviews UX and accessibility. Separate branches/worktrees; never allow two agents to mutate the same file concurrently. Restrict prompts to targeted file sets and error logs. No model or API route is genuinely unlimited.

## First local commands
```bash
git clone https://github.com/CoE-DIRT/rootrcm.com_v2.git
cd rootrcm.com_v2
npm install
npm run dev
npm run lint && npm run typecheck && npm run test && npm run build
```
First developer must commit the generated package-lock.json and switch CI to npm ci if installation succeeds.
