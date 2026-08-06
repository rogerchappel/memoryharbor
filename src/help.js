export function helpText() {
  return `MemoryHarbor — dock local agent traces into searchable, citable memory packs.

Usage:
  memoryharbor inspect <input-dir> --output <output-dir> [--query "term"]
  memoryharbor search <manifest.json> --query "term" [--json]
  memoryharbor --version
  memoryharbor --help

Commands:
  inspect   Ingest exactly one input directory and write a memory pack.
  search    Search exactly one existing memory-manifest.json file.

Options:
  -o, --output <output-dir>       Directory for the generated memory pack.
  -q, --query <term>              Search term for inspect or search.
  --forget-after-days <days>      Positive retention duration in days (default: 90).

Safety:
  Local files only. No network calls. Redacts common emails/tokens by default.
  Output inside the input directory is excluded from inspection.
`;
}
