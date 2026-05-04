# MemoryHarbor Orchestration

MemoryHarbor is intentionally small enough for one agent or maintainer to ship safely.
Use this document to keep future work reviewable and traceable.

## Ownership lanes

1. **Core ingest** — parsers, normalization, citations, redaction, and manifest shape.
2. **CLI UX** — command help, smoke tests, examples, and error messages.
3. **Docs and trust** — README, security model, attribution, and contribution flow.
4. **Release hygiene** — package metadata, CI, validation scripts, and branch protection.

## Landing rules

- Keep changes atomic and covered by fixture-backed tests when behavior changes.
- Link PRs to a task from `docs/TASKS.md` before review.
- Do not add network calls without a PRD update and a prominent README safety note.
- Do not collect credentials, hidden telemetry, or private machine state.
- Preserve deterministic fixture behavior so agents can trust diffs.

## Local validation

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
node src/cli.js inspect fixtures/sample --output .tmp/manual --query citations
```

## Release gates

A release candidate should include:

- Green local validation.
- Updated changelog and README examples.
- A real CLI smoke against `fixtures/sample`.
- Review of generated `memory-manifest.json` for accidental sensitive content.
