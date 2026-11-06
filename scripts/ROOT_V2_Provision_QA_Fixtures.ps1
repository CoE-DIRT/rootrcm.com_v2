#requires -Version 7.2
<#
ROOT V2: synthetic QA fixtures for hosted dashboard acceptance (PR #78).
- Creates 4 SYNTHETIC verified users (admin, staff, client, pending) and two client orgs (A, B)
  plus memberships. Existing project/database/tables only; never touches real users or root_internal rows.
- Idempotent: re-running skips fixtures that already exist; refuses on any ambiguity.
- Everything is tagged: org/membership row IDs start with 'qa-fixture-'; users use the QA email domain.
- Passwords are read from masked prompts, held in memory only, never printed, logged or written to disk.
- The API key is read from a masked prompt (scopes: users.read/write, rows.read/write on
  organizations + memberships). Use a short-lived key and delete it afterwards.
Usage:
  .\ROOT_V2_Provision_QA_Fixtures.ps1 -Plan      # no network, prints intent
  .\ROOT_V2_Provision_QA_Fixtures.ps1 -Apply     # prompts, then creates
  .\ROOT_V2_Provision_QA_Fixtures.ps1 -Cleanup   # removes ONLY tagged fixtures
Optional: -EmailDomain qa.example.com  -OrgBusinessType <value allowed by organizations.businessType>
#>
[CmdletBinding(DefaultParameterSetName='Plan')]
param(
  [Parameter(ParameterSetName='Plan')][switch]$Plan,
  [Parameter(Mandatory,ParameterSetName='Apply')][switch]$Apply,
  [Parameter(Mandatory,ParameterSetName='Cleanup')][switch]$Cleanup,
  [string]$EmailDomain='qa.example.com',
  [string]$OrgBusinessType='practice'
)
$ErrorActionPreference='Stop'
$endpoint='https://nyc.cloud.appwrite.io/v1'
$project='6ae878f400268114a480'
$db='root_v2_core'
$tag='qa-fixture-'
$orgs=@('qa-fixture-org-a','qa-fixture-org-b')
$fixtures=@(
  @{key='admin';   email="qa-admin@$EmailDomain";   name='QA Admin (synthetic)';   org='root_internal';    role='ROOT_SUPERADMIN'}
  @{key='staff';   email="qa-staff@$EmailDomain";   name='QA Staff (synthetic)';   org='root_internal';    role='ROOT_SPECIALIST'}
  @{key='client';  email="qa-client@$EmailDomain";  name='QA Client (synthetic)';  org='qa-fixture-org-a'; role='CLIENT_OWNER'}
  @{key='pending'; email="qa-pending@$EmailDomain"; name='QA Pending (synthetic)'; org=$null;              role=$null}
)
Write-Host 'ROOT V2 synthetic QA fixtures' -ForegroundColor Cyan
Write-Host "Target: $project | $db | domain: $EmailDomain"
foreach ($f in $fixtures) { Write-Host (' - {0,-8} {1}  org={2}  role={3}' -f $f.key,$f.email,$f.org,$f.role) }
Write-Host " - orgs: $($orgs -join ', ')  (org B is the cross-tenant target)"
Write-Host 'NOTE: QA admin/staff memberships use QA user IDs only; the real admin is never read or changed.'
if ($PSCmdlet.ParameterSetName -eq 'Plan') { Write-Host 'No changes in -Plan mode.'; return }

$secret=Read-Host 'Short-lived Appwrite API key (hidden)' -AsSecureString
$key=[System.Net.NetworkCredential]::new('', $secret).Password
if ([string]::IsNullOrWhiteSpace($key)) { throw 'Missing API key.' }
$headers=@{'X-Appwrite-Key'=$key;'X-Appwrite-Project'=$project}
function Invoke-Root([string]$Method,[string]$Path,[object]$Body=$null,[switch]$Allow404) {
  $a=@{Method=$Method;Uri="$endpoint$Path";Headers=$headers;ContentType='application/json';TimeoutSec=30;ErrorAction='Stop'}
  if ($null -ne $Body) { $a.Body=ConvertTo-Json -InputObject $Body -Depth 8 -Compress }
  try { return Invoke-RestMethod @a }
  catch { if ($Allow404 -and [int]$_.Exception.Response.StatusCode -eq 404) { return $null }; throw }
}
function Read-Masked([string]$Prompt) {
  $s=Read-Host $Prompt -AsSecureString
  return [System.Net.NetworkCredential]::new('', $s).Password
}
function Find-User([string]$Email) {
  $r=Invoke-Root 'GET' ('/users?search='+[uri]::EscapeDataString($Email))
  $m=@($r.users | Where-Object { $_.email -ceq $Email })
  if ($m.Count -gt 1) { throw "Duplicate users for $Email." }
  return ($m | Select-Object -First 1)
}
$orgBase="/tablesdb/$db/tables/organizations/rows"
$memBase="/tablesdb/$db/tables/memberships/rows"
function Membership-Id([string]$userId,[string]$org) {
  $h=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes("$userId|$org"))).ToLower()
  return $tag+$h.Substring(0,20)
}
try {
  if ((Invoke-Root 'GET' '/project').'$id' -ne $project) { throw 'Unexpected project; aborted.' }

  if ($Cleanup) {
    if ((Read-Host 'Type CLEANUP to delete ONLY tagged QA fixtures') -cne 'CLEANUP') { Write-Host 'Cancelled.'; return }
    foreach ($f in $fixtures) {
      $u=Find-User $f.email
      if ($null -eq $u) { continue }
      if ($f.role) { Invoke-Root 'DELETE' "$memBase/$(Membership-Id $u.'$id' $f.org)" -Allow404 | Out-Null }
      Invoke-Root 'DELETE' "/users/$($u.'$id')" | Out-Null
      Write-Host "removed $($f.key)"
    }
    foreach ($o in $orgs) { Invoke-Root 'DELETE' "$orgBase/$o" -Allow404 | Out-Null }
    Write-Host 'SUCCESS: QA fixtures removed. Delete the API key now.' -ForegroundColor Green
    return
  }

  # Validate business type against the live schema instead of guessing.
  $col=Invoke-Root 'GET' "/tablesdb/$db/tables/organizations/columns/businessType" -Allow404
  if ($col -and $col.elements -and ($col.elements -notcontains $OrgBusinessType)) {
    throw "businessType '$OrgBusinessType' not allowed. Allowed: $($col.elements -join ', '). Re-run with -OrgBusinessType."
  }
  if ((Read-Host 'Type PROVISION to create synthetic QA users/orgs/memberships') -cne 'PROVISION') { Write-Host 'Cancelled.'; return }

  foreach ($o in $orgs) {
    if ($null -ne (Invoke-Root 'GET' "$orgBase/$o" -Allow404)) { Write-Host "org $o exists (skipped)"; continue }
    $data=@{legalName="QA Fixture $o (synthetic)";displayName="QA $o";website='https://example.com';businessType=$OrgBusinessType
      status='active';ownerUserId='qa-fixture';source='internal';createdAt=[DateTime]::UtcNow.ToString('o')}
    Invoke-Root 'POST' $orgBase @{rowId=$o;data=$data} | Out-Null
    Write-Host "org $o created"
  }
  foreach ($f in $fixtures) {
    $u=Find-User $f.email
    if ($null -eq $u) {
      $pw1=Read-Masked "Password for $($f.email) (12+ chars)"; $pw2=Read-Masked 'Repeat'
      if ($pw1 -cne $pw2 -or $pw1.Length -lt 12) { throw 'Password mismatch or too short.' }
      $u=Invoke-Root 'POST' '/users' @{userId='unique()';email=$f.email;password=$pw1;name=$f.name}
      $pw1=$null; $pw2=$null
      Write-Host "user $($f.key) created"
    } else { Write-Host "user $($f.key) exists (skipped)" }
    if (-not $u.emailVerification) { $u=Invoke-Root 'PATCH' "/users/$($u.'$id')/verification" @{emailVerification=$true} }
    if (-not $u.status) { throw "User $($f.key) is disabled; resolve manually." }
    if (-not $f.role) { continue }
    $mid=Membership-Id $u.'$id' $f.org
    if ($null -ne (Invoke-Root 'GET' "$memBase/$mid" -Allow404)) { Write-Host "membership $($f.key) exists (skipped)"; continue }
    $m=@{userId=$u.'$id';orgId=$f.org;role=$f.role;status='active';grantedAt=[DateTime]::UtcNow.ToString('o')}
    Invoke-Root 'POST' $memBase @{rowId=$mid;data=$m} | Out-Null
    Write-Host "membership $($f.key) -> $($f.org)/$($f.role)"
  }
  Write-Host 'SUCCESS. Locally export ACCEPT_{ADMIN,STAFF,CLIENT,PENDING}_EMAIL/PASSWORD, ACCEPT_CLIENT_ORG_ID=qa-fixture-org-a, ACCEPT_OTHER_ORG_ID=qa-fixture-org-b.' -ForegroundColor Green
  Write-Host 'Run -Cleanup after acceptance, then delete the API key.'
} finally { $headers=$null; $key=$null; $secret=$null }
