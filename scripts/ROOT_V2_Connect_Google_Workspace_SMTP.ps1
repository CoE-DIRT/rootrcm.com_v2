#requires -Version 7.2
<#
ROOT V2 — Connect Google Workspace SMTP directly to existing Appwrite V2 project.
Use this only if info@rootrcm.com is a real Google Workspace mailbox with
two-step verification and a Google App Password. No Resend or new Appwrite plan.
Commands:
  & .\ROOT_V2_Connect_Google_Workspace_SMTP.ps1 -Plan
  & .\ROOT_V2_Connect_Google_Workspace_SMTP.ps1 -Configure
  & .\ROOT_V2_Connect_Google_Workspace_SMTP.ps1 -TestEmail recipient@example.com
#>
[CmdletBinding(DefaultParameterSetName='Plan')]
param(
  [Parameter(ParameterSetName='Plan')][switch]$Plan,
  [Parameter(Mandatory,ParameterSetName='Configure')][switch]$Configure,
  [Parameter(Mandatory,ParameterSetName='Test')][ValidatePattern('^[^\s@]+@[^\s@]+\.[^\s@]+$')][string]$TestEmail
)
$ErrorActionPreference = 'Stop'
$ProjectId = '6ae878f400268114a480'
$Endpoint = 'https://nyc.cloud.appwrite.io/v1'
$Sender = 'info@rootrcm.com'
if ($PSCmdlet.ParameterSetName -eq 'Plan') {
  Write-Host 'ROOT V2 Google Workspace SMTP: smtp.gmail.com:587 (STARTTLS).' -ForegroundColor Cyan
  Write-Host "Appwrite V2: $ProjectId | sender and reply-to: $Sender"
  Write-Host 'Prerequisite: two-step verification and Google App Password for the actual info@ mailbox.'
  Write-Host 'Does not change DNS, login identities, project, or website deployment.'
  return
}
$appwriteSecret = Read-Host 'ROOT-V2-INFRA-ADMIN API key (hidden)' -AsSecureString
$key = [System.Net.NetworkCredential]::new('', $appwriteSecret).Password
if (!$key) { throw 'Appwrite key required.' }
$headers = @{ 'X-Appwrite-Project'=$ProjectId; 'X-Appwrite-Key'=$key }
function Invoke-Root([string]$Method,[string]$Path,[object]$Body=$null) {
  $p = @{ Method=$Method; Uri="$Endpoint$Path"; Headers=$headers; ErrorAction='Stop'; TimeoutSec=30; ContentType='application/json' }
  if ($null -ne $Body) { $p.Body = ConvertTo-Json -InputObject $Body -Depth 7 -Compress }
  Invoke-RestMethod @p
}
$mailboxSecret=$null; $workspacePassword=$null
try {
  $project=Invoke-Root 'GET' '/project'
  if ($project.'$id' -ne $ProjectId) { throw 'Incorrect Appwrite project; stopped.' }
  Write-Host "Project: $($project.name)"
  if ($PSCmdlet.ParameterSetName -eq 'Configure') {
    if ($project.smtpEnabled -and $project.smtpHost -ne 'smtp.gmail.com') { throw 'Another SMTP provider is active. Review before replacing it.' }
    $mailboxSecret=Read-Host 'Google Workspace info@rootrcm.com APP PASSWORD (not account password, hidden)' -AsSecureString
    $workspacePassword=[System.Net.NetworkCredential]::new('', $mailboxSecret).Password -replace '\s',''
    if ($workspacePassword.Length -ne 16) { throw 'Google App Password must be 16 characters. Nothing changed.' }
    Write-Host 'Destination: smtp.gmail.com:587 TLS; sender info@rootrcm.com.'
    if ((Read-Host 'Type GOOGLE to configure ROOT V2 SMTP') -cne 'GOOGLE') { Write-Host 'Cancelled.'; return }
    $payload=@{
      host='smtp.gmail.com'; port=587; username=$Sender; password=$workspacePassword;
      senderEmail=$Sender; senderName='ROOT - Revenue Operations & Outcomes Technology';
      replyToEmail=$Sender; replyToName='ROOT Client Support'; secure='tls'; enabled=$true
    }
    Invoke-Root 'PATCH' '/project/smtp' $payload | Out-Null
    $updated=Invoke-Root 'GET' '/project'
    if (!$updated.smtpEnabled -or $updated.smtpHost -ne 'smtp.gmail.com' -or $updated.smtpSenderEmail -ne $Sender) {
      throw 'SMTP not verified; check Appwrite Console > Settings > SMTP.'
    }
    Write-Host 'SUCCESS: Appwrite SMTP uses Google Workspace, not Resend.' -ForegroundColor Green
    Write-Host 'Next: run ROOT_V2_Brand_Appwrite_Emails.ps1 -Mode Apply.'
  } else {
    if (!$project.smtpEnabled) { throw 'SMTP not enabled. Run -Configure first.' }
    Write-Host "SMTP: $($project.smtpHost); sender: $($project.smtpSenderEmail)"
    if ((Read-Host "Type SEND to send SMTP test to $TestEmail") -cne 'SEND') { Write-Host 'Cancelled.'; return }
    Invoke-Root 'POST' '/project/smtp/tests' @{ emails=@($TestEmail) } | Out-Null
    Write-Host "Test queued for $TestEmail. Check delivery and sender." -ForegroundColor Green
  }
} finally { $workspacePassword=$null; $mailboxSecret=$null; $key=$null; $appwriteSecret=$null; $headers=$null }
