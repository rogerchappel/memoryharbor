import { defaultForgetAfterDays } from './schema.js';

export function buildForgettingPolicy(options = {}) {
  const days = Number.isFinite(Number(options.forgetAfterDays)) ? Number(options.forgetAfterDays) : defaultForgetAfterDays;
  return {
    mode: 'local-manifest-only',
    forgetAfterDays: days,
    eraseCommand: 'rm -rf <output-directory>',
    note: 'MemoryHarbor writes local JSON/Markdown only. Remove the output directory to forget generated packs.'
  };
}

export function markRetention(messages, generatedAt, policy) {
  const cutoff = new Date(generatedAt);
  cutoff.setUTCDate(cutoff.getUTCDate() - policy.forgetAfterDays);
  return messages.map((message) => ({
    ...message,
    retention: message.createdAt && !Number.isNaN(Date.parse(message.createdAt)) && new Date(message.createdAt) < cutoff ? 'expired' : 'active'
  }));
}
