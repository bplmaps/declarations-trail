type FormatDateOptions = {
  withTime?: boolean;
  timeZone?: string;
};

const DEFAULT_TIMEZONE = "America/New_York";
const HAS_EXPLICIT_TIMEZONE_RE = /(?:[zZ]|[+-]\d{2}:\d{2})$/;
const ISO_LOCAL_DATE_TIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2})(?::(\d{2})(?::(\d{2}))?)?)?$/;

function nthWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
  occurrence: number
) {
  const firstDayWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const offset = (weekday - firstDayWeekday + 7) % 7;
  return 1 + offset + (occurrence - 1) * 7;
}

function isEasternDaylightTime(
  year: number,
  month: number,
  day: number,
  hour: number
) {
  if (month < 3 || month > 11) return false;
  if (month > 3 && month < 11) return true;

  if (month === 3) {
    const secondSunday = nthWeekdayOfMonth(year, 2, 0, 2);
    if (day > secondSunday) return true;
    if (day < secondSunday) return false;
    return hour >= 2;
  }

  const firstSunday = nthWeekdayOfMonth(year, 10, 0, 1);
  if (day < firstSunday) return true;
  if (day > firstSunday) return false;
  return hour < 2;
}

export function parseEventDate(date: Date | string): Date {
  if (date instanceof Date) return date;

  if (HAS_EXPLICIT_TIMEZONE_RE.test(date)) {
    return new Date(date);
  }

  const match = ISO_LOCAL_DATE_TIME_RE.exec(date);
  if (!match) {
    return new Date(date);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4] ?? "0");
  const minute = Number(match[5] ?? "0");
  const second = Number(match[6] ?? "0");

  // Interpret timestamp as local wall-clock time in America/New_York.
  const offsetMinutes = isEasternDaylightTime(year, month, day, hour)
    ? -4 * 60
    : -5 * 60;
  const utcMillis =
    Date.UTC(year, month - 1, day, hour, minute, second) -
    offsetMinutes * 60 * 1000;

  return new Date(utcMillis);
}

export function formatDate(date: Date | string, options?: FormatDateOptions) {
  const d = parseEventDate(date);
  const tz = options?.timeZone ?? DEFAULT_TIMEZONE;
  if (options?.withTime) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: tz,
    }).format(d);
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: tz,
  }).format(d);
}