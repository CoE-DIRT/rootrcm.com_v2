#requires -Version 7.2
<#
  ROOT V2 Appwrite native auth email branding
  Existing project: 6ae878f400268114a480 (NYC)
  Runs after Appwrite Settings > SMTP > one-click Resend setup.
  -Status: check Appwrite project SMTP status and template metadata.
  -Apply: set English/Spanish verification + password recovery templates.
  Requires private ROOT-V2-INFRA-ADMIN API key with project.read,
  templates.read and templates.write. No secret written to a file.
  This script does not alter SMTP, DNS, authentication, or production deployments.
#>
[CmdletBinding()]
param(
  [ValidateSet('Status','Apply')][string]$Mode = 'Status'
)
$ErrorActionPreference = 'Stop'
$ProjectId = '6ae878f400268114a480'
$Api = 'https://nyc.cloud.appwrite.io/v1'
Write-Host "ROOT V2 branded auth mail | $Mode" -ForegroundColor Cyan
$protected = Read-Host 'Enter ROOT-V2-INFRA-ADMIN key (hidden)' -AsSecureString
$key = [System.Net.NetworkCredential]::new('', $protected).Password
if ([string]::IsNullOrWhiteSpace($key)) { throw 'API key is required.' }
$headers = @{ 'X-Appwrite-Project'=$ProjectId; 'X-Appwrite-Key'=$key }
function Invoke-RootApi([string]$Method,[string]$Path,[object]$Body=$null) {
  $args = @{
    Method=$Method; Uri="$Api$Path"; Headers=$headers;
    ContentType='application/json'; ErrorAction='Stop'; TimeoutSec=30
  }
  if ($null -ne $Body) { $args.Body = ConvertTo-Json -InputObject $Body -Depth 8 -Compress }
  Invoke-RestMethod @args
}
try {
  $project = Invoke-RootApi 'GET' '/project'
  if ($project.'$id' -ne $ProjectId) { throw 'Project ID did not match ROOT V2. Stopped.' }
  Write-Host "Project: $($project.name)"
  Write-Host "Custom SMTP active: $($project.smtpEnabled)"
  Write-Host "SMTP sender: $($project.smtpSenderEmail)"
  if (!$project.smtpEnabled) {
    Write-Warning 'Custom SMTP is not enabled. Appwrite will keep sending generic Appwrite emails.'
    Write-Host 'Next: Appwrite Console > ROOT V2 > Settings > SMTP > Connect with Resend.'
    Write-Host 'Select a verified rootrcm.com domain and noreply@rootrcm.com, then rerun this script.'
    return
  }
  if ($project.smtpSenderEmail -notmatch '^[^@\s]+@rootrcm\.com$') {
    throw 'SMTP sender must be on rootrcm.com. Set sender to noreply@rootrcm.com in Appwrite SMTP first.'
  }
  if ($Mode -eq 'Status') {
    foreach ($id in @('verification','recovery')) {
      foreach ($lang in @('en','es')) {
        $t = Invoke-RootApi 'GET' "/project/templates/email/$id?locale=$lang"
        Write-Host ("{0}/{1}: {2} | From: {3}" -f $id,$lang,$t.subject,$t.senderEmail)
      }
    }
    return
  }
  $confirm = Read-Host 'Type BRAND to update ROOT email templates in existing V2 project'
  if ($confirm -cne 'BRAND') { Write-Host 'Cancelled.'; return }
  $items = @(
    @{ id='verification'; lang='en'; title='Verify your ROOT account'; button='Verify email'; detail='Confirm your email address to activate your ROOT account.'; footer='If you did not request this verification, you can safely ignore this email.' },
    @{ id='verification'; lang='es'; title='Verifique su cuenta ROOT'; button='Verificar correo'; detail='Confirme su correo electronico para activar su cuenta ROOT.'; footer='Si no solicito esta verificacion, puede ignorar este mensaje.' },
    @{ id='recovery'; lang='en'; title='Reset your ROOT password'; button='Reset password'; detail='We received a request to reset the password for your ROOT account.'; footer='If this was not you, ignore this message. Your password has not changed.' },
    @{ id='recovery'; lang='es'; title='Restablezca su contrasena ROOT'; button='Restablecer contrasena'; detail='Recibimos una solicitud para restablecer la contrasena de su cuenta ROOT.'; footer='Si no hizo esta solicitud, ignore este mensaje.' }
  )
  foreach ($t in $items) {
    $html = "<div style='max-width:620px;margin:0 auto;padding:28px;font-family:Arial,sans-serif;color:#15263d;background:#ffffff'>" +
      "<div style='font-size:24px;font-weight:800;color:#12546b'>ROOT</div>" +
      "<p style='font-size:12px;color:#64748b'>Revenue Operations &amp; Outcomes Technology</p>" +
      "<h1 style='font-size:24px'>"+$t.title+"</h1>" +
      "<p>"+$t.detail+"</p>" +
      "<p style='margin:28px 0'><a href='{{redirect}}' style='padding:14px 22px;background:#12546b;color:#ffffff;text-decoration:none;border-radius:8px'>"+$t.button+"</a></p>" +
      "<p style='color:#64748b'>"+$t.footer+"</p>" +
      "<hr style='border:0;border-top:1px solid #e2e8f0' />" +
      "<p style='font-size:12px;color:#64748b'>ROOT Client Support | info@rootrcm.com</p></div>"
    $data = @{
      templateId=$t.id; locale=$t.lang; subject=$t.title; message=$html;
      senderName='ROOT - Revenue Operations & Outcomes Technology';
      senderEmail=$project.smtpSenderEmail;
      replyToEmail='info@rootrcm.com'; replyToName='ROOT Client Support'
    }
    Invoke-RootApi 'PATCH' '/project/templates/email' $data | Out-Null
    $check = Invoke-RootApi 'GET' "/project/templates/email/$($t.id)?locale=$($t.lang)"
    if ($check.subject -ne $t.title -or $check.message -notlike '*{{redirect}}*') {
      throw "Template verification failed: $($t.id)/$($t.lang)"
    }
    Write-Host "Verified $($t.id)/$($t.lang)" -ForegroundColor Green
  }
  Write-Host 'SUCCESS: 4/4 ROOT-branded auth templates saved.' -ForegroundColor Green
  Write-Host 'Test: send a new verification and password recovery to an inbox you control.'
  Write-Host 'Inspect From, DKIM/SPF, branding and redirect URL before enabling public signup.'
} finally {
  $key=$null; $protected=$null; $headers=$null
}
