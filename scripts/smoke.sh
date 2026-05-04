#!/usr/bin/env bash
set -euo pipefail
rm -rf .tmp/smoke
node src/cli.js inspect fixtures/sample --output .tmp/smoke --query citations > .tmp/smoke-output.json
test -f .tmp/smoke/memory-manifest.json
test -f .tmp/smoke/memory-report.md
node src/cli.js search .tmp/smoke/memory-manifest.json --query release --json > .tmp/smoke-search.json
grep -q 'memory-manifest.json' .tmp/smoke-output.json
grep -q 'release' .tmp/smoke-search.json
printf 'smoke ok\n'
