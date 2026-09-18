export function formatINRPrice(price: number, status?: string): string {
  if (status === 'For Rent') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    const l = price / 100000;
    return `₹${l % 1 === 0 ? l : l.toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function cleanIndianPhoneNumber(raw: string): { clean: string; isValid: boolean; error?: string } {
  if (!raw) return { clean: '', isValid: false, error: 'Phone number is missing.' };
  const digitsOnly = raw.replace(/[^\d+]/g, '');
  const normalized = digitsOnly;

  if (normalized.startsWith('+')) {
    const withoutPlus = normalized.substring(1);
    if (withoutPlus.length >= 10 && withoutPlus.length <= 15) {
      return { clean: normalized, isValid: true };
    }
    return { clean: normalized, isValid: false, error: 'Invalid international phone number length.' };
  }

  if (normalized.startsWith('91') && normalized.length === 12) {
    return { clean: `+${normalized}`, isValid: true };
  }

  if (normalized.startsWith('0') && normalized.length === 11) {
    return { clean: `+91${normalized.substring(1)}`, isValid: true };
  }

  if (normalized.length === 10) {
    if (/^[6-9]\d{9}$/.test(normalized)) {
      return { clean: `+91${normalized}`, isValid: true };
    }
    return { clean: `+91${normalized}`, isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
  }

  return { clean: normalized, isValid: false, error: 'Requires 10-digit mobile or full international country code (+91).' };
}

export function parseCsv(csvText: string) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const headerLine = lines[0].toLowerCase();
  let startIndex = 0;
  let nameIdx = 0;
  let phoneIdx = 1;
  let cityIdx = 2;
  let budgetIdx = 3;
  let interestIdx = 4;

  if (
    headerLine.includes('phone') ||
    headerLine.includes('mobile') ||
    headerLine.includes('contact') ||
    headerLine.includes('name')
  ) {
    startIndex = 1;
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    nameIdx = headers.findIndex((h) => h.includes('name'));
    phoneIdx = headers.findIndex(
      (h) => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('whatsapp') || h.includes('number')
    );
    cityIdx = headers.findIndex((h) => h.includes('city') || h.includes('location'));
    budgetIdx = headers.findIndex((h) => h.includes('budget') || h.includes('range') || h.includes('ticket'));
    interestIdx = headers.findIndex((h) => h.includes('interest') || h.includes('property') || h.includes('asset') || h.includes('type'));

    if (nameIdx === -1) nameIdx = 0;
    if (phoneIdx === -1) phoneIdx = 1;
  }

  const rows: string[][] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const row = lines[i];
    const cells: string[] = [];
    let inQuotes = false;
    let cur = '';
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim());
    rows.push(cells);
  }

  return rows.map((cells, i) => ({
    rawName: (cells[nameIdx] || `Investor #${i}`).replace(/^"|"$/g, '').trim(),
    rawPhone: (cells[phoneIdx] || '').replace(/^"|"$/g, '').trim(),
    rawCity: cityIdx !== -1 && cells[cityIdx] ? cells[cityIdx].replace(/^"|"$/g, '').trim() : undefined,
    rawBudget: budgetIdx !== -1 && cells[budgetIdx] ? cells[budgetIdx].replace(/^"|"$/g, '').trim() : undefined,
    rawInterest: interestIdx !== -1 && cells[interestIdx] ? cells[interestIdx].replace(/^"|"$/g, '').trim() : undefined,
  }));
}
