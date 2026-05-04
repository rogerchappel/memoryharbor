export class MemoryHarborError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MemoryHarborError';
    this.details = details;
  }
}

export function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new MemoryHarborError(`${label} must be an object`);
  }
}
