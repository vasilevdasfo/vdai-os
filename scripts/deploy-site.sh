#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test "${VDAI_SITE_HOST:-}" = "os.vdai.me" || { echo 'Set VDAI_SITE_HOST=os.vdai.me'; exit 2; }
pnpm site:build
vercel deploy .build/site --prod --yes
echo 'Rollback: vercel rollback <previous-production-deployment-url>'
