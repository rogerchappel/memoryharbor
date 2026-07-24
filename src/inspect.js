import path from 'node:path';
import { promises as fs } from 'node:fs';
import { walkFiles, ensureDir, writeJson } from './fs.js';
import { parseFile } from './parse.js';
import { buildManifest } from './manifest.js';
import { renderMarkdownReport } from './report.js';

export async function inspect(inputDir, outputDir, options = {}) {
  const root = path.resolve(inputDir);
  const output = path.resolve(outputDir ?? path.join(process.cwd(), 'memoryharbor-out'));
  const relativeOutput = path.relative(root, output);
  const outputIsRoot = relativeOutput === '';
  const outputIsNested = !relativeOutput.startsWith(`..${path.sep}`) && relativeOutput !== '..' && !path.isAbsolute(relativeOutput);
  const files = await walkFiles(root, {
    excludedDirectories: outputIsNested && !outputIsRoot ? [output] : [],
    excludedFiles: outputIsRoot
      ? [path.join(output, 'memory-manifest.json'), path.join(output, 'memory-report.md')]
      : []
  });
  const parsedFiles = [];
  for (const filePath of files) parsedFiles.push(await parseFile(filePath, options));
  const manifest = buildManifest({ root, parsedFiles, options });
  await ensureDir(output);
  await writeJson(path.join(output, 'memory-manifest.json'), manifest);
  await fs.writeFile(path.join(output, 'memory-report.md'), renderMarkdownReport(manifest), 'utf8');
  return { manifest, outputDir: output };
}
