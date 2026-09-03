// All dates are handled as local calendar days in "YYYY-MM-DD" form, which is
// what <input type="date"> produces. Parsing goes through new Date(y, m, d)
// deliberately, so a date never shifts by a day because of the UTC offset.

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const pad = (n) => String(n).padStart(2, '0');

export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());

export function addDaysISO(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysLeft(iso) {
  return Math.round((parseISO(iso) - parseISO(todayISO())) / 86400000);
}

// Food-safety "traffic light": red for today/tomorrow, amber for 2–3 days,
// green for 4+ days, and a distinct spoiled tone once the date has passed.
export function urgencyOf(iso) {
  const d = daysLeft(iso);
  if (Number.isNaN(d)) return { days: NaN, label: 'No date', tone: 'slate' };
  if (d < 0) return { days: d, label: d === -1 ? 'Expired yesterday' : `Expired ${-d} days ago`, tone: 'spoiled' };
  if (d === 0) return { days: d, label: 'Use today', tone: 'red' };
  if (d === 1) return { days: d, label: '1 day left', tone: 'red' };
  if (d <= 3) return { days: d, label: `${d} days left`, tone: 'amber' };
  return { days: d, label: `${d} days left`, tone: 'fresh' };
}

export function formatShort(iso) {
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatLong(iso) {
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

// The way a best-before date is stamped on packaging: BB 10 SEP 2026
export function formatStamp(iso) {
  const d = parseISO(iso);
  return `BB ${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}
