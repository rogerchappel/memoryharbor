import path from 'node:path';

export function citationFor(message, root) {
  const rel = path.relative(root, message.sourcePath) || path.basename(message.sourcePath);
  return `${rel}#message-${message.index + 1}`;
}

export function attachCitations(messages, root) {
  return messages.map((message) => ({
    ...message,
    citation: citationFor(message, root)
  }));
}
