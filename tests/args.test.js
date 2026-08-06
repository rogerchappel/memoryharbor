import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/args.js';

for (const option of ['--output', '-o', '--query', '-q', '--forget-after-days']) {
  test(`${option} rejects a missing value`, () => {
    assert.throws(() => parseArgs(['inspect', option]), {
      message: `${option} requires a value`
    });
  });

  test(`${option} rejects another option as its value`, () => {
    assert.throws(() => parseArgs(['inspect', option, '--json']), {
      message: `${option} requires a value`
    });
  });
}

for (const value of ['NaN', '0', '-1']) {
  test(`--forget-after-days rejects ${value}`, () => {
    assert.throws(() => parseArgs(['inspect', '--forget-after-days', value]), {
      message: '--forget-after-days must be a positive number'
    });
  });
}

test('parses valued options and positive retention', () => {
  assert.deepEqual(
    parseArgs(['inspect', 'fixtures/sample', '--output', 'out', '--query', 'release', '--forget-after-days', '30']),
    {
      command: 'inspect',
      options: {
        _: ['fixtures/sample'],
        output: 'out',
        query: 'release',
        forgetAfterDays: 30
      }
    }
  );
});

for (const [command, positional] of [
  ['inspect', ['fixtures/sample', 'unexpected-extra']],
  ['search', ['memory-manifest.json', 'unexpected-extra']]
]) {
  test(`${command} rejects surplus positional arguments`, () => {
    assert.throws(() => parseArgs([command, ...positional]), {
      message: `${command} accepts exactly one positional argument`
    });
  });
}
