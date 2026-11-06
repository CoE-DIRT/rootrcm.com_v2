#requires -Version 7.2
<#
ROOT V2: READ-ONLY audit of the existing lead/CRM tables in root_v2_core.
Prints column keys/types/required and flags columns that lead capture writes but the table lacks.
Never creates, updates or deletes anything. Key is read from a masked prompt (needs databases/tables read only).
Usage: .\ROOT_V2_Audit_Lead_Tables.ps1
#>
[CmdletBinding()] param()
$ErrorActionPreference = 'Stop'
$endpoint = 'https://nyc.cloud.appwrite.io/v1'; $project = '6ae878f400268114a480'; $db = 'root_v2_core'
# Columns written by src/server/leads/capture.ts + outbox-worker.ts
$expected = [ordered]@{
  lead_submissions = 'idempotencyKey dedupKey source status capturedAt contactId companyId sourceRef landingPath consentGiven'
  consent_records  = 'subjectType subjectId consentType granted recordedAt policyVersion source'
  crm_sync_jobs    = 'idempotencyKey provider operation objectType status localId externalId attempts nextAttemptAt lastAttemptAt lastErrorCode createdAt'
  audit_events     = 'eventId action occurredAt actorUserId targetType targetId result requestId'
  crm_contacts     = 'lifecycleStage leadStatus firstName lastName email emailNormalized companyId'
  crm_companies    = 'name lifecycleStage status'
}
$info = 'business_inquiries','crm_deals'
$secret = Read-Host 'Read-only Appwrite API key (hidden)' -AsSecureString
$key = [System.Net.NetworkCredential]::new('', $secret).Password
$h = @{ 'X-Appwrite-Key' = $key; 'X-Appwrite-Project' = $project }
function Get-Cols([string]$t) {
  try { (Invoke-RestMethod -Headers $h -Uri "$endpoint/tablesdb/$db/tables/$t/columns" -TimeoutSec 30).columns }
  catch { if ([int]$_.Exception.Response.StatusCode -eq 404) { $null } else { throw } }
}
try {
  foreach ($t in $expected.Keys + $info) {
    $cols = Get-Cols $t
    if ($null -eq $cols) { Write-Host "$t : MISSING table" -ForegroundColor Red; continue }
    Write-Host "$t : $(@($cols).Count) columns" -ForegroundColor Cyan
    foreach ($c in $cols) { Write-Host ('   {0,-20} {1,-10} required={2}' -f $c.key, $c.type, $c.required) }
    if ($expected.Contains($t)) {
      $have = @($cols | ForEach-Object key)
      $missing = $expected[$t].Split(' ') | Where-Object { $_ -notin $have }
      $reqExtra = @($cols | Where-Object { $_.required -and $_.key -notin $expected[$t].Split(' ') } | ForEach-Object key)
      if ($missing) { Write-Host "   ! capture writes columns the table lacks: $($missing -join ', ')" -ForegroundColor Yellow }
      if ($reqExtra) { Write-Host "   ! table has required columns capture does not write: $($reqExtra -join ', ')" -ForegroundColor Yellow }
      if (-not $missing -and -not $reqExtra) { Write-Host '   OK: compatible with capture' -ForegroundColor Green }
    }
  }
} finally { $key = $null; $h = $null; $secret = $null }
