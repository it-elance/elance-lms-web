// A batch's dates for display, e.g. "12 Nov – 12 Dec 2026" or "28 Dec 2026 – 31 Jan 2027". The API
// stores each date as midnight UTC of the picked day, so they are read in UTC.
const formatDay = (date: Date, withYear: boolean) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear && { year: 'numeric' }),
    timeZone: 'UTC',
  });

export const batchDateRange = (
  start?: string | null,
  end?: string | null
): string => {
  if (!start || !end) return '';
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return '';

  const sameYear = from.getUTCFullYear() === to.getUTCFullYear();
  return `${formatDay(from, !sameYear)} – ${formatDay(to, true)}`;
};
