import puppeteer from 'puppeteer';
import { createRequire } from 'node:module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

export async function scrapeHolidayData(year = new Date().getFullYear()) {
  const url = `https://www.officialgazette.gov.ph/nationwide-holidays/${year}/`;
  console.log(`[INFO] Fetching: ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
  const html = await page.content();
  await browser.close();

  // Save raw HTML for debugging
  fs.writeFileSync(`debug-gazette-${year}.html`, html);
  console.log(`[INFO] Saved HTML to debug-gazette-${year}.html`);

  const $ = cheerio.load(html);
  const holidays = [];

  const sections = {
    'A. Regular Holidays': 'Regular',
    'B. Special (Non-Working) Holidays': 'Special (Non-Working)',
    'C. Special (Working) Holidays': 'Special (Working)'
  };

  Object.entries(sections).forEach(([heading, type]) => {
    const h4 = $(`h4:contains("${heading}")`);
    if (!h4.length) {
      console.warn(`[WARN] Section heading "${heading}" not found.`);
      return;
    }

    const table = h4.next('table');
    if (!table.length) {
      console.warn(`[WARN] No table found under "${heading}"`);
      return;
    }

    table.find('tbody tr').each((_, row) => {
      const name = $(row).find('.holiday-what').text().trim();
      const abbr = $(row).find('abbr');
      const fullDate = abbr.attr('title'); // e.g., "April 1, 2025"

      if (!name || !fullDate) return;

      const date = new Date(fullDate);
      if (isNaN(date)) {
        console.warn(`[WARN] Invalid date "${fullDate}" for ${name}`);
        return;
      }

      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      holidays.push({
        date: formattedDate,
        name,
        type,
        source: url
      });
    });
  });

  if (!holidays.length) {
    throw new Error(`No holiday data parsed for year ${year}.`);
  }

  console.log(`[INFO] Extracted ${holidays.length} holidays for ${year}`);

  return holidays; // ✅ Only return the array, don't write to file
}
