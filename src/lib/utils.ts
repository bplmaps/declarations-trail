type FormatDateOptions = {
  withTime?: boolean;
  timeZone?: string;
};

const DEFAULT_TIMEZONE = "America/New_York";

export function formatDate(date: Date | string, options?: FormatDateOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
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