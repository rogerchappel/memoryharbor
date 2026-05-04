export function renderMarkdownReport(manifest) {
  const lines = [];
  lines.push('# MemoryHarbor Pack');
  lines.push('');
  lines.push(`Generated: ${manifest.generatedAt}`);
  lines.push(`Source: ${manifest.sourceRoot}`);
  lines.push('');
  lines.push('## Counters');
  for (const [key, value] of Object.entries(manifest.counters)) lines.push(`- ${key}: ${value}`);
  lines.push('');
  lines.push('## Top Terms');
  for (const item of manifest.topTerms) lines.push(`- ${item.term} (${item.count})`);
  lines.push('');
  lines.push('## Citations');
  for (const message of manifest.messages.slice(0, 50)) lines.push(`- ${message.citation} [${message.role}] ${oneLine(message.content)}`);
  lines.push('');
  lines.push('## Forgetting Policy');
  lines.push(`- mode: ${manifest.forgettingPolicy.mode}`);
  lines.push(`- forget after days: ${manifest.forgettingPolicy.forgetAfterDays}`);
  lines.push(`- erase: \`${manifest.forgettingPolicy.eraseCommand}\``);
  return `${lines.join('\n')}\n`;
}

function oneLine(value) {
  return String(value).replace(/\s+/g, ' ').slice(0, 160);
}
