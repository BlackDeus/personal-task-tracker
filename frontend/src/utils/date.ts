/** Parse YYYY-MM-DD as local calendar date (avoids UTC shift) */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date = new Date()): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(deadline: string | null, completed: boolean): boolean {
  if (!deadline || completed) return false;
  return parseLocalDate(deadline) < startOfDay();
}

export function isDueToday(deadline: string | null): boolean {
  if (!deadline) return false;
  const today = startOfDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const d = parseLocalDate(deadline);
  return d >= today && d < tomorrow;
}

export function toDateInputValue(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
