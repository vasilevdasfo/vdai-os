param([switch]$Install)

$ErrorActionPreference = 'Stop'

function Test-Command($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

if ($Install) {
  if (-not (Test-Command 'winget')) {
    throw 'winget is required for -Install. Install Microsoft App Installer first.'
  }
  $packages = @('Git.Git', 'Docker.DockerDesktop', 'OpenJS.NodeJS.LTS')
  foreach ($package in $packages) {
    winget install --id $package --exact --accept-package-agreements --accept-source-agreements
  }
  Write-Host 'Restart Windows if Docker Desktop requests it, then run this script again without -Install.'
  exit 0
}

$checks = [ordered]@{
  git = Test-Command 'git'
  docker = Test-Command 'docker'
  node = Test-Command 'node'
  corepack = Test-Command 'corepack'
  pnpm = Test-Command 'pnpm'
}

if ($checks.corepack -and -not $checks.pnpm) {
  corepack enable
  corepack prepare pnpm@11.19.0 --activate
  $checks.pnpm = Test-Command 'pnpm'
}

$checks.GetEnumerator() | ForEach-Object { Write-Host ("{0}={1}" -f $_.Key, $_.Value) }
if ($checks.Values -contains $false) {
  Write-Host 'PREFLIGHT_BLOCKED: run .\scripts\windows-preflight.ps1 -Install in Administrator PowerShell.'
  exit 1
}

docker version --format 'docker_client={{.Client.Version}} docker_server={{.Server.Version}}'
node --version
pnpm --version
Write-Host 'PREFLIGHT_READY'
