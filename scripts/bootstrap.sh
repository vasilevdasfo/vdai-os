#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="$project_dir/.env"

"$project_dir/scripts/local-preflight.sh"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Desktop or Docker Engine first." >&2
  exit 1
fi
docker compose version >/dev/null

if [[ ! -f "$env_file" ]]; then
  umask 077
  vdai_bind="${VDAI_BIND:-127.0.0.1}"
  vdai_port="${VDAI_PORT:-3000}"
  server_url="${SERVER_URL:-http://localhost:${vdai_port}}"
  db_password="$(openssl rand -hex 24)"
  encryption_key="$(openssl rand -base64 32 | tr -d '\n')"
  app_secret="$(openssl rand -base64 32 | tr -d '\n')"
  {
    echo "VDAI_BIND=$vdai_bind"
    echo "VDAI_PORT=$vdai_port"
    echo "SERVER_URL=$server_url"
    echo "PG_DATABASE_USER=vdai"
    echo "PG_DATABASE_NAME=vdai"
    echo "PG_DATABASE_PASSWORD=$db_password"
    echo "ENCRYPTION_KEY=$encryption_key"
    echo "APP_SECRET=$app_secret"
  } > "$env_file"
  chmod 600 "$env_file"
  echo "Created local .env with random secrets."
else
  echo "Using existing local .env."
fi

docker compose --project-directory "$project_dir" config --quiet
docker compose --project-directory "$project_dir" up -d
health_url="${SERVER_URL:-http://localhost:${VDAI_PORT:-3000}}/healthz"
ready=false
for _ in $(seq 1 60); do
  if curl --fail --silent "$health_url" >/dev/null 2>&1; then ready=true; break; fi
  sleep 2
done
if [[ "$ready" != true ]]; then
  echo "LOCAL_HEALTH_BLOCKED: containers started, but local health did not pass." >&2
  exit 1
fi
node "$project_dir/scripts/proof-receipt.mjs" --platform "$(uname -s | tr '[:upper:]' '[:lower:]')" --step local_health --result pass
echo "LOCAL_HEALTH_PASS: ${SERVER_URL:-http://localhost:${VDAI_PORT:-3000}}"
echo "This proves local health only, not shared or production access."
echo "Next: create the first workspace admin, then follow SETUP.md to install the VDAI app."
