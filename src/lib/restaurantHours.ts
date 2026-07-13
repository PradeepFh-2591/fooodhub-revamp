import { RESTAURANT } from "../constants/restaurant";

// JS Date.getDay(): 0 = Sunday ... 6 = Saturday. RESTAURANT.openingHours is
// Monday-first (index 0), so Sunday (0) maps to the last row and everything
// else shifts back by one.
export function jsDayToRowIndex(jsDay: number) {
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function getOpeningHoursForDate(date: Date) {
  return RESTAURANT.openingHours[jsDayToRowIndex(date.getDay())];
}

// Parses a slot label like "7:00 AM" (the same format getTimeSlotsForDate
// produces) into minutes-since-midnight, so callers can compare a slot
// against the current time.
export function parseTimeToMinutes(time: string): number {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  const [, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10) % 12;
  if (period.toUpperCase() === "PM") hour += 12;
  return hour * 60 + parseInt(minuteStr, 10);
}

function parseRangeToMinutes(range: string): [number, number] {
  const [start, end] = range.split(" - ");
  return [parseTimeToMinutes(start), parseTimeToMinutes(end)];
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatMinutesToLabel(minutes: number): string {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

// Merges overlapping/adjacent [start, end] minute ranges into the fewest
// disjoint ranges, so pickup+delivery windows that overlap don't produce
// duplicate time slots.
function mergeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

export function isRestaurantOpenAt(date: Date = new Date()): boolean {
  const row = getOpeningHoursForDate(date);
  if (!row) return false;
  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const ranges = [...row.pickup, ...row.delivery];
  return ranges.some((range) => {
    const [start, end] = parseRangeToMinutes(range);
    return minutesNow >= start && minutesNow <= end;
  });
}

export function getTimeSlotsForDate(date: Date, stepMinutes = 15): string[] {
  const row = getOpeningHoursForDate(date);
  if (!row) return [];
  const ranges = [...row.pickup, ...row.delivery].map(parseRangeToMinutes);
  const merged = mergeRanges(ranges);
  const slots: string[] = [];
  for (const [start, end] of merged) {
    for (let minutes = start; minutes <= end; minutes += stepMinutes) {
      slots.push(formatMinutesToLabel(minutes));
    }
  }
  return slots;
}
