import { MemoryHarborError } from './errors.js';

export function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift() ?? 'help';
  const options = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--output' || arg === '-o') options.output = args[++index];
    else if (arg === '--query' || arg === '-q') options.query = args[++index];
    else if (arg === '--forget-after-days') options.forgetAfterDays = Number(args[++index]);
    else if (arg === '--no-redact') options.redact = false;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--version' || arg === '-v') options.version = true;
    else if (arg.startsWith('-')) throw new MemoryHarborError(`Unknown option: ${arg}`);
    else options._.push(arg);
  }
  return { command, options };
}
