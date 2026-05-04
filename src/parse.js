import path from 'node:path';
import { readText } from './fs.js';
import { redactText } from './redact.js';
import { parseJsonTranscript, parseJsonlTranscript } from './parser-json.js';
import { parseLooseText } from './parser-text.js';

export async function parseFile(filePath, options = {}) {
  const raw = await readText(filePath);
  const { text, redactions } = redactText(raw, options.redact !== false);
  const ext = path.extname(filePath).toLowerCase();
  let messages;
  if (ext === '.json') messages = parseJsonTranscript(text, filePath);
  else if (ext === '.jsonl') messages = parseJsonlTranscript(text, filePath);
  else messages = parseLooseText(text, filePath);
  return { filePath, rawBytes: Buffer.byteLength(raw), messages, redactions };
}
