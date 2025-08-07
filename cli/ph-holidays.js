#!/usr/bin/env node

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI args
const year = process.argv[2] || new Date().getFullYear();
const shouldUpdate = process.argv.includes('--update');

const url = `https://www.officialgazette.gov.ph/nationwide-holidays/${year}/`;
const htmlPath = path.resolve(__dirname, `../debug-gazette-${year}.html`);
const jsonPath = path.resolve(__dirname, `../data/holidays.json`);

console.log(`↺ Updating data for ${year}...`);
console.log(`[INFO] Fetching: ${url}`);

try {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  const html = await page.content();
  fs.writeFileSync(htmlPath, html);
  console.log(`[INFO] Saved HTML to ${path.basename(htmlPath)}`);

  await browser.close();

  // Parse HTML using cheerio
  const $ = cheerio.load(html);
  const holidays = [];
  let currentType = null;

  $('h2, h3, h4, strong, b, p').each((_, el) => {
    const text = $(el).text().trim().toLowerCase();

    if (text.includes('regular holiday')) {
      currentType = 'Regular Holiday';
      return;
    }

    if (text.includes('special') && text.includes('non-working')) {
      currentType = 'Special (Non-Working) Holiday';
      return;
    }

    if (text.includes('special') && text.includes('working')) {
      currentType = 'Special (Working) Holiday';
      return;
    }

    // Match "January 1 (Wednesday) – New Year's Day"
    const holidayRegex = /^([A-Z][a-z]+ \d{1,2}) \(([^)]+)\)\s+[–-]\s+(.+)$/i;
    const match = $(el).text().trim().match(holidayRegex);

    if (match && currentType) {
      const [, dateText, day, name] = match;
      holidays.push({
        date: `${dateText}, ${year}`,
        day,
        name,
        type: currentType,
      });
    }
  });

  if (holidays.length === 0) {
    console.warn(`[WARN] No holiday data parsed for year ${year}.`);
    process.exit(1);
  }

  if (shouldUpdate) {
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify({ year, holidays }, null, 2));
    console.log(`✅ Holidays updated to ${path.relative(process.cwd(), jsonPath)}`);
  } else {
    console.log(JSON.stringify(holidays, null, 2));
  }
} catch (err) {
  console.error(`❌ Update failed: ${err.message}`);
  process.exit(1);
}
