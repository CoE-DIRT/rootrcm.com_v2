# Security policy

ROOT V2 is a public **development foundation**, not a PHI-ready or production-certified healthcare system.

## Report a vulnerability
Use GitHub's **Report a vulnerability** private advisory channel if enabled. Otherwise email **info@rootrcm.com** with a high-level summary and ask for a secure disclosure channel. Do **not** email patient records, credentials, exploit payloads with sensitive data, or production secrets.

We request coordinated disclosure until a safe fix is available. Security issues must not be filed as public GitHub issues.

## Scope and responsible testing
- Avoid testing against live ROOT V1 (rootrcm.com), client infrastructure, external payers, or third-party systems without written authorization.
- Do not attempt data exfiltration, denial of service, account takeover, or social engineering.
- Use synthetic fixtures and separate V2 preview infrastructure.

## Engineering gates
- No PHI, PII customer lists, credential files or real billing transactions in repository/history/actions artifacts or Figma.
- Secret manager and environment segregation; scoped tokens, least privilege and MFA.
- Tenant isolation and server-side authorization tests before activating Appwrite auth or API endpoints.
- Validate inputs; rate-limit public endpoints; verify signed webhooks; audit sensitive actions.
- Run dependency and code scanning. Remediate critical/high findings before release.
- Maintain incident log, rollback procedure, privacy/legal signoff and rotation plan.

**Supported status:** Development preview only. Do not advertise HIPAA/SOC 2/ISO certification absent verifiable evidence.
