import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFile } from '../src/parse.js';

test('parses fixture messages and tool calls', async () => {
  const parsed = await parseFile(new URL('../fixtures/sample/chat.json', import.meta.url).pathname, { redact: true });
  assert.equal(parsed.messages.length, 2);
  assert.equal(parsed.messages[0].role, 'user');
  assert.equal(parsed.messages[1].toolCalls.length, 1);
  assert.match(parsed.messages[0].content, /\[redacted:email\]/);
});
