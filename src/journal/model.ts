export type JournalEntry = { id: string; date: string; mood: string; content: string };
export const MAX_JOURNAL_LENGTH = 5000;
export function validContent(value: unknown): value is string { return typeof value==='string' && value.trim().length>0 && value.trim().length<=MAX_JOURNAL_LENGTH; }
export function isJournalEntry(value: unknown): value is JournalEntry {
  if(!value || typeof value!=='object')return false;
  const e=value as Record<string,unknown>;
  return typeof e.id==='string' && e.id.length>0 && typeof e.date==='string' && e.date.length<120 && typeof e.mood==='string' && e.mood.length<100 && validContent(e.content);
}
export function isJournalList(value: unknown): value is JournalEntry[] { return Array.isArray(value) && value.length<=1000 && value.every(isJournalEntry); }
export function removeEntry(entries: JournalEntry[],id: string): JournalEntry[] { return entries.filter(e=>e.id!==id); }
export function escapeHTML(value: string): string { return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ?? c)); }
