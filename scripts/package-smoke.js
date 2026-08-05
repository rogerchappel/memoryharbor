#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const workspace = mkdtempSync(join(tmpdir(), 'memoryharbor-package-smoke-'));

try {
  const result = spawnSync('npm', ['pack', '--json', '--pack-destination', workspace], {
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

  const prefix = join(workspace, 'prefix');
  const tarball = join(workspace, pack.filename);
  const install = spawnSync('npm', ['install', '--global', '--prefix', prefix, tarball], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (install.status !== 0) {
    process.stderr.write(install.stderr);
    process.exit(install.status ?? 1);
  }

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const cli = join(prefix, 'bin', 'memoryharbor');
  for (const argument of ['--help', '--version']) {
    const probe = spawnSync(cli, [argument], { encoding: 'utf8' });
    if (probe.status !== 0) {
      process.stderr.write(probe.stderr);
      process.exit(probe.status ?? 1);
    }
  }

  console.log(`Package smoke passed for ${packageJson.name}@${packageJson.version} with ${pack.files.length} files.`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
