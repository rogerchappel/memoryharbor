import { defaultForgetAfterDays } from './schema.js';
import { MemoryHarborError } from './errors.js';

export function buildForgettingPolicy(options = {}) {
  const days = options.forgetAfterDays === undefined ? defaultForgetAfterDays : Number(options.forgetAfterDays);
  if (!Number.isFinite(days) || days <= 0) {
    throw new MemoryHarborError('forgetAfterDays must be a positive number');
  }
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
