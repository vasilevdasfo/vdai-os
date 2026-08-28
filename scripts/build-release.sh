#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; version="$(node -p "require('$root/package.json').version")"; dist="$root/dist/release"; mkdir -p "$dist"; archive="$dist/vdai-os-v${version}.tar.gz"; git -C "$root" archive --format=tar.gz --prefix="vdai-os-v${version}/" -o "$archive" HEAD; shasum -a 256 "$archive" > "$dist/SHA256SUMS"; cp "$root/release/manifest.json" "$dist/manifest.json"; echo "$archive"
