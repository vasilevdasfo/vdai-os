#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" != "--confirm" || -z "${2:-}" ]]; then
  echo "Usage: scripts/restore.sh --confirm backups/<file>.sql" >&2
  exit 2
fi

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
input_file="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
case "$input_file" in
  "$project_dir"/backups/*.sql) ;;
  *) echo "Restore accepts only a .sql file from this repository's backups directory." >&2; exit 2 ;;
esac
[[ -f "$input_file" ]] || { echo "Backup not found." >&2; exit 2; }

docker compose --project-directory "$project_dir" exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"' < "$input_file"
echo "Restore completed. Restart the server and verify the workspace before use."
