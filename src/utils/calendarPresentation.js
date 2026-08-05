export function toLocalDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function dateFromLocalKey(key) {
  const [year, month, day] = String(key).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12);
}

export function formatTimeInZone(value, timeZone) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone,
    }).format(new Date(value));
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  }
}

export function getTimeZoneAbbreviation(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    return parts.find((part) => part.type === 'timeZoneName')?.value || timeZone;
  } catch {
    return timeZone;
  }
}
