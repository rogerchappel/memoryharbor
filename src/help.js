export function helpText() {
  return `MemoryHarbor — dock local agent traces into searchable, citable memory packs.

Usage:
  memoryharbor inspect <input-dir> --output <output-dir> [--query "term"] [--no-redact]
  memoryharbor search <manifest.json> --query "term" [--json]
  memoryharbor --version
  memoryharbor --help

Commands:
  inspect   Ingest exactly one input directory and write a memory pack.
  search    Search exactly one existing memory-manifest.json file.

Options:
  Each option may be specified at most once; short and long aliases are equivalent.
  -o, --output <output-dir>       Directory for the generated memory pack.
  -q, --query <term>              Search term for inspect or search.
  --forget-after-days <days>      Positive retention duration in days (default: 90).
  --no-redact                     Inspect only: write source content without redaction.
  --json                          Search only: print results as JSON.

Safety:
  Local files only. No network calls. Redacts common emails/tokens by default.
  --no-redact may write sensitive source content to the generated pack.
  Output inside the input directory is excluded from inspection.
`;
}
