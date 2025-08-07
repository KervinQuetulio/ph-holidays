import { getLongWeekends } from '../src/index.js';

test('detects valid long weekends for 2025', () => {
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
