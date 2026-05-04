const stopWords = new Set(['the','and','for','with','that','this','from','have','will','into','your','about','after','before','there','their','them','then','than','when','what','where','which','while','agent','user','assistant']);

export function tokenize(text) {
  return String(text).toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g)?.filter((word) => !stopWords.has(word)) ?? [];
}

export function topTerms(messages, limit = 20) {
  const counts = new Map();
  for (const message of messages) {
    for (const term of tokenize(message.content)) counts.set(term, (counts.get(term) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}
