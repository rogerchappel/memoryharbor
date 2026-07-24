import { promises as fs } from 'node:fs';
import path from 'node:path';
import { supportedInputExtensions } from './schema.js';

export async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function walkFiles(root, { excludedDirectories = [], excludedFiles = [] } = {}) {
  const out = [];
  const directoryExclusions = new Set(excludedDirectories.map((entry) => path.resolve(entry)));
  const fileExclusions = new Set(excludedFiles.map((entry) => path.resolve(entry)));
  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory() && !directoryExclusions.has(path.resolve(full))) await visit(full);
      else if (
        entry.isFile()
        && !fileExclusions.has(path.resolve(full))
        && supportedInputExtensions.has(path.extname(entry.name).toLowerCase())
      ) out.push(full);
    }
  }
  await visit(root);
  return out;
}
