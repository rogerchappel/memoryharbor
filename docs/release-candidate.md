# Release candidate readiness

Status: **READY**

Generated: 2026-05-05 21:27:57 UTC

## Scope

Release-candidate readiness pass for `rogerchappel/memoryharbor` against `origin/main`.

## Local verification

- npm ci:skipped(no package-lock)
- release:check:pass
- validate.sh:pass
- releasebox:pass

## Blockers

- None found in local readiness gates.

## ReleaseBox check / command log

```text
\n===== npm run release:check =====
+ npm --prefix /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness run release:check

> memoryharbor@0.1.0 release:check
> npm test && npm run check && npm run build && npm run smoke && npm run package:smoke


> memoryharbor@0.1.0 test
> node --test

✔ inspect builds a cited local-first manifest (11.940542ms)
✔ parses fixture messages and tool calls (3.037291ms)
✔ redacts emails and tokens deterministically (1.326042ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 84.212417

> memoryharbor@0.1.0 check
> node scripts/check.js

check ok

> memoryharbor@0.1.0 build
> node scripts/build.js

build ok

> memoryharbor@0.1.0 smoke
> bash scripts/smoke.sh

smoke ok

> memoryharbor@0.1.0 package:smoke
> npm pack --dry-run

npm notice
npm notice package: memoryharbor@0.1.0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 2.6kB README.md
npm notice 496B fixtures/sample/chat.json
npm notice 156B fixtures/sample/notes.md
npm notice 292B fixtures/sample/tool-log.jsonl
npm notice 1.1kB package.json
npm notice 851B src/args.js
npm notice 373B src/citations.js
npm notice 1.8kB src/cli.js
npm notice 361B src/errors.js
npm notice 849B src/forget.js
npm notice 1.1kB src/fs.js
npm notice 529B src/help.js
npm notice 314B src/index.js
npm notice 928B src/inspect.js
npm notice 1.6kB src/manifest.js
npm notice 758B src/parse.js
npm notice 1.4kB src/parser-json.js
npm notice 607B src/parser-text.js
npm notice 1.2kB src/redact.js
npm notice 1.1kB src/report.js
npm notice 352B src/schema.js
npm notice 751B src/search.js
npm notice 761B src/tokenize.js
npm notice Tarball Details
npm notice name: memoryharbor
npm notice version: 0.1.0
npm notice filename: memoryharbor-0.1.0.tgz
npm notice package size: 8.1 kB
npm notice unpacked size: 21.5 kB
npm notice shasum: f7b878fc79c84b2d9c26cf40e3fd310447456c16
npm notice integrity: sha512-rHnrxlPCitKo9[...]J0+cVp4JXFGkw==
npm notice total files: 24
npm notice
memoryharbor-0.1.0.tgz
EXIT_CODE=0
\n===== bash scripts/validate.sh =====
+ bash -lc cd '/Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness' && bash scripts/validate.sh
Checking memoryharbor required files...
PASS: required file exists: README.md
PASS: required file exists: AGENTS.md
PASS: required file exists: CONTRIBUTING.md
PASS: required file exists: SECURITY.md
PASS: required file exists: .github/pull_request_template.md
PASS: required file exists: scripts/validate.sh

Checking memoryharbor required directories...
PASS: required directory exists: .github
PASS: required directory exists: docs
PASS: required directory exists: scripts

Running local project checks where present...
NOTE: using package manager: pnpm

> memoryharbor@0.1.0 check /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness
> node scripts/check.js

check ok
PASS: package script: check

> memoryharbor@0.1.0 test /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness
> node --test

✔ inspect builds a cited local-first manifest (12.118917ms)
✔ parses fixture messages and tool calls (3.212583ms)
✔ redacts emails and tokens deterministically (1.3755ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 91.811834
PASS: package script: test

> memoryharbor@0.1.0 build /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness
> node scripts/build.js

build ok
PASS: package script: build

> memoryharbor@0.1.0 release:check /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness
> npm test && npm run check && npm run build && npm run smoke && npm run package:smoke


> memoryharbor@0.1.0 test
> node --test

✔ inspect builds a cited local-first manifest (14.457125ms)
✔ parses fixture messages and tool calls (3.673333ms)
✔ redacts emails and tokens deterministically (1.498084ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 105.797333

> memoryharbor@0.1.0 check
> node scripts/check.js

check ok

> memoryharbor@0.1.0 build
> node scripts/build.js

build ok

> memoryharbor@0.1.0 smoke
> bash scripts/smoke.sh

smoke ok

> memoryharbor@0.1.0 package:smoke
> npm pack --dry-run

npm notice
npm notice package: memoryharbor@0.1.0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 2.6kB README.md
npm notice 496B fixtures/sample/chat.json
npm notice 156B fixtures/sample/notes.md
npm notice 292B fixtures/sample/tool-log.jsonl
npm notice 1.1kB package.json
npm notice 851B src/args.js
npm notice 373B src/citations.js
npm notice 1.8kB src/cli.js
npm notice 361B src/errors.js
npm notice 849B src/forget.js
npm notice 1.1kB src/fs.js
npm notice 529B src/help.js
npm notice 314B src/index.js
npm notice 928B src/inspect.js
npm notice 1.6kB src/manifest.js
npm notice 758B src/parse.js
npm notice 1.4kB src/parser-json.js
npm notice 607B src/parser-text.js
npm notice 1.2kB src/redact.js
npm notice 1.1kB src/report.js
npm notice 352B src/schema.js
npm notice 751B src/search.js
npm notice 761B src/tokenize.js
npm notice Tarball Details
npm notice name: memoryharbor
npm notice version: 0.1.0
npm notice filename: memoryharbor-0.1.0.tgz
npm notice package size: 8.1 kB
npm notice unpacked size: 21.5 kB
npm notice shasum: f7b878fc79c84b2d9c26cf40e3fd310447456c16
npm notice integrity: sha512-rHnrxlPCitKo9[...]J0+cVp4JXFGkw==
npm notice total files: 24
npm notice
memoryharbor-0.1.0.tgz
PASS: package script: release:check
NOTE: agent-qc not installed; skipping optional agent check

Validation passed.
EXIT_CODE=0
\n===== releasebox check =====
+ node /Users/roger/Developer/my-opensource/releasebox/bin/releasebox.js check /Users/roger/Developer/my-opensource/_worktrees/memoryharbor-release-candidate-readiness
✅ releasebox config: node-cli
✅ ci workflow: .github/workflows/ci.yml
✅ release dry run workflow: .github/workflows/release-dry-run.yml
✅ task breakdown: docs/TASKS.md
✅ orchestration plan: docs/ORCHESTRATION.md
✅ dependabot config: .github/dependabot.yml
✅ npm test script: node --test
✅ build script: node scripts/build.js
✅ smoke script: bash scripts/smoke.sh
✅ bin entry: {"memoryharbor":"./src/cli.js"}
EXIT_CODE=0
```
