#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

await fs.rm('dist', { recursive: true, force: true });
await fs.mkdir('dist', { recursive: true });
await fs.cp('src', 'dist', { recursive: true });
await fs.writeFile(path.join('dist', 'README.txt'), 'MemoryHarbor distribution files are copied from src for package smoke checks.\n');
console.log('build ok');
