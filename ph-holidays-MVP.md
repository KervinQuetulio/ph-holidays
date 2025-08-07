# 📄 MVP Document: `ph-holidays`

## 🌟 Project Overview

**Project Name:** `ph-holidays`

**Tagline:** "Know when to pahinga." — A complete and trusted holiday calendar for the Philippines, including regular/special holidays, long weekends, and export options.

**Purpose:** Provide an NPM package and CLI tool that offers updated and structured holiday data for the Philippines, including long weekend detection and source references. Optional scraper + GitHub Action enables automated yearly updates.

---

## ✅ MVP Features

| Feature                     | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| `getHolidays(year)`         | Returns full list of PH holidays for the given year                     |
| `isHoliday(date)`           | Returns `true/false` if a date is a holiday                             |
| `getHolidayInfo(date)`      | Returns name, type, and source for a specific date                      |
| `getLongWeekends(year)`     | Returns computed long weekends (3+ days)                                |
| CLI: `npx ph-holidays`      | Use core functions from terminal                                        |
| CLI Flag: `--long-weekends` | Show only long weekends                                                 |
| CLI Flag: `--update`        | Triggers the scraper and updates local JSON data                        |
| JSON Format                 | Holidays per year stored in `data/holidays-YYYY.json`                   |
| Holiday Types               | Regular, Special (Non-working), Special (Working), RA-based, Proclaimed |
| Source Metadata             | Each holiday includes official reference: RA, Proclamation, etc.        |
| Scraper                     | Scrapes Official Gazette for proclamations                              |
| GitHub Action               | Scheduled workflow to auto-update data every Q4                         |

---

## 🧱 Folder Structure

```
ph-holidays/
├── data/                          # Yearly holiday JSON files
│   └── holidays-2025.json
├── src/                           # Core logic
│   ├── index.js
│   ├── holidayService.js
│   ├── longWeekendService.js
│   └── constants.js
├── cli/                           # CLI entry
│   └── ph-holidays.js
├── tools/                         # Scraper logic
│   ├── scrape-gazette.js
│   └── update-holidays.js
├── tests/                         # Jest test files
│   ├── holidayService.test.js
│   └── longWeekendService.test.js
├── .github/
│   └── workflows/update.yml       # GitHub Action for auto-updates
├── README.md                      # Usage, docs, references
├── package.json                   # NPM metadata
├── LICENSE                        # Open-source license
└── .gitignore /.npmignore
```

---

## 📅 Data Sources

| Type              | Source                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Official Holidays | [Official Gazette](https://www.officialgazette.gov.ph/section/laws/proclamations/)       |
| RA-based Holidays | [Republic Act 9492](https://www.officialgazette.gov.ph/2007/07/25/republic-act-no-9492/) |
| DOLE Advisories   | [DOLE.gov.ph](https://www.dole.gov.ph/issuances/)                                        |

---

## ⚙️ Technologies

* Node.js
* NPM / CLI
* Cheerio or Puppeteer (scraper)
* GitHub Actions (CI/CD)
* Jest (testing)

---

## 🔄 Update Strategy

* **Auto:** GitHub Action runs weekly during Q4 to fetch and commit updated holidays
* **Manual:** Devs can run `npx ph-holidays --update` to trigger scraper locally
* **Verified:** All entries must include `source` link (RA, Proclamation, or DOLE)

---

## 📌 Usage Examples

```bash
npx ph-holidays 2025
npx ph-holidays 2025 --long-weekends
npx ph-holidays --update
```

```js
import { getHolidays, getLongWeekends, isHoliday } from 'ph-holidays';
```

---

## ✅ MVP Success Criteria

* [ ] Publish working NPM package with 2023–2026 data
* [ ] Support CLI commands with correct output
* [ ] Include scraper template and auto-update GitHub Action
* [ ] Document all holiday sources
* [ ] Add unit tests with Jest for all core logic

---

## 🗕️ Target Timeline

| Milestone          | Target Date |
| ------------------ | ----------- |
| MVP Scaffold       | Day 1       |
| CLI + API Complete | Day 3       |
| Scraper + Action   | Day 5       |
| Publish to NPM     | Day 7       |

---

## 🔓 License

MIT — free to use, modify, and distribute

---

## ⚠️ Disclaimer (Legal Safety)

This project is independently maintained and is **not affiliated with any government agency**. All holiday data is sourced from publicly available documents including:

* Presidential Proclamations (Official Gazette)
* Republic Acts (e.g., RA 9492)
* DOLE Labor Advisories

Under **RA 8293 (Intellectual Property Code of the Philippines)**, Section 176.1, government documents are not subject to copyright.

> "No copyright shall subsist in any work of the Government of the Philippines."

However, proper source attribution is provided. This package is offered **for informational and civic use only**.

---

Let me know if you'd like the actual code and project zip to match this architecture!
