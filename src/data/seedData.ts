import { MasterProduct, Customer, ScheduleItem, InvoiceTransaction } from '../types';

export const INITIAL_PRODUCTS: MasterProduct[] = [
  {
    id: 'PROD-001',
    name: 'M300 Automatic',
    category: 'Unit Filter',
    intervalMonths: 8,
    price: 24500000,
    description: 'Unit Filter Penjernih Air Rumah Tangga dengan sistem Backwash Otomatis digital.'
  },
  {
    id: 'PROD-002',
    name: 'M300 Manual',
    category: 'Unit Filter',
    intervalMonths: 8,
    price: 19500000,
    description: 'Unit Filter Air Rumah Tangga handal dengan tuas manual 3-way backwash.'
  },
  {
    id: 'PROD-003',
    name: 'M300 SC',
    category: 'Unit Filter',
    intervalMonths: 8,
    price: 13500000,
    description: 'Unit Filter Softener & Carbon untuk air berkapur dan berbau.'
  },
  {
    id: 'PROD-004',
    name: 'M200 Automatic',
    category: 'Unit Filter',
    intervalMonths: 8,
    price: 15000000,
    description: 'Unit Filter ukuran ringkas cocok untuk perumahan kompak dengan backwash otomatis.'
  },
  {
    id: 'PROD-005',
    name: 'OH300 E',
    category: 'Unit Filter',
    intervalMonths: 12,
    price: 16500000,
    description: 'Tabung filter tabung stainless steel tebal tahan karat kapasitas tinggi.'
  },
  {
    id: 'PROD-006',
    name: 'OH300 SC',
    category: 'Unit Filter',
    intervalMonths: 12,
    price: 12500000,
    description: 'Unit filter OH300 kombinasi media softener & karbon aktif premium.'
  },
  {
    id: 'PROD-007',
    name: 'TOCLAS TW 200',
    category: 'Unit Filter',
    intervalMonths: 12,
    price: 15000000,
    description: 'Unit Pemurni Air TOCLAS teknologi Jepang teruji efisiensi tinggi.'
  },
  {
    id: 'PROD-008',
    name: 'TOCLAS TW 300',
    category: 'Unit Filter',
    intervalMonths: 12,
    price: 24000000,
    description: 'Unit TOCLAS kapasitas besar untuk rumah bertingkat & villa.'
  },
  {
    id: 'PROD-009',
    name: 'Solahart 302 SL',
    category: 'Pemanas Air Solar',
    intervalMonths: 12,
    price: 43400000,
    description: 'Pemanas Air Tenaga Surya Solahart 300 Liter 2 Kolektor Super L.'
  },
  {
    id: 'PROD-010',
    name: 'Solahart 181 SL',
    category: 'Pemanas Air Solar',
    intervalMonths: 12,
    price: 22000000,
    description: 'Pemanas Air Tenaga Surya Solahart 180 Liter 1 Kolektor.'
  },
  {
    id: 'PROD-011',
    name: 'MAF 4M³',
    category: 'Unit Filter',
    intervalMonths: 6,
    price: 6200000,
    description: 'Unit Filter Industri Medium Flow kapasitas 4.000 liter/jam.'
  },
  {
    id: 'PROD-012',
    name: 'MAF 6M³',
    category: 'Unit Filter',
    intervalMonths: 6,
    price: 7500000,
    description: 'Unit Filter Industri High Flow kapasitas 6.000 liter/jam.'
  },
  {
    id: 'PROD-013',
    name: 'Service = Carbon Aktif Powder dan pencucian cloth filter',
    category: 'Service & Maintenance',
    intervalMonths: 4,
    price: 950000,
    description: 'Perawatan rutin pencucian kain saring (cloth filter) & penggantian serbuk Karbon Aktif murni.'
  },
  {
    id: 'PROD-014',
    name: 'Pasir Sand',
    category: 'Media Filter',
    intervalMonths: 12,
    price: 1500000,
    description: 'Penggantian media pasir silica & pasir aktif penjernih lumpur dan besi.'
  },
  {
    id: 'PROD-015',
    name: 'CARTRIDGE TOCLAS',
    category: 'Sparepart',
    intervalMonths: 12,
    price: 3500000,
    description: 'Cartridge elemen pengganti asli untuk pemurni air TOCLAS.'
  },
  {
    id: 'PROD-016',
    name: 'PLEATED TOCLAS',
    category: 'Sparepart',
    intervalMonths: 12,
    price: 2200000,
    description: 'Elemen lipit Pleated Filter cartridge Toclas.'
  },
  {
    id: 'PROD-017',
    name: 'CARTRIDGE JC1500',
    category: 'Sparepart',
    intervalMonths: 12,
    price: 2200000,
    description: 'Cartridge Filter Air Minum JC1500 food grade.'
  },
  {
    id: 'PROD-018',
    name: 'Cloth Filter',
    category: 'Sparepart',
    intervalMonths: 12,
    price: 2500000,
    description: 'Kain saring mikron khusus unit Yamaha & Toclas Water Purifier.'
  },
  {
    id: 'PROD-019',
    name: 'Packing Head',
    category: 'Sparepart',
    intervalMonths: 18,
    price: 950000,
    description: 'Karet gasket packing kepala unit filter pencegah kebocoran tekanan.'
  },
  {
    id: 'PROD-020',
    name: 'KONTRAK SERVICE (1TAHUN)',
    category: 'Service & Maintenance',
    intervalMonths: 12,
    price: 2500000,
    description: 'Paket langganan service perawatan berkala 1 tahun penuh (3-4 kali kunjungan).'
  },
  {
    id: 'PROD-021',
    name: 'Sedimen Filter',
    category: 'Media Filter',
    intervalMonths: 3,
    price: 150000,
    description: 'Cartridge spun sediment 10 inch 1 - 5 mikron.'
  },
  {
    id: 'PROD-022',
    name: 'Garam Regenerasi Softener',
    category: 'Media Filter',
    intervalMonths: 2,
    price: 250000,
    description: 'Garam murni khusus regenerasi resin ion exchange water softener.'
  },
  {
    id: 'PROD-023',
    name: 'WRV (Water Regulating Valve)',
    category: 'Sparepart',
    intervalMonths: 24,
    price: 950000,
    description: 'Katup peredam dan penstabil tekanan pipa masuk.'
  },
  {
    id: 'PROD-024',
    name: 'UV S5',
    category: 'Unit Filter',
    intervalMonths: 12,
    price: 4500000,
    description: 'Unit Lampu Ultraviolet 5 GPM pembasmi bakteri & kuman.'
  },
  {
    id: 'PROD-025',
    name: 'Jasa Pemasangan',
    category: 'Service & Maintenance',
    intervalMonths: 0,
    price: 500000,
    description: 'Ongkos kerja teknisi pemasangan unit baru atau relokasi.'
  },
  {
    id: 'PROD-026',
    name: 'Biaya analisis air',
    category: 'Service & Maintenance',
    intervalMonths: 0,
    price: 750000,
    description: 'Uji parameter air baku (TDS, pH, Zat Besi Fe, Mangan Mn, Bau, Keruh).'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1476',
    name: 'Bapak Danu',
    address: 'Taman Kebon Jeruk Intercon blok G1/111 Srengseng Kebon Jeruk Jakarta Barat',
    phone: '081298834412',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'OH300 SC',
    firstInstallDate: '2026-08-26',
    lastServiceDate: '2026-08-26',
    waterSource: 'Air Tanah (Sumur Bor)',
    waterIssue: 'Air sedikit keruh dan berbau besi halus',
    notes: 'Konsumen VIP, minta dikonfirmasi sebelum kedatangan teknisi'
  },
  {
    id: 'CUST-1001',
    name: 'Bapak Adytirta',
    address: 'Jl. Mediterania Boulevard UT-MB/121 Kapuk Muara, Penjaringan, Jakarta Utara',
    phone: '08119827361',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'M300 Automatic',
    firstInstallDate: '2023-05-19',
    lastServiceDate: '2026-05-19',
    waterSource: 'PAM + Tanah',
    waterIssue: 'Kapur tinggi dan endapan putih',
    notes: 'Unit terpasang di dak lantai 3. Terakhir service 19 Mei 2026 -> Jatuh tempo rutin 4 bulan: September 2026.'
  },
  {
    id: 'CUST-1445',
    name: 'Ibu Edith',
    address: 'Bisma Raya Blok A3 No. 28 Sunter Agung Jakarta Utara',
    phone: '081378829100',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'M300 Automatic',
    firstInstallDate: '2026-09-30',
    lastServiceDate: '2026-09-30',
    waterSource: 'Air Tanah',
    waterIssue: 'Air kuning setelah diendapkan beberapa jam',
    notes: 'Pemasangan baru hari ini (30 Sep 2026), jatuh tempo service berikutnya: Januari 2027.'
  },
  {
    id: 'CUST-1274',
    name: 'Bapak Daniel',
    address: 'Harapan Indah Cluster Aralia hy 42 30 Bekasi',
    phone: '081211223344',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'Solahart 302 SL + M300 Automatic',
    firstInstallDate: '2023-09-18',
    lastServiceDate: '2026-05-18',
    lastSandChangeDate: '2025-03-20',
    waterSource: 'PAM',
    waterIssue: 'Perlu maintenance rutin solar heater dan filter softener',
    notes: 'Terakhir service rutin 18 Mei 2026 (jatuh tempo Sep 2026) dan ganti pasir sand terakhir 20 Maret 2025 (18 bulan -> jatuh tempo Sep 2026).'
  },
  {
    id: 'CUST-1375',
    name: 'IKEA Sentul City',
    address: 'Jl. MH. Thamrin Kav. 57 Sentul City, Bogor',
    phone: '02129230000',
    type: 'Industri / Komersial',
    status: 'Konsumen Resmi',
    installedUnit: 'MAF 6M³',
    firstInstallDate: '2025-02-12',
    lastServiceDate: '2026-04-12',
    waterSource: 'WTP Kawasan Sentul',
    waterIssue: 'Filtrasi suplai restoran & fasilitas umum',
    notes: 'Interval 6 bulan. Terakhir service 12 April 2026 -> Jatuh tempo berikutnya: Oktober 2026.'
  },
  {
    id: 'CUST-1473',
    name: 'Bapak Linggom Nainggolan',
    address: 'Taman Beverly Golf Blok borobudur 3 Karawaci Tangerang',
    phone: '08158823901',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'Solahart 302 SL + M300 Automatic',
    firstInstallDate: '2026-09-01',
    lastServiceDate: '2026-09-01',
    waterSource: 'Air Tanah',
    waterIssue: 'Air tanah berbau dan kandungan kapur',
    notes: 'Pemasangan 01 Sep 2026. Kontrak service 1 tahun aktif.'
  },
  {
    id: 'CUST-1260',
    name: 'Bapak Jonathan Darren',
    address: 'Walet Permai 2 no.26 PIK, Jakarta Utara',
    phone: '08176543210',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'M300 Automatic',
    firstInstallDate: '2023-07-15',
    lastServiceDate: '2026-05-25',
    waterSource: 'PAM PIK',
    waterIssue: 'Rutin service carbon aktif tiap 4 bulan',
    notes: 'Terakhir service 25 Mei 2026 -> Jatuh tempo rutin 4 bulan: September 2026.'
  },
  {
    id: 'CUST-1043',
    name: 'Ibu Dewi',
    address: 'Jalan Durian Barat 3 No 5 Jagakarsa, Jakarta Selatan',
    phone: '081344556677',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'OH300 SC',
    firstInstallDate: '2021-04-06',
    lastServiceDate: '2026-05-10',
    waterSource: 'Sumur Bor',
    waterIssue: 'Zat besi tinggi dan endapan',
    notes: 'Terakhir service 10 Mei 2026 -> Jatuh tempo rutin 4 bulan: September 2026.'
  },
  {
    id: 'CUST-1013',
    name: 'Bapak Gunawan',
    address: 'Jl. Walet elok 5 No. 7 Pantai Indah Kapuk Jakarta',
    phone: '08189012345',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'M300 Automatic',
    firstInstallDate: '2020-12-03',
    lastServiceDate: '2026-06-15',
    waterSource: 'PAM',
    waterIssue: 'Service berkala 4 bulanan',
    notes: 'Terakhir service 15 Juni 2026 -> Jatuh tempo berikutnya: Oktober 2026.'
  },
  {
    id: 'CUST-1227',
    name: 'Bapak Feri',
    address: 'Jln Boulevard Hijau blok H5 nomor 2,3 Bekasi',
    phone: '08190876543',
    type: 'Rumah Tangga',
    status: 'Konsumen Resmi',
    installedUnit: 'OH300 E',
    firstInstallDate: '2023-09-19',
    lastServiceDate: '2026-01-15',
    lastSandChangeDate: '2025-03-15',
    waterSource: 'Air Tanah',
    waterIssue: 'Air sedikit berkarat',
    notes: 'Ganti media pasir sand terakhir 15 Maret 2025 -> 18 bulan kemudian: Jatuh tempo September 2026.'
  }
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // KEMARIN (2026-09-29)
  {
    id: 'SCH-20260929-01',
    customerId: 'CUST-1476',
    customerName: 'Bapak Danu',
    address: 'Taman Kebon Jeruk Intercon blok G1/111 Srengseng Kebon Jeruk Jakarta Barat',
    phone: '081298834412',
    type: 'Pemasangan',
    product: 'OH300 SC (1 Unit)',
    date: '2026-09-29',
    time: '09:00 - 12:30',
    notes: 'Pemasangan unit baru OH300 SC dan sambungan pipa inlet/outlet toren.',
    status: 'Selesai',
    fieldNotes: 'Pemasangan unit baru selesai tepat waktu, tekanan normal 2.2 bar, air jernih TDS 75 ppm. Konsumen puas dengan hasil.',
    invoiceNumber: 'INV-508139',
    completedAt: '2026-09-29 13:00'
  },
  {
    id: 'SCH-20260929-02',
    customerId: 'CUST-1001',
    customerName: 'Bapak Adytirta',
    address: 'Jl. Mediterania Boulevard UT-MB/121 Kapuk Muara, Penjaringan, Jakarta Utara',
    phone: '08119827361',
    type: 'Maintenance',
    product: 'Service Carbon Aktif & Pencucian Cloth Filter',
    date: '2026-09-29',
    time: '13:30 - 15:30',
    notes: 'Maintenance berkala 4 bulan unit M300 Automatic (Terakhir service Mei 2026).',
    status: 'Selesai',
    fieldNotes: 'Pencucian kain saring cloth filter selesai, backwash 3 siklus, penggantian media carbon powder 1 sak. Invoice lunas.',
    invoiceNumber: 'INV-638100',
    completedAt: '2026-09-29 15:45'
  },

  // HARI INI (2026-09-30)
  {
    id: 'SCH-20260930-01',
    customerId: 'CUST-1445',
    customerName: 'Ibu Edith',
    address: 'Bisma Raya Blok A3 No. 28 Sunter Agung Jakarta Utara',
    phone: '081378829100',
    type: 'Pemasangan',
    product: 'M300 Automatic (1x)',
    date: '2026-09-30',
    time: '08:30 - 12:00',
    notes: 'Pemasangan unit baru M300 Automatic Softener di samping toren lantai 2.',
    status: 'Selesai',
    fieldNotes: 'Unit telah berhasil dipasang dan di-setting timer auto-backwash setiap 3 hari pukul 02:00 malam. Air jernih dan tidak licin. Invoice diterbitkan (Belum Bayar).',
    invoiceNumber: 'INV-407294',
    completedAt: '2026-09-30 11:45'
  },
  {
    id: 'SCH-20260930-02',
    customerId: 'CUST-1274',
    customerName: 'Bapak Daniel',
    address: 'Harapan Indah Cluster Aralia hy 42 30 Bekasi',
    phone: '081211223344',
    type: 'Maintenance',
    product: 'Service Solahart 302 SL & Ganti Pasir Sand Filter',
    date: '2026-09-30',
    time: '13:00 - 16:30',
    notes: 'Service rutin (terakhir service Mei 2026) dan ganti media pasir sand filter (siklus 18 bulan dari Maret 2025).',
    status: 'Belum Dikerjakan',
    fieldNotes: ''
  },

  // BESOK (2026-10-01)
  {
    id: 'SCH-20261001-01',
    customerId: 'CUST-1043',
    customerName: 'Ibu Dewi',
    address: 'Jalan Durian Barat 3 No 5 Jagakarsa, Jakarta Selatan',
    phone: '081344556677',
    type: 'Maintenance',
    product: 'Service Carbon Aktif Powder & Cuci Cloth Filter',
    date: '2026-10-01',
    time: '09:00 - 11:30',
    notes: 'Jadwal rutin 4 bulanan sesuai siklus maintenance (terakhir service Mei 2026).',
    status: 'Belum Dikerjakan',
    fieldNotes: ''
  },
  {
    id: 'SCH-20261001-02',
    customerId: 'CUST-1375',
    customerName: 'IKEA Sentul City',
    address: 'Jl. MH. Thamrin Kav. 57 Sentul City, Bogor',
    phone: '02129230000',
    type: 'Maintenance',
    product: 'Backwash Besar & Inspeksi MAF 6M³',
    date: '2026-10-01',
    time: '13:00 - 16:00',
    notes: 'Pembersihan strainer, cek valve otomatis, dan pengukuran debit WTP.',
    status: 'Belum Dikerjakan',
    fieldNotes: ''
  }
];

