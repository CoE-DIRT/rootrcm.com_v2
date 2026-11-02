#requires -Version 7.0
<#
.SYNOPSIS
  Discover Appwrite resources and, only with -Create, provision an isolated V2 preview project.

.DESCRIPTION
  Does not modify organization 6a14b03096adbb08348b's existing project 6ac42012001069444210
  or the live Vite site root-website. Does not change plans or paid services.
  Refuses to print secret values. Exits 2 when the CLI is not logged in.

.PARAMETER Create
  Create project id root-vtwo-preview in region nyc when it is absent. Omit to discover only.

.NOTES
  Environment names (never values):
  NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID, ROOT_DEMO_SESSION_BACKEND, ROOT_DEMO_SESSION_DIR.
  Least-privilege API key scopes after the project exists: users.read, teams.read,
  sessions.write, tables.read, rows.read, rows.write.
  Do not grant projects.write, databases.write, or any scope on the V1 project.
#>
[CmdletBinding()]
param([switch]$Create)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$ProtectedProject = '6ac42012001069444210'
$ProtectedSite = 'root-website'
$ProjectId = 'root-vtwo-preview'
$ProjectName = 'ROOT V2 - Isolated Preview'
$Region = 'nyc'

if (-not (Get-Command appwrite -ErrorAction SilentlyContinue)) {
  throw 'Appwrite CLI is not installed. Install it from https://appwrite.io/docs/tooling/command-line/installation and rerun. No project was created.'
}

$accounts = & appwrite client --list 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Appwrite CLI is not authenticated. Run: appwrite login'
  Write-Host 'That is the single account action required. Do not paste keys into chat.'
  exit 2
}
Write-Host $accounts

$projectsRaw = & appwrite projects list 2>&1
if ($LASTEXITCODE -ne 0) { throw 'Could not list projects. No project was created.' }
Write-Host $projectsRaw
if ($projectsRaw -match $ProtectedProject) {
  Write-Host "Found protected V1 project $ProtectedProject. It will not be modified."
}

if ($projectsRaw -match [regex]::Escape($ProjectId)) {
  Write-Host "Isolated project $ProjectId already exists. No create call was made."
  exit 0
}

if (-not $Create) {
  Write-Host "Discovery only. Re-run with -Create to add $ProjectId in $Region. V1 site $ProtectedSite was not changed."
  exit 0
}

& appwrite projects create --project-id $ProjectId --name $ProjectName --region $Region
if ($LASTEXITCODE -ne 0) { throw 'Project create failed. The V1 project was not modified.' }
Write-Host "Created $ProjectId. Add a server key in the console with scopes users.read, teams.read, sessions.write, tables.read, rows.read, rows.write."
Write-Host 'Store the key as APPWRITE_API_KEY in the host. Do not print it here. Do not point it at the V1 project.'
