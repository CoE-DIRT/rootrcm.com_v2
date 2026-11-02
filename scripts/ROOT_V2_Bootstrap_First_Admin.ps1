#requires -Version 7.2
<#
ROOT V2: one-time first internal ROOT_SUPERADMIN bootstrap.
- Must have signed up and VERIFIED personal Gmail user in ROOT V2 Auth.
- Does not create login credentials, alter other users, or change deployments.
- Idempotent: refuses to overwrite an existing organization or membership.
- Uses existing V2 project and existing TablesDB schema only.
Usage:
  & .\ROOT_V2_Bootstrap_First_Admin.ps1 -Plan
  & .\ROOT_V2_Bootstrap_First_Admin.ps1 -Apply
#>
[CmdletBinding(DefaultParameterSetName='Plan')]
param(
  [Parameter(ParameterSetName='Plan')][switch]$Plan,
  [Parameter(Mandatory,ParameterSetName='Apply')][switch]$Apply
)
$ErrorActionPreference='Stop'
$endpoint='https://nyc.cloud.appwrite.io/v1'
$project='6ae878f400268114a480'
$db='root_v2_core'
$orgId='root_internal'
$email='muhammadaftabshaukat@gmail.com'
Write-Host 'ROOT V2 First Admin Bootstrap' -ForegroundColor Cyan
Write-Host "Target: $project | Database: $db | Organization: $orgId"
Write-Host "User to grant: $email | Role: ROOT_SUPERADMIN"
if ($PSCmdlet.ParameterSetName -eq 'Plan') {
  Write-Host 'No changes in -Plan mode.'
  Write-Host 'First register and verify this exact email on the local ROOT V2 /en/sign-in page.'
  Write-Host 'Run -Apply only after verification. This script does not change other accounts.'
  return
}
$secret=Read-Host 'ROOT-V2-INFRA-ADMIN API key (hidden)' -AsSecureString
$key=[System.Net.NetworkCredential]::new('', $secret).Password
if ([string]::IsNullOrWhiteSpace($key)) { throw 'Missing Appwrite API key.' }
$headers=@{'X-Appwrite-Key'=$key;'X-Appwrite-Project'=$project}
function Invoke-Root([string]$Method,[string]$Path,[object]$Body=$null,[switch]$Allow404) {
  $args=@{Method=$Method;Uri="$endpoint$Path";Headers=$headers;ContentType='application/json';TimeoutSec=30;ErrorAction='Stop'}
  if ($null -ne $Body) { $args.Body=ConvertTo-Json -InputObject $Body -Depth 8 -Compress }
  try { return Invoke-RestMethod @args }
  catch {
    if ($Allow404 -and [int]$_.Exception.Response.StatusCode -eq 404) { return $null }
    throw
  }
}
try {
  $prj=Invoke-Root 'GET' '/project'
  if ($prj.'$id' -ne $project) { throw 'Unexpected Appwrite project; aborted.' }
  $q=[uri]::EscapeDataString($email)
  $candidates=Invoke-Root 'GET' "/users?search=$q"
  $users=@($candidates.users | Where-Object { $_.email -ceq $email })
  if ($users.Count -ne 1) { throw "Expected exactly one registered ROOT user for $email, found $($users.Count). Sign up locally first." }
  $u=$users[0]
  if (!$u.emailVerification -or !$u.status) { throw 'ROOT user email not verified or user disabled; no roles changed.' }
  if ($u.'$id' -notmatch '^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$') { throw 'Unexpected user ID format.' }
  $orgBase="/tablesdb/$db/tables/organizations/rows"
  $memberBase="/tablesdb/$db/tables/memberships/rows"
  $org=Invoke-Root 'GET' "$orgBase/$orgId" -Allow404
  if ($null -ne $org -and $org.ownerUserId -and $org.ownerUserId -ne $u.'$id') {
    throw 'ROOT internal organization is already owned by a different user. Stopped.'
  }
  $qUser=[uri]::EscapeDataString(('{"method":"equal","attribute":"userId","values":["'+$u.'$id'+'"]}'))
  $qOrg=[uri]::EscapeDataString(('{"method":"equal","attribute":"orgId","values":["'+$orgId+'"]}'))
  $existing=Invoke-Root 'GET' "$memberBase?queries[]=$qUser&queries[]=$qOrg"
  if ($existing.total -gt 1) { throw 'Duplicate membership rows detected. Stopped.' }
  if ($existing.total -eq 1) {
    $row=@($existing.rows)[0]
    if ($row.role -ne 'ROOT_SUPERADMIN' -or $row.status -ne 'active' -or $row.revokedAt) {
      throw 'An existing non-active or different membership requires manual review; not overwriting.'
    }
    Write-Host 'SUCCESS: verified ROOT_SUPERADMIN membership already exists (no changes).' -ForegroundColor Green
    return
  }
  Write-Host "Verified ROOT V2 user: $email"
  Write-Host "User ID: $($u.'$id')"
  Write-Host "Organization exists: $($null -ne $org)"
  $confirm=Read-Host 'Type GRANT to create ROOT internal organization (if missing) and assign ROOT_SUPERADMIN'
  if ($confirm -cne 'GRANT') { Write-Host 'Cancelled.'; return }
  if ($null -eq $org) {
    $data=@{
      legalName='Revenue Operations & Outcomes Technology Incorporated'
      displayName='ROOT'
      website='https://rootrcm.com'
      businessType='internal'
      status='active'
      ownerUserId=$u.'$id'
      source='internal'
      createdAt=[DateTime]::UtcNow.ToString('o')
    }
    Invoke-Root 'POST' $orgBase @{rowId=$orgId;data=$data} | Out-Null
    Write-Host 'Created ROOT internal organization.'
  }
  $hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($u.'$id'))).ToLower()
  $membershipId='root-admin-'+$hash.Substring(0,20)
  $membership=@{
    userId=$u.'$id'
    orgId=$orgId
    role='ROOT_SUPERADMIN'
    status='active'
    grantedAt=[DateTime]::UtcNow.ToString('o')
  }
  Invoke-Root 'POST' $memberBase @{rowId=$membershipId;data=$membership} | Out-Null
  $created=Invoke-Root 'GET' "$memberBase/$membershipId"
  if ($created.userId -ne $u.'$id' -or $created.role -ne 'ROOT_SUPERADMIN' -or $created.orgId -ne $orgId) {
    throw 'Created membership failed read-back verification.'
  }
  Write-Host "SUCCESS: ROOT_SUPERADMIN granted to $email in organization $orgId." -ForegroundColor Green
  Write-Host 'Log out and log back in at http://localhost:3000/en/sign-in, then visit /en/dashboard/admin?orgId=root_internal.'
} finally {
  $headers=$null; $key=$null; $secret=$null
}
