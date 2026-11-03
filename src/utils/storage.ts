export function readStored<T>(key: string, fallback: T, validate: (input: unknown) => input is T): T {
  try { const raw = localStorage.getItem(`ssh:${key}`); if (raw === null) return fallback; const value: unknown = JSON.parse(raw); return validate(value) ? value : fallback; } catch { return fallback; }
}
export function writeStored(key: string, value: unknown): boolean {
  try { localStorage.setItem(`ssh:${key}`, JSON.stringify(value)); return true; } catch { return false; }
}
export function isRecord(x: unknown): x is Record<string, unknown> { return x !== null && typeof x === 'object' && !Array.isArray(x); }
