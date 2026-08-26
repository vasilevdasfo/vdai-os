#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_dir="$project_dir/backups"
mkdir -p "$backup_dir"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output_file="$backup_dir/vdai-$timestamp.sql"

docker compose --project-directory "$project_dir" exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "$output_file"
shasum -a 256 "$output_file" > "$output_file.sha256"
echo "$output_file"
