import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeHolidayData } from './scrape-gazette.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/holidays.json');

export async function runUpdate(year = new Date().getFullYear()) {
  const holidays = await scrapeHolidayData(year);

  if (!Array.isArray(holidays) || holidays.length === 0) {
    throw new Error(`[FAIL] No holiday array returned for year ${year}`);
  }

  let data = {};
  if (fs.existsSync(dataPath)) {
    try {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      data = JSON.parse(raw);
    } catch (err) {
      console.warn(`[WARN] Could not parse existing holidays.json: ${err.message}`);
    }
  }

  data[year] = holidays;

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[SUCCESS] Updated ${dataPath} with ${holidays.length} entries for ${year}`);
}
