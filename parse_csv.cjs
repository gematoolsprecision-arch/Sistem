const fs = require('fs');

const rawCsv = fs.readFileSync('raw_data.csv', 'utf8');
const lines = rawCsv.split('\n').filter(l => l.trim().length > 0);
const header = lines[0];
const rows = [];

// Simple CSV parser supporting quotes
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  if (parts.length >= 10) {
    rows.push({
      invoiceNumber: parts[0].trim(),
      date: parts[1].trim(),
      customerId: parts[2].trim(),
      customerName: parts[3].trim(),
      customerAddress: parts[4].trim(),
      item: parts[5].trim(),
      subtotal: parseFloat(parts[6].replace(/[^0-9.-]/g, '')) || 0,
      discount: parseFloat(parts[7].replace(/[^0-9.-]/g, '')) || 0,
      total: parseFloat(parts[8].replace(/[^0-9.-]/g, '')) || 0,
      taxType: parts[9].trim().includes('PPN 11%') ? 'PPN 11%' : 'Non-PPN',
      paymentStatus: (parts[10] || '').trim() || 'Lunas'
    });
  }
}

console.log(`Parsed ${rows.length} rows`);
