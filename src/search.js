import { tokenize } from './tokenize.js';

export function searchManifest(manifest, query, limit = 10) {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return manifest.messages
    .map((message) => ({ message, score: scoreMessage(message, terms) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.message.citation.localeCompare(b.message.citation))
    .slice(0, limit)
    .map(({ message, score }) => ({ score, citation: message.citation, role: message.role, content: message.content }));
}

function scoreMessage(message, terms) {
  const haystack = `${message.role} ${message.content}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}
