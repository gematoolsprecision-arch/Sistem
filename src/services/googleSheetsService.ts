import { Customer, InvoiceTransaction, MasterProduct, ScheduleItem } from '../types';
import { getAccessToken } from './googleAuth';

const SPREADSHEET_ID_KEY = 'msb_google_spreadsheet_id';

export const googleSheetsService = {
  getSpreadsheetId(): string {
    return localStorage.getItem(SPREADSHEET_ID_KEY) || '';
  },

  setSpreadsheetId(urlOrId: string) {
    let cleanId = urlOrId.trim();
    // If user pastes full URL, e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    const match = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      cleanId = match[1];
    }
    localStorage.setItem(SPREADSHEET_ID_KEY, cleanId);
    return cleanId;
  },

  clearSpreadsheetId() {
    localStorage.removeItem(SPREADSHEET_ID_KEY);
  },

  async appendTransaction(tx: InvoiceTransaction) {
    const spreadsheetId = this.getSpreadsheetId();
    const token = await getAccessToken();
    if (!spreadsheetId || !token) return false;

    const row = [
      tx.invoiceNumber,
      tx.date,
      tx.customerId,
      tx.customerName,
      tx.customerAddress,
      tx.items.map(it => `${it.productName}${it.quantity > 1 ? ` (${it.quantity}x)` : ''}`).join(', '),
      tx.subtotal,
      tx.discount,
      tx.total,
      tx.taxType,
      tx.paymentStatus
    ];

    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transaksi!A:K:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [row]
          })
        }
      );
      return res.ok;
    } catch (e) {
      console.error('Error appending transaction to Google Sheets:', e);
      return false;
    }
  },

  async appendSchedule(sch: ScheduleItem) {
    const spreadsheetId = this.getSpreadsheetId();
    const token = await getAccessToken();
    if (!spreadsheetId || !token) return false;

    const row = [
      sch.customerId,
      sch.customerName,
      sch.product,
      sch.type,
      sch.date,
      sch.notes,
      sch.invoiceNumber || '-',
      sch.status,
      sch.fieldNotes || '-'
    ];

    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Jadwal_Service!A:I:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [row]
          })
        }
      );
      return res.ok;
    } catch (e) {
      console.error('Error appending schedule to Google Sheets:', e);
      return false;
    }
  },

  async appendCustomer(cust: Customer) {
    const spreadsheetId = this.getSpreadsheetId();
    const token = await getAccessToken();
    if (!spreadsheetId || !token) return false;

    const row = [
      cust.id,
      cust.name,
      cust.address,
      cust.phone,
      cust.installedUnit,
      cust.firstInstallDate,
      cust.status
    ];

    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Customers!A:G:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [row]
          })
        }
      );
      return res.ok;
    } catch (e) {
      console.error('Error appending customer to Google Sheets:', e);
      return false;
    }
  },

  async syncAllToSpreadsheet(
    transactions: InvoiceTransaction[],
    schedules: ScheduleItem[],
    customers: Customer[],
    products: MasterProduct[]
  ) {
    const spreadsheetId = this.getSpreadsheetId();
    const token = await getAccessToken();
    if (!spreadsheetId || !token) {
      throw new Error('Belum terhubung ke Google Sheets atau belum login Google.');
    }

    // Prepare rows for Transaksi
    const txHeader = ['No Invoice', 'Tanggal', 'Customer_ID', 'Nama Customer', 'Alamat', 'Item', 'Subtotal', 'Diskon', 'Total Nominal', 'PPN', 'Status Bayar'];
    const txRows = transactions.map(t => [
      t.invoiceNumber,
      t.date,
      t.customerId,
      t.customerName,
      t.customerAddress,
      t.items.map(it => `${it.productName}${it.quantity > 1 ? ` (${it.quantity}x)` : ''}`).join(', '),
      t.subtotal,
      t.discount,
      t.total,
      t.taxType,
      t.paymentStatus
    ]);

    // Prepare rows for Jadwal_Service
    const schHeader = ['Customer_ID', 'Nama Customer', 'Produk', 'Jenis Service', 'Tanggal', 'Keterangan', 'No Invoice', 'Status Pekerjaan', 'Catatan Lapangan'];
    const schRows = schedules.map(s => [
      s.customerId,
      s.customerName,
      s.product,
      s.type,
      s.date,
      s.notes,
      s.invoiceNumber || '-',
      s.status,
      s.fieldNotes || '-'
    ]);

    // Prepare rows for Customers
    const custHeader = ['Customer_ID', 'Nama_Konsumen', 'Alamat', 'No_WA', 'Unit_Terpasang', 'Tgl_Pemasangan_Pertama', 'Status'];
    const custRows = customers.map(c => [
      c.id,
      c.name,
      c.address,
      c.phone,
      c.installedUnit,
      c.firstInstallDate,
      c.status
    ]);

    // Prepare rows for Master_Products
    const prodHeader = ['Nama_Produk', 'Kategori', 'Interval_Bulan', 'Harga', 'Deskripsi'];
    const prodRows = products.map(p => [
      p.name,
      p.category,
      p.intervalMonths,
      p.price,
      p.description
    ]);

    // Overwrite each sheet with header + all rows
    const writeSheet = async (sheetName: string, data: (string | number)[][]) => {
      // Clear first
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:Z:clear`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(() => {});

      // Then write
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: data })
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Gagal menulis sheet ${sheetName}`);
      }
    };

    await writeSheet('Transaksi', [txHeader, ...txRows]);
    await writeSheet('Jadwal_Service', [schHeader, ...schRows]);
    await writeSheet('Customers', [custHeader, ...custRows]);
    await writeSheet('Master_Products', [prodHeader, ...prodRows]);

    return true;
  }
};
