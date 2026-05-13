import test from 'node:test';
import assert from 'node:assert/strict';
import { redactText } from '../src/redact.js';

test('redacts emails and tokens deterministically', () => {
  const result = redactText('email dev@example.com token ghp_abcdefghijklmnopqrstuvwxyz');
  assert.equal(result.text, 'email [redacted:email] token [redacted:token]');
  assert.deepEqual(result.redactions, [{ kind: 'email', count: 1 }, { kind: 'token', count: 1 }]);
});


test('redacts bearer tokens and URL credentials before reports are shared', () => {
  const result = redactText('Authorization: Bearer abcdefghijklmnopqrstuvwxyz https://bot:s3cr3t@example.test/path');
  assert.equal(result.text, 'Authorization: Bearer [redacted:token] https://bot:[redacted:password]@example.test/path');
  assert.deepEqual(result.redactions, [{ kind: 'url-password', count: 1 }, { kind: 'bearer-token', count: 1 }]);
});
