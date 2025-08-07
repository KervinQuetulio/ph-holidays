# 🇵🇭 ph-holidays

**"Know when to pahinga."**
A trusted and complete holiday calendar for the Philippines — with support for **regular and special holidays**, **long weekend detection**, and **automated updates** from official government sources.

---

## ✨ Features

* 🗖️ `getHolidays(year)` — Get all holidays for a given year
* ✅ `isHoliday(date)` — Check if a specific date is a holiday
* 🧠 `getHolidayInfo(date)` — Retrieve name, type, and source of holiday
* 📉 `getLongWeekends(year)` — Identify long weekends (3+ days off)
* 💻 CLI-ready: `npx ph-holidays`
* ↺ `--update` flag scrapes and refreshes data for a given year
* 🧹 Smart merge: updates only the selected year's data in `holidays.json`
* 🥪 Unit-tested with Jest for core logic
* 📁 Structured `data/` folder for clean JSON records per year
* ✨ Supports `Node.js >= 14` and modern ES modules

---

## 📦 Installation

Install via NPM:

```bash
npm install ph-holidays
```

Or use instantly with NPX:

```bash
npx ph-holidays 2025
```

---

## 🖥️ CLI Usage

```bash
npx ph-holidays 2025                   # Show all holidays for 2025
npx ph-holidays 2025 --long-weekends   # Show only long weekends
npx ph-holidays 2024 --update          # Scrape and update only 2024 data
```

👉 The `--update` flag fetches official holidays directly from [officialgazette.gov.ph](https://www.officialgazette.gov.ph) and updates only the specified year in `data/holidays.json`.

---

## 🧑‍💻 JavaScript Usage

```js
import {
  getHolidays,
  getLongWeekends,
  isHoliday,
  getHolidayInfo
} from 'ph-holidays';

console.log(getHolidays(2025));
console.log(getLongWeekends(2025));
console.log(isHoliday('2025-12-25')); // true
console.log(getHolidayInfo('2025-12-25')); // { name: 'Christmas Day', type: 'Regular', ... }
```

> ⚠️ If you're using Node.js and importing JSON, ensure `holidays.json` is loaded via `createRequire`:
>
> ```js
> import { createRequire } from 'module';
> const require = createRequire(import.meta.url);
> const holidaysData = require('../data/holidays.json');
> ```

---

## 🗂️ Folder Structure

```
ph-holidays/
├── data/                    # JSON holiday data by year
├── src/                     # Holiday logic and utility functions
├── cli/                     # Command-line interface entry
├── tools/                   # Scraper (puppeteer + cheerio)
├── tests/                   # Jest unit tests
├── .github/workflows/       # Auto-update via GitHub Actions
```

---

## ↺ Update Strategy

| Method        | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| **Manual**    | Run `npx ph-holidays 2024 --update` to pull new data from the Gazette         |
| **Automated** | GitHub Actions scraper runs **monthly** to check for new proclamations        |
| **Selective** | Only the passed `year` is refreshed in `holidays.json`, leaving others intact |
| **Verified**  | Every holiday has a `source` field referencing the Gazette                    |

---

## 📚 Official Source

Holiday data is obtained directly from the following official government resource:

* 📜 [Official Gazette Proclamations](https://www.officialgazette.gov.ph/section/laws/proclamations/)

---

## ⚠️ Disclaimer

This project is **not affiliated with any government agency**.
All data is publicly sourced from official sites for civic, educational, and development use.

> As per **RA 8293 (Intellectual Property Code)**, Section 176.1, no copyright subsists in official government documents.

---

## ⚖️ License

**MIT** — Free for public, academic, and commercial use.
Use it, fork it, improve it — responsibly.

---

## 🤝 Contributing

Pull requests are welcome!

If you:

* spot a parsing issue,
* need support for a new feature,
* want to enhance long weekend logic,

...please open an issue or submit a PR 🙌

---

Happy coding — and happy holidays! 🇵🇭
