import test from 'node:test';
import assert from 'node:assert/strict';
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
