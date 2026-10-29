# ROOT V2 — Windows local bootstrap runbook

## Script artifact
The approved setup script is delivered as `ROOT_V2_Setup_Windows.ps1` in the related ChatGPT conversation. Copy that file to your Windows workstation and inspect it before executing. This guide documents its behavior but does not claim the script was executed locally.

## Run
From **PowerShell 7**, preferably elevated for installations:

```powershell
cd "$HOME\Downloads"
pwsh -NoProfile -ExecutionPolicy Bypass -File .\ROOT_V2_Setup_Windows.ps1
```

The default repository path is `C:\Dev\ROOT\rootrcm.com_v2`. Override with `-WorkspaceRoot D:\Dev\ROOT` when necessary.

## Expectations
- Check/optionally install Git and current Node.js LTS using winget.
- Safely clone or update `CoE-DIRT/rootrcm.com_v2` without discarding existing changes.
- Run `npm ci` when a lockfile exists; otherwise `npm install` and generate a lockfile.
- Create `.env.local` from committed `.env.example` only if missing; verify variable definitions.
- Leave private credentials unset and application integration flags disabled by default.
- Install OpenCode via npm; later configure a supported provider and spend cap interactively.
- Run lint, typecheck, tests and build, then create a local feature branch.
- Use `npm run dev` and open http://localhost:3000.

## Appwrite separation
Existing ROOT V1 project is **not** a safe V2 default. Create a dedicated `ROOT V2 Development` project, region NYC, in the approved Appwrite organization; copy only its **public project ID** to `NEXT_PUBLIC_APPWRITE_PROJECT_ID`. Never reuse V1 API keys. The connected Appwrite tool has not enabled project creation from this chat.

## Agent governance
One branch per agent or worktree; Cursor orchestrates local implementation; OpenCode performs metered bounded tasks. Codex/Claude review isolated PRs. Do not insert credentials/PHI into prompts or commit logs.

## Required follow-up
Review generated package-lock.json and open a pull request to commit it, update `.github/workflows/ci.yml` to `npm ci`, and confirm reliable CI/preview. GitHub Figma parity and security approval remain independent release gates.
