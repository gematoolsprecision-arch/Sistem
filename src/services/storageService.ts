import { Customer, InvoiceTransaction, MasterProduct, ScheduleItem } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_SCHEDULES, INITIAL_TRANSACTIONS } from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'msb_master_products_v5_authentic',
  CUSTOMERS: 'msb_customers_v5_authentic',
  SCHEDULES: 'msb_schedules_v5_authentic',
  TRANSACTIONS: 'msb_transactions_v5_authentic'
};

// Clean legacy keys on script load
try {
  ['msb_customers_v1', 'msb_customers_v2', 'msb_customers_v3', 'msb_customers_v4_clean',
   'msb_schedules_v1', 'msb_schedules_v2', 'msb_schedules_v3', 'msb_schedules_v4_clean',
   'msb_transactions_v1', 'msb_transactions_v2', 'msb_transactions_v3', 'msb_transactions_v4_clean',
   'msb_master_products_v1', 'msb_master_products_v2', 'msb_master_products_v3', 'msb_master_products_v4_clean'
  ].forEach(k => localStorage.removeItem(k));
} catch (e) {
  console.error(e);
}

export const storageService = {
  getProducts(): MasterProduct[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProduct(product: MasterProduct): MasterProduct[] {
    const list = this.getProducts();
    const existingIndex = list.findIndex(p => p.id === product.id);
    let updated: MasterProduct[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = product;
    } else {
      updated = [product, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return updated;
  },

  deleteProduct(id: string): MasterProduct[] {
    const list = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return list;
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (data) {
        const parsed: Customer[] = JSON.parse(data);
        const filtered = parsed.filter(
          c => !c.name.toLowerCase().includes('boga rasa') && !c.id.startsWith('CUST-PROSP-')
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch (e) {
      console.error(e);
    }
    const cleanInitial = INITIAL_CUSTOMERS.filter(
      c => !c.name.toLowerCase().includes('boga rasa') && !c.id.startsWith('CUST-PROSP-')
    );
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(cleanInitial));
    return cleanInitial;
  },

  saveCustomer(customer: Customer): Customer[] {
    const list = this.getCustomers();
    const existingIndex = list.findIndex(c => c.id === customer.id);
    let updated: Customer[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = customer;
    } else {
      updated = [customer, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    return updated;
  },

  deleteCustomer(id: string): Customer[] {
    const list = this.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    return list;
  },

  getSchedules(): ScheduleItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  },

  saveSchedule(item: ScheduleItem): ScheduleItem[] {
    const list = this.getSchedules();
    const existingIndex = list.findIndex(s => s.id === item.id);
    let updated: ScheduleItem[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(updated));
    return updated;
  },

  updateScheduleStatus(id: string, status: ScheduleItem['status'], fieldNotes?: string): ScheduleItem[] {
    const list = this.getSchedules();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          fieldNotes: fieldNotes !== undefined ? fieldNotes : item.fieldNotes,
          completedAt: status === 'Selesai' ? new Date().toISOString() : item.completedAt
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(updated));
    return updated;
  },

  deleteSchedule(id: string): ScheduleItem[] {
    const list = this.getSchedules().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(list));
    return list;
  },

  getTransactions(): InvoiceTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  },

  saveTransaction(tx: InvoiceTransaction): InvoiceTransaction[] {
    const list = this.getTransactions();
    const existingIndex = list.findIndex(t => t.invoiceNumber === tx.invoiceNumber);
    let updated: InvoiceTransaction[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = tx;
    } else {
      updated = [tx, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    return updated;
  },

  updatePaymentStatus(invoiceNumber: string, status: 'Lunas' | 'Belum Bayar'): InvoiceTransaction[] {
    const list = this.getTransactions();
    const updated = list.map(tx => {
      if (tx.invoiceNumber === invoiceNumber) {
        return {
          ...tx,
          paymentStatus: status,
          amountDue: status === 'Lunas' ? 0 : tx.total - tx.downPayment
        };
      }
      return tx;
    });
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    return updated;
  },

  deleteTransaction(invoiceNumber: string): InvoiceTransaction[] {
    const list = this.getTransactions().filter(t => t.invoiceNumber !== invoiceNumber);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
    return list;
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
};
