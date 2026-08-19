# MemoryHarbor ⚓️

**Dock your agent traces before they drift away.**

MemoryHarbor is a tiny local-first CLI/library that turns chats, tool logs, and handoff notes into searchable memory packs with stable citations and an explicit forgetting policy.

It is inspired by the broader “agent memory” problem space and acknowledges `openamnesia` as an adjacent signal, but this implementation is original, deterministic, JavaScript-based, and scoped to local files only.

## What it does

- Ingests `.json`, `.jsonl`, `.md`, `.txt`, and `.log` fixtures/directories.
- Normalizes messages, roles, timestamps, and tool calls.
- Redacts common emails, tokens, and env-style secrets by default.
- Writes a `memory-manifest.json` for tools and agents.
- Writes a `memory-report.md` for humans.
- Searches generated manifests with citations.
- Makes forgetting boring: delete the output directory and the generated pack is gone.

## Install

MemoryHarbor supports Node.js 20 and later. The full release-readiness suite is
tested on Node.js 20 (the minimum supported runtime) and Node.js 22 (the current
release runtime).

```bash
git clone https://github.com/rogerchappel/memoryharbor.git
npm install --global ./memoryharbor
```

MemoryHarbor is not published to the npm registry. Packaged versions are
distributed as tarballs attached to [GitHub releases](https://github.com/rogerchappel/memoryharbor/releases),
and can also be installed by passing a downloaded `.tgz` file to
`npm install --global`.

To develop from the checkout instead:

```bash
npm install
npm test
npm run smoke
```

## Quickstart

```bash
memoryharbor inspect ./fixtures/sample --output ./out --query citations
memoryharbor search ./out/memory-manifest.json --query release --json
```

`--output` and `--query` require values. Use `--forget-after-days <days>` on
`inspect` to set a positive retention duration (the default is 90 days). Zero,
negative, non-numeric, and missing durations are rejected before any output is
written. Each option may be specified at most once; short and long forms such
as `-o` and `--output` count as the same option. Each command accepts exactly
one positional argument: the input
directory for `inspect`, or the manifest file for `search`. Extra positional
arguments and command-specific options used with the wrong command are rejected
before files are read or an output pack is created. `inspect` accepts `--output`,
`--query`, `--forget-after-days`, and `--no-redact`; `search` accepts `--query`
and `--json`.

Example output summary:

```json
{
  "ok": true,
  "manifestPath": "./out/memory-manifest.json",
  "reportPath": "./out/memory-report.md",
  "counters": { "files": 3, "messages": 6, "toolCalls": 2 }
}
```

## Library use

```js
import { inspect, searchManifest } from 'memoryharbor';

const { manifest } = await inspect('./fixtures/sample', './out');
const hits = searchManifest(manifest, 'forgetting policy');
console.log(hits[0].citation);
```

The output directory may be the input directory or live beneath it. MemoryHarbor
automatically excludes its generated manifest and report (or the nested output
directory) so repeated inspections do not re-ingest prior output.

## Input shapes

JSON transcripts must be an object with a `messages` array; an empty array is valid. Each message can use `role`, `content`, `createdAt`, and `toolCalls` fields. A missing or non-array `messages` value is rejected with the source filename.

JSONL files are one message per line. Blank lines are skipped, while message IDs, indices, citations, and parse errors retain physical line positions (for example, a message after one blank line is `#message-3`). Markdown/text files split on blank lines and infer a role from prefixes like `user:` or `assistant:`.
## CLI Help Smoke

Confirm the packaged command starts and prints its help text before relying on a release tarball or downstream automation:

```bash
node ./src/cli.js --help
node ./src/cli.js --version
```

Both commands should exit successfully without reading project files or contacting external services.

## Safety boundaries

MemoryHarbor is deliberately quiet and local:

- No network calls.
- No telemetry.
- No credential scraping.
- No hidden publishing.
- No background daemon.
- Redaction is enabled by default. The inspect-only `--no-redact` option disables
  email and token redaction, so sensitive source content may be copied into the
  generated manifest and report. Use it only with trusted fixtures and outputs.

## Validation

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
node src/cli.js inspect fixtures/sample --output .tmp/manual --query citations
```

## Project docs

- [PRD](docs/PRD.md)
- [Tasks](docs/TASKS.md)
- [Orchestration](docs/ORCHESTRATION.md)
- [Machine-readable orchestration](docs/orchestration.json)
- [Security](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## Package contents

The npm package allowlist includes the runtime files plus the public support
documents needed for release review: `README.md`, `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
Run `npm run package:smoke` before publishing to confirm those files are still
present and that the packed CLI installs and starts from an isolated prefix.

## License

MIT

## Verification

Run the release-readiness checks that match this package before publishing or opening a release PR.

- `npm run release:check` - run the full release gate