export const INITIAL_TRANSACTIONS: InvoiceTransaction[] = [
  // Invoice hari ini (30 Sep 2026) - Belum Bayar
  {
    invoiceNumber: 'INV-407294',
    date: '2026-09-30',
    dueDate: '2026-10-07',
    customerId: 'CUST-1445',
    customerName: 'Ibu Edith',
    customerAddress: 'Bisma Raya Blok A3 No. 28 Sunter Agung Jakarta Utara',
    customerPhone: '081378829100',
    items: [
      {
        id: 'item-1',
        productName: 'M300 Automatic (1x)',
        description: 'Unit Filter Air Otomatis M300 + Material Pemasangan',
        quantity: 1,
        price: 26900000,
        amount: 26900000
      }
    ],
    subtotal: 26900000,
    discount: 0,
    taxType: 'PPN 11%',
    taxAmount: 2959000,
    total: 29859000,
    downPayment: 0,
    amountDue: 29859000,
    paymentStatus: 'Belum Bayar',
    notes: 'Mohon transfer ke rekening BCA 133 012 7020 a.n Rifa\'atul Mahmudah. Terima kasih.'
  },
  // Invoice kemarin (29 Sep 2026) - Belum Bayar
  {
    invoiceNumber: 'INV-508139',
    date: '2026-09-29',
    dueDate: '2026-10-06',
    customerId: 'CUST-1476',
    customerName: 'Bapak Danu',
    customerAddress: 'Taman Kebon Jeruk Intercon blok G1/111 Srengseng Kebon Jeruk Jakarta Barat',
    customerPhone: '081298834412',
    items: [
      {
        id: 'item-1',
        productName: 'OH300 SC (1x)',
        description: 'Unit Filter Softener & Carbon OH300 SC',
        quantity: 1,
        price: 12500000,
        amount: 12500000
      }
    ],
    subtotal: 12500000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 12500000,
    downPayment: 0,
    amountDue: 12500000,
    paymentStatus: 'Belum Bayar',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  // Invoice kemarin (29 Sep 2026) - Lunas
  {
    invoiceNumber: 'INV-638100',
    date: '2026-09-29',
    dueDate: '2026-09-29',
    customerId: 'CUST-1001',
    customerName: 'Bapak Adytirta',
    customerAddress: 'Jl. Mediterania Boulevard UT-MB/121 Kapuk Muara, Penjaringan, Jakarta Utara',
    customerPhone: '08119827361',
    items: [
      {
        id: 'item-1',
        productName: 'Service = Carbon Aktif Powder dan pencucian cloth filter',
        description: 'Maintenance rutin cuci kain saring dan isi ulang karbon aktif',
        quantity: 1,
        price: 12000000,
        amount: 12000000
      }
    ],
    subtotal: 12000000,
    discount: 0,
    taxType: 'PPN 11%',
    taxAmount: 1320000,
    total: 13320000,
    downPayment: 13320000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'Lunas dibayar via transfer BCA.'
  },
  // Invoice Daniel (Agustus 2026) sesuai contoh PDF user
  {
    invoiceNumber: 'INV-1553612',
    date: '2026-08-03',
    dueDate: '2026-08-03',
    customerId: 'CUST-1274',
    customerName: 'Bapak Daniel',
    customerAddress: 'Harapan Indah Cluster Aralia hy 42 30 Bekasi',
    customerPhone: '081211223344',
    items: [
      {
        id: 'item-1',
        productName: 'Solahart 302 SL',
        description: 'Solar Water Heater 300 Liter 2 Kolektor',
        quantity: 1,
        price: 43400000,
        amount: 43400000
      },
      {
        id: 'item-2',
        productName: 'M300 Automatic',
        description: 'M300 Automatic Softener Filter',
        quantity: 1,
        price: 27500000,
        amount: 27500000
      }
    ],
    subtotal: 70900000,
    discount: 5400000,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 65500000,
    downPayment: 32750000,
    amountDue: 32750000,
    paymentStatus: 'Belum Bayar', // Sisa pelunasan
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  // Invoices September 2026 dari CSV user
  {
    invoiceNumber: 'INV-1553638',
    date: '2026-09-01',
    dueDate: '2026-09-01',
    customerId: 'CUST-1473',
    customerName: 'Bapak Linggom Nainggolan',
    customerAddress: 'Taman Beverly Golf Blok borobudur 3 Karawaci Tangerang',
    items: [
      {
        id: 'item-1',
        productName: 'Solahart 302 SL, M300 Automatic, KONTRAK SERVICE (1TAHUN)',
        quantity: 1,
        price: 117549000,
        amount: 117549000
      }
    ],
    subtotal: 117549000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 117549000,
    downPayment: 117549000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  {
    invoiceNumber: 'INV-1553639',
    date: '2026-09-02',
    dueDate: '2026-09-02',
    customerId: 'CUST-1339',
    customerName: 'Toosh Bar Kelapa Gading',
    customerAddress: 'Ruko Inkopal Blok A No 8 Kelapa Gading Jakarta Utara',
    items: [
      {
        id: 'item-1',
        productName: 'RO 500, Pompa Pendorong, M200 Automatic',
        quantity: 1,
        price: 24000000,
        amount: 24000000
      }
    ],
    subtotal: 24000000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 24000000,
    downPayment: 24000000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  {
    invoiceNumber: 'INV-1553640',
    date: '2026-09-04',
    dueDate: '2026-09-04',
    customerId: 'CUST-1475',
    customerName: 'Bapak Hakim',
    customerAddress: 'Perumahan Taman Aster blok G7 No 21-22 Cibitung, Cikarang Barat Bekasi',
    items: [
      {
        id: 'item-1',
        productName: 'OH300 E',
        quantity: 1,
        price: 18200000,
        amount: 18200000
      }
    ],
    subtotal: 18200000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 18200000,
    downPayment: 18200000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  {
    invoiceNumber: 'INV-1553641',
    date: '2026-09-08',
    dueDate: '2026-09-08',
    customerId: 'CUST-1145',
    customerName: 'Bapak Febian',
    customerAddress: 'Perum Citra Gran Blok E 3 No.5 Cibubur Jatikarya Jatisampurna 17435',
    items: [
      {
        id: 'item-1',
        productName: 'Service = Carbon Aktif Powder dan pencucian cloth filter',
        quantity: 1,
        price: 950000,
        amount: 950000
      }
    ],
    subtotal: 950000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 950000,
    downPayment: 950000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  {
    invoiceNumber: 'INV-1553642',
    date: '2026-09-08',
    dueDate: '2026-09-08',
    customerId: 'CUST-1219',
    customerName: 'Ibu Nathania',
    customerAddress: 'Jl. Kelapa sawit 13 BF 10 no 6, Sektor 1b Gading Serpong, Tangerang',
    items: [
      {
        id: 'item-1',
        productName: 'Media Filter',
        quantity: 1,
        price: 3200000,
        amount: 3200000
      }
    ],
    subtotal: 3200000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 3200000,
    downPayment: 3200000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  },
  {
    invoiceNumber: 'INV-1553643',
    date: '2026-09-09',
    dueDate: '2026-09-09',
    customerId: 'CUST-1261',
    customerName: 'Ibu Maria',
    customerAddress: 'Jalan Alydrus no 60 Petojo',
    items: [
      {
        id: 'item-1',
        productName: 'Service = Carbon Aktif Powder dan pencucian cloth filter',
        quantity: 1,
        price: 1150000,
        amount: 1150000
      }
    ],
    subtotal: 1150000,
    discount: 0,
    taxType: 'Non-PPN',
    taxAmount: 0,
    total: 1150000,
    downPayment: 1150000,
    amountDue: 0,
    paymentStatus: 'Lunas',
    notes: 'BCA 133 012 7020 a.n Rifa\'atul Mahmudah'
  }
];
