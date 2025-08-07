// tests/holidayService.test.js

import {
  getHolidays,
  isHoliday,
  getHolidayInfo,
  getLongWeekends
} from '../src/index.js'; // Make sure this path points to your main holiday service

describe('PH Holidays Core Functions', () => {
  test('gets 2025 holidays as array', () => {
    const holidays = getHolidays(2025);
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
  });

  test('checks if 2025-12-25 is a holiday', () => {
    expect(isHoliday('2025-12-25')).toBe(true);
  });

  test('gets holiday info for 2025-01-01', () => {
    const info = getHolidayInfo('2025-01-01');
    expect(info).toHaveProperty('name', "New Year's Day"); // Match exact apostrophe
    expect(info).toHaveProperty('type');
    expect(info).toHaveProperty('date', '2025-01-01');
  });

  test('detects long weekends in 2025', () => {
    const weekends = getLongWeekends(2025);
    expect(Array.isArray(weekends)).toBe(true);
    expect(weekends.length).toBeGreaterThan(0);

    weekends.forEach(entry => {
      expect(entry).toHaveProperty('start');
      expect(entry).toHaveProperty('end');
      expect(entry).toHaveProperty('days');
      expect(entry).toHaveProperty('label');
      expect(entry.days).toBeGreaterThanOrEqual(3); // Long weekend = 3+ days
    });
  });
});
