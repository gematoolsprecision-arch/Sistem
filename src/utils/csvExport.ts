import { Customer, InvoiceTransaction, MasterProduct, ScheduleItem } from '../types';

export const exportToCsv = (filename: string, rows: (string | number)[][]) => {
  const processRow = (row: (string | number)[]) => {
    return row
      .map(val => {
        const str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',');
  };

  const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportTransactionsCsv = (transactions: InvoiceTransaction[]) => {
  const header = [
    'No Invoice',
    'Tanggal',
    'Customer_ID',
    'Nama Customer',
    'Alamat',
    'Item',
    'Subtotal',
    'Diskon',
    'Total Nominal',
    'PPN',
    'Status Bayar'
  ];

  const rows = transactions.map(t => [
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

  exportToCsv(`Transaksi_${new Date().toISOString().split('T')[0]}.csv`, [header, ...rows]);
};

export const exportSchedulesCsv = (schedules: ScheduleItem[]) => {
  const header = [
    'Customer_ID',
    'Nama Customer',
    'Produk',
    'Jenis Service',
    'Tanggal',
    'Keterangan',
    'No Invoice',
    'Status Pekerjaan',
    'Catatan Lapangan'
  ];

  const rows = schedules.map(s => [
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

  exportToCsv(`Jadwal_Service_${new Date().toISOString().split('T')[0]}.csv`, [header, ...rows]);
};

export const exportCustomersCsv = (customers: Customer[]) => {
  const header = [
    'Customer_ID',
    'Nama_Konsumen',
    'Alamat',
    'No_WA',
    'Unit_Terpasang',
    'Tgl_Pemasangan_Pertama',
    'Status'
  ];

  const rows = customers.map(c => [
    c.id,
    c.name,
    c.address,
    c.phone,
    c.installedUnit,
    c.firstInstallDate,
    c.status
  ]);

  exportToCsv(`Customers_${new Date().toISOString().split('T')[0]}.csv`, [header, ...rows]);
};

export const exportProductsCsv = (products: MasterProduct[]) => {
  const header = ['Nama_Produk', 'Kategori', 'Interval_Bulan', 'Harga', 'Deskripsi'];

  const rows = products.map(p => [
    p.name,
    p.category,
    p.intervalMonths,
    p.price,
    p.description
  ]);

  exportToCsv(`Master_Products_${new Date().toISOString().split('T')[0]}.csv`, [header, ...rows]);
};
