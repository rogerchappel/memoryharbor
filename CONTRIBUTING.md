# Contributing

Thanks for helping keep the harbor useful and safe.

## Development setup

```bash
git clone https://github.com/rogerchappel/memoryharbor.git
cd memoryharbor
npm install
npm test
npm run smoke
```

## Pull request expectations

- Link the PR to an item in `docs/TASKS.md` or add a new task in the same PR.
- Keep changes small enough to review.
- Add or update fixture-backed tests for behavior changes.
- Run the validation commands listed below.
- Call out any change to privacy, redaction, network behavior, or generated output shape.

## Validation

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Fixture guidance

Use synthetic transcripts only. Do not commit real chat logs, credentials, emails, customer names, or private repository output. If a bug needs a sensitive shape, reduce it to the smallest fake fixture that reproduces the issue.

## Design principles

- Local-first beats clever.
- Deterministic output beats magic.
- Citations beat vibes.
- Forgetting must be understandable.
- Agents and humans should use the same CLI surface.
