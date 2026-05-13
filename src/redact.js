const patterns = [
  { name: 'url-password', regex: /\b([a-z][a-z0-9+.-]*:\/\/[^:\s/@]+):([^\s/@]+)@/gi, replacement: (_match, prefix) => `${prefix}:[redacted:password]@` },
  { name: 'email', regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, replacement: '[redacted:email]' },
  { name: 'token', regex: /\b(?:sk|ghp|github_pat|xox[baprs])-?[A-Za-z0-9_\-]{12,}\b/g, replacement: '[redacted:token]' },
  { name: 'bearer-token', regex: /\bBearer\s+[A-Za-z0-9._~+\/-]{12,}=*/gi, replacement: 'Bearer [redacted:token]' },
  { name: 'env-secret', regex: /\b[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|KEY)=([^\s]+)/g, replacement: (match) => `${match.split('=')[0]}=[redacted:secret]` }
];

export function redactText(input, enabled = true) {
  if (!enabled) return { text: input, redactions: [] };
  let text = input;
  const redactions = [];
  for (const pattern of patterns) {
    let count = 0;
    text = text.replace(pattern.regex, (...args) => {
      count += 1;
      return typeof pattern.replacement === 'function' ? pattern.replacement(...args) : pattern.replacement;
    });
    if (count) redactions.push({ kind: pattern.name, count });
  }
  return { text, redactions };
}

export function mergeRedactions(items) {
  const counts = new Map();
  for (const item of items.flat()) counts.set(item.kind, (counts.get(item.kind) ?? 0) + item.count);
  return [...counts.entries()].map(([kind, count]) => ({ kind, count })).sort((a, b) => a.kind.localeCompare(b.kind));
}
