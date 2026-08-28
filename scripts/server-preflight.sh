#!/usr/bin/env bash
set -euo pipefail
output="${1:-/tmp/vdai-server-preflight.json}"; tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
cpu="$(getconf _NPROCESSORS_ONLN 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 0)"
if command -v free >/dev/null 2>&1; then memory="$(free -m|awk '/^Mem:/{print $2}')"; swap="$(free -m|awk '/^Swap:/{print $2}')"; else memory="$(( $(sysctl -n hw.memsize 2>/dev/null || echo 0)/1024/1024 ))"; swap=0; fi
disk="$(df -Pm .|awk 'NR==2{print $4}')"; docker=false; compose=false
command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && docker=true
command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && compose=true
containers='[]'
if [[ "$docker" == true ]]; then docker ps -a --format '{{json .}}' >"$tmp" || true; containers="$(node -e "const f=require('fs'),r=f.readFileSync(process.argv[1],'utf8').trim().split(/\\n/).filter(Boolean).map(JSON.parse);process.stdout.write(JSON.stringify(r.map(x=>({name:x.Names||'',image:x.Image||'',status:x.Status||'',ports:x.Ports||'',classification:/vdai/i.test((x.Names||'')+' '+(x.Image||''))?'VDAI':/bank/i.test((x.Names||'')+' '+(x.Image||''))?'Bank OS':'unknown'}))))" "$tmp")"; fi
node - "$output" "$(uname -s)" "$cpu" "$memory" "$swap" "$disk" "$docker" "$compose" "$containers" <<'NODE'
const fs=require('fs');const [o,os,cpu,mem,swap,disk,docker,compose,containers]=process.argv.slice(2);const checks={cpu:+cpu>=2,memory:+mem>=4096,swap:+swap>=2048,disk:+disk>=40960,docker:docker==='true',compose:compose==='true'};const r={schema:'vdai.server-preflight.v1',mode:'read_only',createdAt:new Date().toISOString(),host:{os,cpu:+cpu,memoryMb:+mem,swapMb:+swap,diskFreeMb:+disk},checks,ready:Object.values(checks).every(Boolean),containers:JSON.parse(containers),cleanupPolicy:'unknown_is_never_delete; snapshot_and_exact_owner_approval_required',stoppedBefore:['root','resize','dns','deploy','invite','delete'],next:'review classifications and resource gaps with the owner'};fs.writeFileSync(o,JSON.stringify(r,null,2)+'\n',{mode:0o600});console.log(o);if(!r.ready)process.exitCode=3;
NODE
