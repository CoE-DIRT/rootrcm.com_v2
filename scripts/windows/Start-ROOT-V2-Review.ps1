#requires -Version 7.0
[CmdletBinding()]
param(
    [string]$Repository = '',
    [string]$Ref = 'HEAD',
    [switch]$SkipFetch,
    [ValidateRange(1024,65535)][int]$Port = 3032
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Checked {
    param([string]$Command, [string[]]$Arguments)
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Command failed with exit code $LASTEXITCODE. Stopping." }
}

foreach ($tool in @('git','node','npm.cmd','go','pwsh')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "Missing prerequisite: $tool. Install it from its official source, then rerun." }
}
if (-not $Repository) {
    $candidates = @((Get-Location).Path, 'C:\Dev\ROOT\rootrcm.com_v2', (Join-Path $env:USERPROFILE 'Documents\GitHub\rootrcm.com_v2'))
    foreach ($candidate in $candidates) {
        if (Test-Path (Join-Path $candidate '.git')) { $Repository = $candidate; break }
    }
}
if (-not $Repository) { throw 'Repository not found. Rerun with -Repository followed by your existing ROOT V2 path.' }
$Repository = (Resolve-Path -LiteralPath $Repository).Path
$remote = & git -C $Repository remote get-url origin
if ($LASTEXITCODE -ne 0 -or $remote -notmatch '[:/]CoE-DIRT/rootrcm\.com_v2(?:\.git)?/?$') { throw 'Origin is not the expected ROOT V2 repository.' }
if ($Ref.StartsWith('-')) { throw 'Invalid Git ref.' }
foreach ($listenPort in @($Port,8787)) {
    if (Get-NetTCPConnection -LocalPort $listenPort -State Listen -ErrorAction SilentlyContinue) { throw "Port $listenPort is already in use. No existing process will be stopped." }
}
if (-not $SkipFetch) { Invoke-Checked git @('-C',$Repository,'fetch','origin','--prune') }
$sha = & git -C $Repository rev-parse --verify "$Ref^{commit}"
if ($LASTEXITCODE -ne 0) { throw "Review ref unavailable: $Ref" }
Write-Host 'Existing Cursor work is preserved:' -ForegroundColor Cyan
Invoke-Checked git @('-C',$Repository,'status','--short')
$previewRoot = Join-Path $env:LOCALAPPDATA 'ROOT-V2-Reviews'
New-Item -ItemType Directory -Path $previewRoot -Force | Out-Null
$preview = Join-Path $previewRoot ((Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,6))
Invoke-Checked git @('-C',$Repository,'worktree','add','--detach',$preview,$sha.Trim())
Push-Location $preview
try {
    Invoke-Checked npm.cmd @('ci')
    Invoke-Checked npm.cmd @('run','lint','--','--max-warnings=0')
    Invoke-Checked npm.cmd @('run','typecheck')
    Invoke-Checked npm.cmd @('test')
    $env:ROOT_GO_HEALTHCARE_PREVIEW_URL = 'http://127.0.0.1:8787'
    Invoke-Checked npm.cmd @('run','build')
    Push-Location (Join-Path $preview 'services\healthcare-go')
    try {
        Invoke-Checked go @('test','./...')
        Invoke-Checked go @('vet','./...')
        $goBinary = Join-Path $previewRoot ('healthcare-' + [guid]::NewGuid().ToString('N') + '.exe')
        Invoke-Checked go @('build','-o',$goBinary,'./cmd/healthcare-api')
    } finally { Pop-Location }
    $goProcess = Start-Process -FilePath $goBinary -WorkingDirectory $preview -PassThru
    $goReady = $false
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        if ($goProcess.HasExited) { throw 'Go exited before becoming healthy.' }
        try {
            $health = Invoke-WebRequest 'http://127.0.0.1:8787/healthz' -TimeoutSec 2
            if ($health.StatusCode -eq 200) { $goReady = $true; break }
        } catch { Start-Sleep -Milliseconds 500 }
    }
    if (-not $goReady) { throw 'Go did not become healthy. Next.js was not started.' }
    $nextCli = Join-Path $preview 'node_modules\next\dist\bin\next'
    $nextProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList @(('"' + $nextCli + '"'),'start','--hostname','127.0.0.1','--port',"$Port") -WorkingDirectory $preview -PassThru
    $url = "http://127.0.0.1:$Port/en"
    $webReady = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        if ($nextProcess.HasExited) { throw 'Next.js exited before becoming ready.' }
        try {
            if ((Invoke-WebRequest $url -TimeoutSec 3).StatusCode -eq 200) { $webReady = $true; break }
        } catch { Start-Sleep -Milliseconds 500 }
    }
    if (-not $webReady) { throw 'Next.js did not become ready.' }
    Write-Host "Verified local HTTP response: $url`nCommit: $sha`nReview folder: $preview`nGo PID: $($goProcess.Id) / Next.js PID: $($nextProcess.Id)" -ForegroundColor Green
    Write-Host "Stop only these preview processes later: Stop-Process -Id $($goProcess.Id),$($nextProcess.Id)"
    Start-Process $url
} catch {
    # Stop only processes created by this invocation; preserve the review checkout.
    foreach ($processName in @('nextProcess','goProcess')) {
        $owned = Get-Variable -Name $processName -ValueOnly -ErrorAction SilentlyContinue
        if ($owned -and -not $owned.HasExited) { Stop-Process -Id $owned.Id -ErrorAction SilentlyContinue }
    }
    throw
} finally { Pop-Location }
