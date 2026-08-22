import { tokenize } from './tokenize.js';

export function searchManifest(manifest, query, limit = 10) {
  validateSearchManifest(manifest);
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return manifest.messages
    .map((message) => ({ message, score: scoreMessage(message, terms) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.message.citation.localeCompare(b.message.citation))
    .slice(0, limit)
    .map(({ message, score }) => ({ score, citation: message.citation, role: message.role, content: message.content }));
}

function validateSearchManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.messages)) {
    throw new Error('manifest.messages must be an array');
  }

  manifest.messages.forEach((message, index) => {
    const field = `manifest.messages[${index}]`;
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      throw new Error(`${field} must be an object`);
    }
    if (typeof message.citation !== 'string' || message.citation.trim() === '') {
      throw new Error(`${field}.citation must be a non-empty string`);
    }
    if (typeof message.role !== 'string' || message.role.trim() === '') {
      throw new Error(`${field}.role must be a non-empty string`);
    }
    if (typeof message.content !== 'string') {
      throw new Error(`${field}.content must be a string`);
    }
  });
}

function scoreMessage(message, terms) {
  const haystack = `${message.role} ${message.content}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}
