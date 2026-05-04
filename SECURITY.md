# Security Policy

MemoryHarbor handles local transcripts and tool logs, so treat every input as potentially sensitive.

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Local-first guarantees

The MVP does not make network calls, start background services, collect telemetry, or publish generated memory packs. The CLI reads local files and writes local JSON/Markdown to the output directory you choose.

## Redaction

Default redaction replaces common emails, token-looking strings, and env-style secrets before parsing. Redaction is a safety net, not a guarantee. Review generated packs before committing, sharing, or attaching them to issues.

## Reporting vulnerabilities

Please open a GitHub security advisory or a private issue with:

- the affected version/commit,
- reproduction steps using minimal fixtures,
- expected vs actual behavior,
- whether generated output exposed sensitive content.

Do not include real secrets in reports. Use synthetic fixtures.

## Maintainer response target

Best effort for an early OSS project:

- acknowledge within 7 days,
- patch or document mitigation within 30 days for confirmed issues,
- credit reporters when requested.
