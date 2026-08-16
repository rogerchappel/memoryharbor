import { assertObject, MemoryHarborError } from './errors.js';

export function parseJsonTranscript(text, sourcePath) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new MemoryHarborError(`Invalid JSON in ${sourcePath}`, { cause: error.message });
  }
  assertObject(data, 'transcript');
  if (!Array.isArray(data.messages)) {
    throw new MemoryHarborError(`JSON transcript in ${sourcePath} must contain a messages array`);
  }
  const messages = data.messages;
  return messages.map((message, index) => normalizeMessage(message, sourcePath, index));
}

export function parseJsonlTranscript(text, sourcePath) {
  return text.split(/\r?\n/).flatMap((line, index) => {
    if (line.trim() === '') return [];
    try {
      return [normalizeMessage(JSON.parse(line), sourcePath, index)];
    } catch (error) {
      throw new MemoryHarborError(`Invalid JSONL on line ${index + 1} in ${sourcePath}`, { cause: error.message });
    }
  });
}

function normalizeMessage(raw, sourcePath, index) {
  assertObject(raw, `message ${index + 1}`);
  const role = String(raw.role ?? raw.author ?? 'unknown');
  const content = String(raw.content ?? raw.text ?? raw.message ?? '');
  const createdAt = raw.createdAt ?? raw.timestamp ?? raw.time ?? null;
  const toolCalls = Array.isArray(raw.toolCalls) ? raw.toolCalls : Array.isArray(raw.tools) ? raw.tools : [];
  return { id: raw.id ? String(raw.id) : `${sourcePath}#${index + 1}`, sourcePath, index, role, content, createdAt, toolCalls };
}
