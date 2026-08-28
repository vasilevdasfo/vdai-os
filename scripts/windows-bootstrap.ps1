param([switch]$Start)

$ErrorActionPreference = 'Stop'
$ProjectDir = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $ProjectDir '.env'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker Desktop is required. Run windows-preflight.ps1 first.'
}
docker compose version | Out-Null

function New-HexSecret([int]$Bytes) {
  $buffer = New-Object byte[] $Bytes
  [Security.Cryptography.RandomNumberGenerator]::Fill($buffer)
  return [Convert]::ToHexString($buffer).ToLowerInvariant()
}

if (-not (Test-Path $EnvFile)) {
  @(
    'VDAI_BIND=127.0.0.1'
    'VDAI_PORT=3000'
    'SERVER_URL=http://localhost:3000'
    'PG_DATABASE_USER=vdai'
    'PG_DATABASE_NAME=vdai'
    "PG_DATABASE_PASSWORD=$(New-HexSecret 24)"
    "ENCRYPTION_KEY=$(New-HexSecret 32)"
    "APP_SECRET=$(New-HexSecret 32)"
  ) | Set-Content -Path $EnvFile -Encoding utf8NoBOM
  Write-Host 'Created local .env with random secrets. Do not share or commit it.'
} else {
  Write-Host 'Using existing local .env; no secret was replaced.'
}

docker compose --project-directory $ProjectDir config --quiet
if (-not $Start) {
  Write-Host 'BOOTSTRAP_VALIDATED: run again with -Start to start the local test stack.'
  exit 0
}

docker compose --project-directory $ProjectDir up -d
docker compose --project-directory $ProjectDir ps
node (Join-Path $ProjectDir 'scripts\proof-receipt.mjs') --platform windows --step local_stack_started --result pass
Write-Host 'BOOTSTRAP_STARTED: local-only test instance is starting at http://localhost:3000'
Write-Host 'This receipt proves local start only, not shared or production access.'
