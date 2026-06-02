/** Ukrainian plural forms: [one, few, many] e.g. задача / задачі / задач */
export function pluralizeUk(
  count: number,
  forms: [string, string, string],
): string {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function formatTaskCount(count: number): string {
  return `${count} ${pluralizeUk(count, ['задача', 'задачі', 'задач'])}`;
}
