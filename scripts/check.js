#!/usr/bin/env node
import { promises as fs } from 'node:fs';

const required = ['README.md', 'SECURITY.md', 'CONTRIBUTING.md', 'docs/PRD.md', 'docs/TASKS.md', 'docs/ORCHESTRATION.md', 'docs/orchestration.json', 'src/cli.js'];
const missing = [];
for (const file of required) {
  try { await fs.access(file); } catch { missing.push(file); }
}
if (missing.length) {
  console.error(`Missing required files: ${missing.join(', ')}`);
  process.exit(1);
}
const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
if (!pkg.bin?.memoryharbor) throw new Error('package.json must expose memoryharbor bin');
console.log('check ok');
