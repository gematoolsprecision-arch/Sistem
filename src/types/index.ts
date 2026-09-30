import fs from 'fs';

// Let's create seed data for PT. Master Sinergi Bersaudara
export const BANK_ACCOUNTS = {
  NON_PPN: "BCA 133 012 7020 a.n Rifa'atul Mahmudah",
  PPN: "BCA - 1671 662 992 a.n PT. MASTER SINERGI BERSAUDARA"
};

export interface MasterProduct {
  id: string;
  name: string;
  category: 'Unit Filter' | 'Sparepart' | 'Media Filter' | 'Service & Maintenance' | 'Pemanas Air Solar' | 'Lainnya';
  intervalMonths: number;
  price: number;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  type: 'Rumah Tangga' | 'Industri / Komersial';
  status: 'Calon Konsumen' | 'Konsumen Resmi';
  installedUnit: string;
  firstInstallDate: string;
  lastServiceDate?: string;
  lastSandChangeDate?: string;
  waterSource?: string;
  waterIssue?: string;
  notes?: string;
  surveyReport?: {
    date: string;
    waterTds?: string;
    waterPh?: string;
    waterIssue: string;
    recommendation: string;
    status: 'Menunggu Survei' | 'Survei Selesai';
    updatedAt: string;
  };
}

export interface ScheduleItem {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  phone: string;
  type: 'Pemasangan' | 'Maintenance' | 'Survei';
  product: string;
  date: string; // YYYY-MM-DD
  time?: string;
  notes: string;
  status: 'Belum Dikerjakan' | 'Selesai' | 'Dibatalkan';
  fieldNotes?: string;
  invoiceNumber?: string;
  completedAt?: string;
}

export interface InvoiceItem {
  id: string;
  productName: string;
  description?: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface InvoiceTransaction {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxType: 'Non-PPN' | 'PPN 11%';
  taxAmount: number;
  total: number;
  downPayment: number;
  amountDue: number;
  paymentStatus: 'Lunas' | 'Belum Bayar';
  notes: string;
  scheduleId?: string;
}
