import { MemoryHarborError } from './errors.js';

export function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift() ?? 'help';
  const options = { _: [] };
  const suppliedOptions = new Set();
  const takeValue = (index, option) => {
    const value = args[index + 1];
    if (value === undefined || value.startsWith('-')) {
      throw new MemoryHarborError(`${option} requires a value`);
    }
    return value;
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--output' || arg === '-o') {
      suppliedOptions.add('--output');
      options.output = takeValue(index++, arg);
    }
    else if (arg === '--query' || arg === '-q') {
      suppliedOptions.add('--query');
      options.query = takeValue(index++, arg);
    }
    else if (arg === '--forget-after-days') {
      suppliedOptions.add(arg);
      const value = args[index + 1];
      if (value === undefined || (value.startsWith('-') && !/^-\d/.test(value))) {
        throw new MemoryHarborError(`${arg} requires a value`);
      }
      index += 1;
      const days = Number(value);
      if (!Number.isFinite(days) || days <= 0) {
        throw new MemoryHarborError('--forget-after-days must be a positive number');
      }
      options.forgetAfterDays = days;
    }
    else if (arg === '--no-redact') {
      suppliedOptions.add(arg);
      options.redact = false;
    }
    else if (arg === '--json') {
      suppliedOptions.add(arg);
      options.json = true;
    }
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--version' || arg === '-v') options.version = true;
    else if (arg.startsWith('-')) throw new MemoryHarborError(`Unknown option: ${arg}`);
    else options._.push(arg);
  }
  const allowedOptions = {
    inspect: new Set(['--output', '--query', '--forget-after-days', '--no-redact']),
    search: new Set(['--query', '--json'])
  };
  if (allowedOptions[command] && !options.help && !options.version) {
    for (const option of suppliedOptions) {
      if (!allowedOptions[command].has(option)) {
        throw new MemoryHarborError(`${option} is not valid for ${command}`);
      }
    }
  }
  if ((command === 'inspect' || command === 'search') && options._.length > 1) {
    throw new MemoryHarborError(`${command} accepts exactly one positional argument`);
  }
  return { command, options };
}
