import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('cli prints package version', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--version'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${pkg.version}\n`);
  assert.equal(result.stderr, '');
});

test('cli help documents version flag', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /memoryharbor --version/);
});

test('invalid valued options fail without creating an output pack', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-invalid-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const args of [
    ['inspect', 'fixtures/sample', '--output'],
    ['inspect', 'fixtures/sample', '--output', '--json'],
    ['inspect', 'fixtures/sample', '--forget-after-days', '0'],
    ['inspect', 'fixtures/sample', '--forget-after-days', '-1'],
    ['inspect', 'fixtures/sample', '--forget-after-days', 'NaN']
  ]) {
    const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, ...args], {
      cwd,
      encoding: 'utf8'
    });
    assert.equal(result.status, 1, args.join(' '));
    assert.match(result.stderr, /^memoryharbor: /);
    assert.equal(existsSync(path.join(cwd, 'memoryharbor-out')), false);
  }
});

test('surplus positional arguments fail before command side effects', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-positional-'));
  const output = path.join(cwd, 'pack');
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const [command, args] of [
    ['inspect', [new URL('../fixtures/sample', import.meta.url).pathname, 'unexpected-extra', '--output', output]],
    ['search', [path.join(cwd, 'missing-manifest.json'), 'unexpected-extra', '--query', 'release']]
  ]) {
    const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, command, ...args], {
      cwd,
      encoding: 'utf8'
    });
    assert.equal(result.status, 1, command);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `memoryharbor: ${command} accepts exactly one positional argument\n`);
    assert.equal(existsSync(output), false);
  }
});

test('inapplicable options fail before command side effects', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-options-'));
  const output = path.join(cwd, 'pack');
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const [command, args, option] of [
    ['inspect', [new URL('../fixtures/sample', import.meta.url).pathname, '--json', '--output', output], '--json'],
    ['search', [path.join(cwd, 'missing-manifest.json'), '--query', 'release', '--output', output], '--output'],
    ['search', [path.join(cwd, 'missing-manifest.json'), '--query', 'release', '--forget-after-days', '30'], '--forget-after-days'],
    ['search', [path.join(cwd, 'missing-manifest.json'), '--query', 'release', '--no-redact'], '--no-redact']
  ]) {
    const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, command, ...args], {
      cwd,
      encoding: 'utf8'
    });
    assert.equal(result.status, 1, `${command} ${option}`);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `memoryharbor: ${option} is not valid for ${command}\n`);
    assert.equal(existsSync(output), false);
  }
});

test('valid retention is written to the manifest', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-valid-'));
  const output = path.join(cwd, 'pack');
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = spawnSync(process.execPath, [
    new URL('../src/cli.js', import.meta.url).pathname,
    'inspect',
    new URL('../fixtures/sample', import.meta.url).pathname,
    '--output',
    output,
    '--forget-after-days',
    '30'
  ], { cwd, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(await readFile(path.join(output, 'memory-manifest.json'), 'utf8'));
  assert.equal(manifest.forgettingPolicy.forgetAfterDays, 30);
});
