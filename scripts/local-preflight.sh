#!/usr/bin/env bash
set -euo pipefail
failures=0
for name in git docker curl openssl; do
  if command -v "$name" >/dev/null 2>&1; then echo "$name=ready"; else echo "$name=missing"; failures=$((failures+1)); fi
done
if command -v docker >/dev/null 2>&1; then
  docker compose version >/dev/null 2>&1 || { echo "docker_compose=missing"; failures=$((failures+1)); }
  docker info >/dev/null 2>&1 || { echo "docker_engine=not_running"; failures=$((failures+1)); }
fi
port="${VDAI_PORT:-3000}"
if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
  if docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -E "^vdai-os-.*(127\\.0\\.0\\.1|0\\.0\\.0\\.0):${port}->" >/dev/null; then
    echo "port_${port}=existing_vdai"
  else
    echo "port_${port}=occupied_by_other_process"
    failures=$((failures+1))
  fi
else
  echo "port_${port}=available"
fi
if (( failures > 0 )); then echo "PREFLIGHT_BLOCKED=$failures"; exit 1; fi
echo "PREFLIGHT_READY"
