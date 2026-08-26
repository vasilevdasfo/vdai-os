#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="$project_dir/.env"

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
echo "Twenty is starting at ${SERVER_URL:-http://localhost:${VDAI_PORT:-3000}}"
echo "Next: create the first workspace admin, then follow SETUP.md to install the VDAI app."
