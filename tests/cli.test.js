import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('cli prints package version', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--version'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${pkg.version}\n`);
  assert.equal(result.stderr, '');
});

test('cli help documents version and safety-sensitive flags', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /memoryharbor --version/);
  assert.match(result.stdout, /Each option may be specified at most once/);
  assert.match(result.stdout, /--no-redact\s+Inspect only:/);
  assert.match(result.stdout, /--no-redact may write sensitive source content/);
  assert.match(result.stdout, /--json\s+Search only:/);
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

test('duplicate options fail before command side effects', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-duplicates-'));
  const output = path.join(cwd, 'pack');
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const [command, args, option] of [
    ['inspect', [new URL('../fixtures/sample', import.meta.url).pathname, '--output', output, '-o', `${output}-second`], '--output'],
    ['inspect', [new URL('../fixtures/sample', import.meta.url).pathname, '--output', output, '--no-redact', '--no-redact'], '--no-redact'],
    ['search', [path.join(cwd, 'missing-manifest.json'), '--query', 'release', '-q', 'citations'], '--query'],
    ['search', [path.join(cwd, 'missing-manifest.json'), '--query', 'release', '--json', '--json'], '--json']
  ]) {
    const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, command, ...args], {
      cwd,
      encoding: 'utf8'
    });
    assert.equal(result.status, 1, `${command} ${option}`);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `memoryharbor: ${option} may only be specified once\n`);
    assert.equal(existsSync(output), false);
    assert.equal(existsSync(`${output}-second`), false);
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

test('inspect emits one JSON envelope with and without a query', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-envelope-'));
  const cli = new URL('../src/cli.js', import.meta.url).pathname;
  const input = new URL('../fixtures/sample', import.meta.url).pathname;
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const query of [undefined, 'citations']) {
    const output = path.join(cwd, query ? 'with-query' : 'without-query');
    const args = [cli, 'inspect', input, '--output', output];
    if (query) args.push('--query', query);

    const result = spawnSync(process.execPath, args, { cwd, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');

    const payload = JSON.parse(result.stdout);
    assert.equal(payload.ok, true);
    assert.equal(payload.outputDir, output);
    assert.equal(payload.manifestPath, `${output}/memory-manifest.json`);
    assert.equal(payload.reportPath, `${output}/memory-report.md`);
    assert.deepEqual(payload.counters, {
      files: 3,
      messages: 6,
      toolCalls: 2,
      artifacts: 0,
      bytes: 944,
      redactions: 1
    });
    if (query) {
      assert.equal(payload.query, query);
      assert.ok(payload.hits.length > 0);
    } else {
      assert.equal('query' in payload, false);
      assert.equal('hits' in payload, false);
    }
  }
});

test('search validates manifests and accepts generated output', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-search-manifest-'));
  const output = path.join(cwd, 'pack');
  const cli = new URL('../src/cli.js', import.meta.url).pathname;
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const malformed = [
    ['empty object', {}, 'manifest.messages must be an array'],
    ['non-array messages', { messages: {} }, 'manifest.messages must be an array'],
    ['missing citation', { messages: [{ role: 'user', content: 'hello' }] }, 'manifest.messages[0].citation must be a non-empty string'],
    ['invalid role', { messages: [{ citation: 'chat.json#message-1', role: 7, content: 'hello' }] }, 'manifest.messages[0].role must be a non-empty string'],
    ['invalid content', { messages: [{ citation: 'chat.json#message-1', role: 'user', content: null }] }, 'manifest.messages[0].content must be a string']
  ];

  for (const [name, manifest, diagnostic] of malformed) {
    const manifestPath = path.join(cwd, `${name.replaceAll(' ', '-')}.json`);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = spawnSync(process.execPath, [cli, 'search', manifestPath, '--query', 'hello'], { encoding: 'utf8' });
    assert.equal(result.status, 1, name);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `memoryharbor: ${diagnostic}\n`);
  }

  const inspectResult = spawnSync(process.execPath, [cli, 'inspect', new URL('../fixtures/sample', import.meta.url).pathname, '--output', output], { encoding: 'utf8' });
  assert.equal(inspectResult.status, 0, inspectResult.stderr);
  const searchResult = spawnSync(process.execPath, [cli, 'search', path.join(output, 'memory-manifest.json'), '--query', 'release', '--json'], { encoding: 'utf8' });
  assert.equal(searchResult.status, 0, searchResult.stderr);
  assert.ok(JSON.parse(searchResult.stdout).hits.length > 0);
});

test('inspect rejects invalid JSON transcript shapes without writing a pack', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-json-shape-'));
  const input = path.join(cwd, 'input');
  const output = path.join(cwd, 'pack');
  await mkdir(input);
  t.after(() => rm(cwd, { recursive: true, force: true }));

  for (const [name, text] of [['missing', '{}'], ['mistyped', '{"messages":{}}']]) {
    await writeFile(path.join(input, 'chat.json'), text);
    const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, 'inspect', input, '--output', output], { encoding: 'utf8' });
    assert.equal(result.status, 1, name);
    assert.match(result.stderr, /chat\.json must contain a messages array/);
    assert.equal(existsSync(output), false);
  }
});

test('inspect accepts empty JSON and cites JSONL messages by physical line', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-jsonl-lines-'));
  const input = path.join(cwd, 'input');
  const output = path.join(cwd, 'pack');
  await mkdir(input);
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(path.join(input, 'empty.json'), '{"messages":[]}');
  await writeFile(path.join(input, 'chat.jsonl'), '{"role":"user","content":"first"}\n\n{"role":"assistant","content":"third"}\n');

  const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, 'inspect', input, '--output', output], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(await readFile(path.join(output, 'memory-manifest.json'), 'utf8'));
  assert.equal(manifest.counters.files, 2);
  assert.deepEqual(manifest.messages.map(({ id, index, citation }) => ({ id, index, citation })), [
    { id: `${path.join(input, 'chat.jsonl')}#1`, index: 0, citation: 'chat.jsonl#message-1' },
    { id: `${path.join(input, 'chat.jsonl')}#3`, index: 2, citation: 'chat.jsonl#message-3' }
  ]);
});

test('inspect reports the physical line for malformed JSONL', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'memoryharbor-cli-jsonl-invalid-'));
  const input = path.join(cwd, 'input');
  const output = path.join(cwd, 'pack');
  await mkdir(input);
  await writeFile(path.join(input, 'chat.jsonl'), '{"role":"user"}\n\nnot-json\n');
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = spawnSync(process.execPath, [new URL('../src/cli.js', import.meta.url).pathname, 'inspect', input, '--output', output], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid JSONL on line 3/);
  assert.equal(existsSync(output), false);
});
