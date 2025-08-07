import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.resolve(__dirname, '../data/holidays.json');

let holidaysData = {};

if (fs.existsSync(dataPath)) {
  try {
    const json = fs.readFileSync(dataPath, 'utf-8');
    holidaysData = JSON.parse(json);
  } catch (err) {
    console.warn(`[WARN] Could not parse holidays.json: ${err.message}`);
  }
}else {
  console.warn('[WARN] holidays.json not found. Run `--update` first.');
}

export function getHolidays(year) {
  return holidaysData[year] || [];
}

export function isHoliday(dateStr) {
  const year = new Date(dateStr).getFullYear();
  return (holidaysData[year] || []).some(h => h.date === dateStr);
}

export function getHolidayInfo(dateStr) {
  const year = new Date(dateStr).getFullYear();
  return (holidaysData[year] || []).find(h => h.date === dateStr) || null;
}

export function getLongWeekends(year) {
  const holidays = holidaysData[year] || [];
  const weekends = [];

  for (let i = 0; i < holidays.length - 1; i++) {
    const current = new Date(holidays[i].date);
    const next = new Date(holidays[i + 1].date);
    const diff = (next - current) / (1000 * 60 * 60 * 24);

    if (diff >= 2 && (current.getDay() === 5 || current.getDay() === 1)) {
      weekends.push({
        start: holidays[i].date,
        end: holidays[i + 1].date,
        days: diff + 1,
        label: `${holidays[i].name} + ${holidays[i + 1].name}`
      });
    }
  }

  return weekends;
}
