import { MemoryHarborError } from './errors.js';

export function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift() ?? 'help';
  const options = { _: [] };
  const takeValue = (index, option) => {
    const value = args[index + 1];
    if (value === undefined || value.startsWith('-')) {
      throw new MemoryHarborError(`${option} requires a value`);
    }
    return value;
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--output' || arg === '-o') options.output = takeValue(index++, arg);
    else if (arg === '--query' || arg === '-q') options.query = takeValue(index++, arg);
    else if (arg === '--forget-after-days') {
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
    else if (arg === '--no-redact') options.redact = false;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--version' || arg === '-v') options.version = true;
    else if (arg.startsWith('-')) throw new MemoryHarborError(`Unknown option: ${arg}`);
    else options._.push(arg);
  }
  return { command, options };
}
