import test from 'node:test';
import assert from 'node:assert/strict';
import { redactText } from '../src/redact.js';

test('redacts emails and tokens deterministically', () => {
  const result = redactText('email dev@example.com token ghp_abcdefghijklmnopqrstuvwxyz');
  assert.equal(result.text, 'email [redacted:email] token [redacted:token]');
  assert.deepEqual(result.redactions, [{ kind: 'email', count: 1 }, { kind: 'token', count: 1 }]);
});
