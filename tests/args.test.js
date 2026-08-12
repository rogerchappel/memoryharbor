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

for (const [option, args] of [
  ['--output', ['--output', 'first', '--output', 'second']],
  ['--output', ['--output', 'first', '-o', 'second']],
  ['--query', ['-q', 'first', '--query', 'second']],
  ['--forget-after-days', ['--forget-after-days', '30', '--forget-after-days', '60']],
  ['--no-redact', ['--no-redact', '--no-redact']],
  ['--json', ['--json', '--json']],
  ['--help', ['--help', '-h']],
  ['--version', ['-v', '--version']]
]) {
  test(`rejects duplicate logical option ${args.join(' ')}`, () => {
    assert.throws(() => parseArgs(['inspect', 'fixtures/sample', ...args]), {
      message: `${option} may only be specified once`
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

test('accepts the complete inspect option set', () => {
  assert.deepEqual(
    parseArgs(['inspect', 'fixtures/sample', '--output', 'out', '--query', 'release', '--forget-after-days', '30', '--no-redact']),
    {
      command: 'inspect',
      options: {
        _: ['fixtures/sample'],
        output: 'out',
        query: 'release',
        forgetAfterDays: 30,
        redact: false
      }
    }
  );
});

test('accepts the complete search option set', () => {
  assert.deepEqual(
    parseArgs(['search', 'memory-manifest.json', '--query', 'release', '--json']),
    {
      command: 'search',
      options: {
        _: ['memory-manifest.json'],
        query: 'release',
        json: true
      }
    }
  );
});

for (const [command, option, value] of [
  ['inspect', '--json'],
  ['search', '--output', 'out'],
  ['search', '--forget-after-days', '30'],
  ['search', '--no-redact']
]) {
  test(`${command} rejects inapplicable ${option}`, () => {
    assert.throws(() => parseArgs([command, 'input', option, ...(value ? [value] : [])]), {
      message: `${option} is not valid for ${command}`
    });
  });
}

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
