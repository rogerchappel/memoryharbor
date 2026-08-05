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
const readme = await fs.readFile('README.md', 'utf8');
const releasebox = JSON.parse(await fs.readFile('releasebox.config.json', 'utf8'));
if (releasebox.release?.publishNpm !== false) {
  throw new Error('releasebox must keep npm registry publishing disabled');
}
if (!readme.includes('git clone https://github.com/rogerchappel/memoryharbor.git') ||
    !readme.includes('npm install --global ./memoryharbor')) {
  throw new Error('README must provide the executable GitHub checkout install path');
}
if (!readme.includes('github.com/rogerchappel/memoryharbor/releases')) {
  throw new Error('README must identify GitHub releases as the packaged distribution path');
}
if (/npm (?:install|i) (?:--global|-g) memoryharbor(?:\s|$)/m.test(readme)) {
  throw new Error('README must not direct users to the unpublished npm registry package');
}
console.log('check ok');
