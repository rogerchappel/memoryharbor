import path from 'node:path';
import { manifestVersion, createEmptyCounters } from './schema.js';
import { topTerms } from './tokenize.js';
import { attachCitations } from './citations.js';
import { buildForgettingPolicy, markRetention } from './forget.js';
import { mergeRedactions } from './redact.js';

export function buildManifest({ root, parsedFiles, options = {} }) {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const counters = createEmptyCounters();
  const fileSummaries = [];
  const allMessages = [];
  for (const parsed of parsedFiles) {
    counters.files += 1;
    counters.bytes += parsed.rawBytes;
    counters.messages += parsed.messages.length;
    counters.redactions += parsed.redactions.reduce((sum, item) => sum + item.count, 0);
    for (const message of parsed.messages) {
      counters.toolCalls += message.toolCalls.length;
      allMessages.push(message);
    }
    fileSummaries.push({ path: path.relative(root, parsed.filePath), bytes: parsed.rawBytes, messages: parsed.messages.length, redactions: parsed.redactions });
  }
  const forgettingPolicy = buildForgettingPolicy(options);
  const citedMessages = markRetention(attachCitations(allMessages, root), generatedAt, forgettingPolicy);
  return {
    version: manifestVersion,
    generatedAt,
    sourceRoot: path.resolve(root),
    safety: { localOnly: true, network: false, redactionEnabled: options.redact !== false },
    counters,
    files: fileSummaries,
    redactions: mergeRedactions(parsedFiles.map((file) => file.redactions)),
    topTerms: topTerms(citedMessages),
    messages: citedMessages,
    forgettingPolicy
  };
}
