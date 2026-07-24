export function helpText() {
  return `MemoryHarbor — dock local agent traces into searchable, citable memory packs.

Usage:
  memoryharbor inspect <input-dir> --output <output-dir> [--query "term"]
  memoryharbor search <manifest.json> --query "term" [--json]
  memoryharbor --version
  memoryharbor --help

Commands:
  inspect   Ingest local JSON/JSONL/Markdown/text traces and write a memory pack.
  search    Search an existing memory-manifest.json file.

Safety:
  Local files only. No network calls. Redacts common emails/tokens by default.
  Output inside the input directory is excluded from inspection.
`;
}
