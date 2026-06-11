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

```bash
npm install -g memoryharbor
```

From a checkout:

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

## Input shapes

JSON transcripts can use `messages` with `role`, `content`, `createdAt`, and `toolCalls` fields. JSONL files are one message per line. Markdown/text files split on blank lines and infer a role from prefixes like `user:` or `assistant:`.

## Safety boundaries

MemoryHarbor is deliberately quiet and local:

- No network calls.
- No telemetry.
- No credential scraping.
- No hidden publishing.
- No background daemon.
- Redaction is enabled by default; use `--no-redact` only for trusted fixtures.

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
Run `npm run package:smoke` or `npm pack --dry-run` before publishing to
confirm those files are still present in the tarball.

## License

MIT
