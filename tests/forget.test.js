import test from 'node:test';
import assert from 'node:assert/strict';
import { buildForgettingPolicy } from '../src/forget.js';

test('forgetting policy defaults to 90 days', () => {
  assert.equal(buildForgettingPolicy().forgetAfterDays, 90);
});

for (const forgetAfterDays of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
  test(`forgetting policy rejects invalid duration ${forgetAfterDays}`, () => {
    assert.throws(() => buildForgettingPolicy({ forgetAfterDays }), {
      message: 'forgetAfterDays must be a positive number'
    });
  });
}
