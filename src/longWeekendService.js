export function getLongWeekends(holidays) {
  const holidayDates = new Set(holidays.map(h => h.date));
  const year = new Date([...holidayDates][0]).getFullYear();
  const weekends = [];

  let currentBlock = [];
  const isWeekend = (date) => [0, 6].includes(date.getDay());
  const isHoliday = (dateStr) => holidayDates.has(dateStr);

  const dateToStr = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = dateToStr(d);
    const offDay = isWeekend(d) || isHoliday(dateStr);

    if (offDay) {
      currentBlock.push(dateStr);
    } else {
      // Workday — flush block if it's 3+ days
      if (currentBlock.length >= 3) {
        weekends.push({
          start: currentBlock[0],
          end: currentBlock[currentBlock.length - 1],
          days: currentBlock.length,
          label: getLabel(currentBlock, holidays)
        });
      }
      currentBlock = [];
    }
  }

  // Final block (e.g., year-end)
  if (currentBlock.length >= 3) {
    weekends.push({
      start: currentBlock[0],
      end: currentBlock[currentBlock.length - 1],
      days: currentBlock.length,
      label: getLabel(currentBlock, holidays)
    });
  }

  return weekends;
}

// Helper to get readable label
function getLabel(block, holidays) {
  const names = holidays
    .filter(h => block.includes(h.date))
    .map(h => h.name);
  return [...new Set(names)].join(' + ');
}
