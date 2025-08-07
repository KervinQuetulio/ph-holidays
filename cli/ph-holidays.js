#!/usr/bin/env node

import { getHolidays, getLongWeekends } from '../src/index.js';
import { runUpdate } from '../tools/update-holidays.js';

const args = process.argv.slice(2);
const yearArg = args[0];
const flag = args[1];

if (!yearArg || isNaN(yearArg)) {
  console.log('❌ Please provide a valid year.');
  process.exit(1);
}

const year = parseInt(yearArg, 10);

// 👇 Wrap inside async IIFE
(async () => {
  if (flag === '--update') {
    console.log(`↺ Updating data for ${year}...`);
    try {
      await runUpdate(year);
      console.log(`✅ Data updated for ${year}`);
    } catch (err) {
      console.error(`❌ Update failed: ${err.message}`);
      process.exit(1);
    }
    return; // ✅ allowed now inside the IIFE
  }

  // 📆 Load from local data
  const holidays = getHolidays(year);

  if (!holidays.length) {
    console.log(`❌ No data found for year ${year}`);
    process.exit(1);
  }

  console.log(`🇵🇭 PH Holidays for ${year}`);

  if (flag === '--long-weekends') {
    console.log('📉 Showing long weekends only\n');
    const weekends = getLongWeekends(year);
    if (!weekends.length) {
      console.log('❌ No long weekends found.');
      process.exit(0);
    }

    weekends.forEach(({ start, end, days, label }) => {
      console.log(`🗓️ ${start} → ${end} (${days} days): ${label}`);
    });
  } else {
    console.log('📆 Showing all holidays\n');
    holidays.forEach(h => {
      console.log(`📅 ${h.date} — ${h.name} (${h.type})`);
    });
  }
})();
