import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createRequire } from 'node:module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin());

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

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  const html = await page.content();
  await browser.close();

  const debugFile = `debug-gazette-${year}.html`;
  fs.writeFileSync(debugFile, html);
  console.log(`[INFO] Saved HTML to ${debugFile}`);

  const $ = cheerio.load(html);
  const holidays = [];

  const sectionMap = {
    '#nationwide-regular-holidays': 'Regular Holiday',
    '#nationwide-special-holidays': 'Special (Non-Working) Holiday'
  };

  for (const [sectionId, type] of Object.entries(sectionMap)) {
    const section = $(sectionId);
    if (!section.length) {
      console.warn(`[WARN] Section not found: ${sectionId}`);
      continue;
    }

    section.find('table tbody tr').each((_, row) => {
      const name = $(row).find('.holiday-what').text().trim();
      const abbr = $(row).find('.holiday-when abbr');
      const fullDate = abbr.attr('title');

      if (!name || !fullDate) return;

      const dateObj = new Date(fullDate);
      if (isNaN(dateObj)) {
        console.warn(`[WARN] Invalid date "${fullDate}" for ${name}`);
        return;
      }

      const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      holidays.push({
        date: formattedDate,
        name,
        type,
        source: url
      });
    });
  }

  if (!holidays.length) {
    throw new Error(`No holiday data parsed for year ${year}.`);
  }

  console.log(`[INFO] Extracted ${holidays.length} holidays for ${year}`);
  return holidays;
}
