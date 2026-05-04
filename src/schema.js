export const manifestVersion = 'memoryharbor.manifest.v1';
export const supportedInputExtensions = new Set(['.json', '.jsonl', '.md', '.txt', '.log']);
export const defaultForgetAfterDays = 90;

export function createEmptyCounters() {
  return {
    files: 0,
    messages: 0,
    toolCalls: 0,
    artifacts: 0,
    bytes: 0,
    redactions: 0
  };
}
