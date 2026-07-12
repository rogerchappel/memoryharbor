import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseFile } from '../src/parse.js';

const execFileAsync = promisify(execFile);

test('parses fixture messages and tool calls', async () => {
  const parsed = await parseFile(new URL('../fixtures/sample/chat.json', import.meta.url).pathname, { redact: true });
  assert.equal(parsed.messages.length, 2);
  assert.equal(parsed.messages[0].role, 'user');
  assert.equal(parsed.messages[1].toolCalls.length, 1);
  assert.match(parsed.messages[0].content, /\[redacted:email\]/);
});

test('CLI help exits cleanly with usage text', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['src/cli.js', '--help'], { cwd: process.cwd() });

  assert.match(stdout, /Usage:/);
  assert.match(stdout, /memoryharbor inspect/);
});
