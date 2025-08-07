import fs from 'fs';
import path from 'path';

const dataPath = (year) =>
  path.resolve(`./data/holidays-${year}.json`);

/**
 * Returns full holiday list for the given year
 */
export function getHolidays(year) {
  try {
    const holidays = JSON.parse(fs.readFileSync(dataPath(year), 'utf-8'));
    return holidays;
  } catch (error) {
    console.error(`❌ No data found for year ${year}`);
    return [];
  }
}

/**
 * Checks if a given date (YYYY-MM-DD) is a holiday
 */
export function isHoliday(dateStr) {
  const year = new Date(dateStr).getFullYear();
  const holidays = getHolidays(year);
  return holidays.some(h => h.date === dateStr);
}

/**
 * Returns holiday info if the date is a holiday
 */
export function getHolidayInfo(dateStr) {
  const year = new Date(dateStr).getFullYear();
  const holidays = getHolidays(year);
  return holidays.find(h => h.date === dateStr) || null;
}
