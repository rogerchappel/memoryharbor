#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const [pack] = JSON.parse(result.stdout);
const packedFiles = new Set(pack.files.map((file) => file.path));
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'docs/PRD.md',
  'docs/TASKS.md',
  'docs/ORCHESTRATION.md',
  'docs/orchestration.json',
  'fixtures/sample/chat.json',
  'src/cli.js',
  'src/index.js',
];

const missing = requiredFiles.filter((file) => !packedFiles.has(file));
if (missing.length > 0) {
  console.error(`Package smoke failed; missing from npm pack: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Package smoke passed with ${pack.files.length} files.`);
