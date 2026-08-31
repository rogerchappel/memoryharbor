#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import { inspect } from './inspect.js';
import { searchManifest } from './search.js';
import { parseArgs } from './args.js';
import { helpText } from './help.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === '--version' || command === '-v' || options.version) {
    process.stdout.write(`${version}\n`);
    return;
  }
  if (options.help || command === 'help' || command === '--help') {
    process.stdout.write(helpText());
    return;
  }
  if (command === 'inspect') {
    const input = options._[0];
    if (!input) throw new Error('inspect requires <input-dir>');
    const { manifest, outputDir } = await inspect(input, options.output, options);
    const payload = {
      ok: true,
      outputDir,
      manifestPath: `${outputDir}/memory-manifest.json`,
      reportPath: `${outputDir}/memory-report.md`,
      counters: manifest.counters,
      ...(options.query ? { query: options.query, hits: searchManifest(manifest, options.query) } : {})
    };
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }
  if (command === 'search') {
    const manifestPath = options._[0];
    if (!manifestPath) throw new Error('search requires <manifest.json>');
    if (!options.query) throw new Error('search requires --query');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const hits = searchManifest(manifest, options.query);
    if (options.json) process.stdout.write(`${JSON.stringify({ query: options.query, hits }, null, 2)}\n`);
    else process.stdout.write(hits.map((hit) => `${hit.score}\t${hit.citation}\t${hit.content}`).join('\n') + '\n');
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  process.stderr.write(`memoryharbor: ${error.message}\n`);
  process.exitCode = 1;
});
