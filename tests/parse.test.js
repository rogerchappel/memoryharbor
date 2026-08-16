import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseFile } from '../src/parse.js';
import { parseJsonTranscript, parseJsonlTranscript } from '../src/parser-json.js';

const execFileAsync = promisify(execFile);

test('parses fixture messages and tool calls', async () => {
  const parsed = await parseFile(new URL('../fixtures/sample/chat.json', import.meta.url).pathname, { redact: true });
  assert.equal(parsed.messages.length, 2);
  assert.equal(parsed.messages[0].role, 'user');
  assert.equal(parsed.messages[1].toolCalls.length, 1);
  assert.match(parsed.messages[0].content, /\[redacted:email\]/);
});

test('JSON transcripts require a messages array while allowing an empty array', () => {
  assert.deepEqual(parseJsonTranscript('{"messages":[]}', 'empty.json'), []);
  for (const text of ['{}', '{"messages":null}', '{"messages":{}}']) {
    assert.throws(() => parseJsonTranscript(text, 'invalid.json'), {
      message: 'JSON transcript in invalid.json must contain a messages array'
    });
  }
});

test('JSONL blank lines preserve physical source indices and malformed line locations', () => {
  const messages = parseJsonlTranscript('{"role":"user","content":"first"}\n  \n{"role":"assistant","content":"third"}\n', 'chat.jsonl');
  assert.deepEqual(messages.map(({ id, index }) => ({ id, index })), [
    { id: 'chat.jsonl#1', index: 0 },
    { id: 'chat.jsonl#3', index: 2 }
  ]);
  assert.throws(() => parseJsonlTranscript('{"role":"user"}\n\nnot-json\n', 'broken.jsonl'), {
    message: 'Invalid JSONL on line 3 in broken.jsonl'
  });
});

test('CLI help exits cleanly with usage text', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['src/cli.js', '--help'], { cwd: process.cwd() });

  assert.match(stdout, /Usage:/);
  assert.match(stdout, /memoryharbor inspect/);
});
