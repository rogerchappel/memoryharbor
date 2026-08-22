import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inspect } from '../src/inspect.js';
import { searchManifest } from '../src/search.js';

const fixture = new URL('../fixtures/sample', import.meta.url).pathname;

test('inspect builds a cited local-first manifest', async (t) => {
  const output = new URL(`../.tmp/test-${Date.now()}`, import.meta.url).pathname;
  t.after(async () => { await import('node:fs/promises').then((fs) => fs.rm(output, { recursive: true, force: true })); });
  const { manifest } = await inspect(fixture, output, { generatedAt: '2026-05-04T00:00:00.000Z' });
  assert.equal(manifest.safety.localOnly, true);
  assert.equal(manifest.counters.files, 3);
  assert.equal(manifest.counters.messages, 6);
  assert.ok(manifest.messages.every((message) => message.citation));
  assert.ok(searchManifest(manifest, 'citations').length >= 1);
});

test('search rejects malformed manifests with field-specific diagnostics', () => {
  const invalid = [
    [{}, 'manifest.messages must be an array'],
    [{ messages: {} }, 'manifest.messages must be an array'],
    [{ messages: [null] }, 'manifest.messages[0] must be an object'],
    [{ messages: [{}] }, 'manifest.messages[0].citation must be a non-empty string'],
    [{ messages: [{ citation: 'chat.json#message-1' }] }, 'manifest.messages[0].role must be a non-empty string'],
    [{ messages: [{ citation: 'chat.json#message-1', role: 'user' }] }, 'manifest.messages[0].content must be a string']
  ];

  for (const [manifest, message] of invalid) {
    assert.throws(() => searchManifest(manifest, 'hello'), { message });
  }
});

test('inspect does not re-ingest a nested output directory', async (t) => {
  const input = await fs.mkdtemp(path.join(os.tmpdir(), 'memoryharbor-nested-output-'));
  const output = path.join(input, 'generated', 'memory-pack');
  t.after(() => fs.rm(input, { recursive: true, force: true }));
  await fs.writeFile(path.join(input, 'note.md'), 'user: Keep this citation stable.\n', 'utf8');

  const first = await inspect(input, output, { generatedAt: '2026-05-04T00:00:00.000Z' });
  const second = await inspect(input, output, { generatedAt: '2026-05-05T00:00:00.000Z' });

  assert.deepEqual(second.manifest.counters, first.manifest.counters);
  assert.deepEqual(
    second.manifest.messages.map((message) => message.citation),
    first.manifest.messages.map((message) => message.citation)
  );
  assert.deepEqual(second.manifest.files.map((file) => file.path), ['note.md']);
});

test('inspect does not re-ingest generated files when output equals input', async (t) => {
  const input = await fs.mkdtemp(path.join(os.tmpdir(), 'memoryharbor-equal-output-'));
  t.after(() => fs.rm(input, { recursive: true, force: true }));
  await fs.writeFile(path.join(input, 'note.md'), 'assistant: Keep this source visible.\n', 'utf8');

  const first = await inspect(input, input, { generatedAt: '2026-05-04T00:00:00.000Z' });
  const second = await inspect(input, input, { generatedAt: '2026-05-05T00:00:00.000Z' });

  assert.deepEqual(second.manifest.counters, first.manifest.counters);
  assert.deepEqual(
    second.manifest.messages.map((message) => message.citation),
    first.manifest.messages.map((message) => message.citation)
  );
  assert.deepEqual(second.manifest.files.map((file) => file.path), ['note.md']);
});
