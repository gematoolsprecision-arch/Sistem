import React, { useState, useEffect } from 'react';
import { Customer, InvoiceTransaction, MasterProduct, ScheduleItem } from './types';
import { storageService } from './services/storageService';
import { Logo } from './components/Logo';
import { FlowchartGuide } from './components/FlowchartGuide';
import { JobdeskSchedule } from './components/JobdeskSchedule';
import { CustomersView } from './components/CustomersView';
import { MasterProductsView } from './components/MasterProductsView';
import { TransactionsView } from './components/TransactionsView';
import { InvoiceModal } from './components/InvoiceModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { NewScheduleModal } from './components/NewScheduleModal';
import { CustomerModal } from './components/CustomerModal';
import { ProductModal } from './components/ProductModal';
import { TechnicianUpdateModal } from './components/TechnicianUpdateModal';
import { ReviewModal } from './components/ReviewModal';
import { ProspectsSurveyModal } from './components/ProspectsSurveyModal';
import { MaintenanceForecastModal } from './components/MaintenanceForecastModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { initAuth } from './services/googleAuth';
import { googleSheetsService } from './services/googleSheetsService';
import { User } from 'firebase/auth';

import {
  exportTransactionsCsv,
  exportSchedulesCsv,
  exportCustomersCsv,
  exportProductsCsv
} from './utils/csvExport';
import {
  Wrench,
  DollarSign,
  Users,
  Package,
  Calendar,
  PhoneCall,
  RotateCcw,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'jobdesk' | 'transactions' | 'customers' | 'products'>('jobdesk');

  // Application Data States
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [transactions, setTransactions] = useState<InvoiceTransaction[]>([]);

  // Modals States
  const [activeInvoice, setActiveInvoice] = useState<InvoiceTransaction | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [scheduleForInvoice, setScheduleForInvoice] = useState<ScheduleItem | null>(null);

  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [preselectedCustomerForSchedule, setPreselectedCustomerForSchedule] = useState<Customer | null>(null);
  const [defaultScheduleType, setDefaultScheduleType] = useState<ScheduleItem['type']>('Pemasangan');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MasterProduct | null>(null);

  const [activeScheduleForTech, setActiveScheduleForTech] = useState<ScheduleItem | null>(null);
  const [activeScheduleForReview, setActiveScheduleForReview] = useState<ScheduleItem | null>(null);
  const [activeProspectForSurvey, setActiveProspectForSurvey] = useState<Customer | null>(null);
  const [isMaintenanceForecastOpen, setIsMaintenanceForecastOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load initial data and auth state
  useEffect(() => {
    setProducts(storageService.getProducts());
    setCustomers(storageService.getCustomers());
    setSchedules(storageService.getSchedules());
    setTransactions(storageService.getTransactions());

    // Initialize Google auth
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => unsubscribe();
  }, []);

  // Handlers for storage + background Google Sheets sync
  const handleSaveProduct = (prod: MasterProduct) => {
    const updated = storageService.saveProduct(prod);
    setProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari master?')) {
      const updated = storageService.deleteProduct(id);
      setProducts(updated);
    }
  };

  const handleSaveCustomer = (cust: Customer) => {
    const updated = storageService.saveCustomer(cust);
    setCustomers(updated);

    // Auto-append to Google Sheets in background if connected
    googleSheetsService.appendCustomer(cust).catch(console.error);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Yakin ingin menghapus data konsumen ini?')) {
      const updated = storageService.deleteCustomer(id);
      setCustomers(updated);
    }
  };

  const handleSaveSchedule = (sch: ScheduleItem) => {
    const updated = storageService.saveSchedule(sch);
    setSchedules(updated);

    // Auto-append to Google Sheets in background if connected
    googleSheetsService.appendSchedule(sch).catch(console.error);
  };

  const handleUpdateScheduleStatus = (id: string, status: ScheduleItem['status'], notes: string) => {
    const updated = storageService.updateScheduleStatus(id, status, notes);
    setSchedules(updated);
  };

  const handleSaveTransaction = (tx: InvoiceTransaction) => {
    const updated = storageService.saveTransaction(tx);
    setTransactions(updated);

    // Auto-append to Google Sheets in background if connected
    googleSheetsService.appendTransaction(tx).catch(console.error);

    // If linked to schedule, mark schedule as linked to invoice
    if (tx.scheduleId) {
      const schList = storageService.getSchedules();
      const sch = schList.find(s => s.id === tx.scheduleId);
      if (sch) {
        sch.invoiceNumber = tx.invoiceNumber;
        sch.status = 'Selesai';
        storageService.saveSchedule(sch);
        setSchedules([...schList]);
      }
    }
  };

  const handleUpdatePaymentStatus = (invoiceNumber: string, status: 'Lunas' | 'Belum Bayar') => {
    const updated = storageService.updatePaymentStatus(invoiceNumber, status);
    setTransactions(updated);
  };

  const handleConvertToOfficial = (cust: Customer) => {
    const updatedCust: Customer = {
      ...cust,
      status: 'Konsumen Resmi',
      firstInstallDate: '2026-09-30'
    };
    storageService.saveCustomer(updatedCust);
    setCustomers(storageService.getCustomers());

    // Automatically prompt to schedule installation
    setPreselectedCustomerForSchedule(updatedCust);
    setDefaultScheduleType('Pemasangan');
    setIsNewScheduleOpen(true);
  };

  const handleSaveSurveyReport = (customerId: string, report: NonNullable<Customer['surveyReport']>) => {
    const list = storageService.getCustomers();
    const cust = list.find(c => c.id === customerId);
    if (cust) {
      cust.surveyReport = report;
      storageService.saveCustomer(cust);
      setCustomers([...list]);
    }
  };

  const handleResetData = () => {
    if (confirm('Reset ulang data ke contoh bawaan awal? Semua perubahan akan dikembalikan ke data default.')) {
      storageService.resetAllData();
      setProducts(storageService.getProducts());
      setCustomers(storageService.getCustomers());
      setSchedules(storageService.getSchedules());
      setTransactions(storageService.getTransactions());
    }
  };

  // Financial calculations
  const CURRENT_MONTH = '2026-09';
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(CURRENT_MONTH));
  const omsetBulanBerjalan = currentMonthTransactions.reduce((acc, t) => acc + t.total, 0);
  const unpaidInvoices = transactions.filter(t => t.paymentStatus === 'Belum Bayar');
  const totalPiutang = unpaidInvoices.reduce((acc, t) => acc + (t.amountDue || (t.total - t.downPayment)), 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* TOP BAR CONTRACT: Brand Title | 4 Nav Links | Primary Actions */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-8 py-3.5 print:hidden shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand title / wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <Logo size="sm" />
          </div>

          {/* Zone 2: Navigation Links (Single-line, no capsules) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('jobdesk')}
              className={`transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'jobdesk'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Jobdesk Teknisi & Lapangan
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'transactions'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Daftar Piutang & Omset
              {unpaidInvoices.length > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.2 rounded-full">
                  {unpaidInvoices.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className={`transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'customers'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Customers & Prospek
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Master Products
            </button>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Sheets Live Sync Button */}
            <button
              type="button"
              onClick={() => setIsGoogleSheetsModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1.5"
              title="Koneksi & Sinkronisasi Langsung ke Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Google Sheets</span>
              {googleSheetsService.getSpreadsheetId() ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Tersambung" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300" title="Belum Terhubung" />
              )}
            </button>

            {/* Quick Export CSV Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                title="Unduh Data CSV Spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Download CSV</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block z-50 text-xs">
                <button
                  type="button"
                  onClick={() => exportTransactionsCsv(transactions)}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors"
                >
                  📄 Sheet Transaksi.csv
                </button>
                <button
                  type="button"
                  onClick={() => exportSchedulesCsv(schedules)}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors"
                >
                  📅 Sheet Jadwal_Service.csv
                </button>
                <button
                  type="button"
                  onClick={() => exportCustomersCsv(customers)}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors"
                >
                  👥 Sheet Customers.csv
                </button>
                <button
                  type="button"
                  onClick={() => exportProductsCsv(products)}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors"
                >
                  📦 Sheet Master_Products.csv
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setScheduleForInvoice(null);
                setIsNewInvoiceOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              + Buat Invoice
            </button>

            <button
              type="button"
              onClick={handleResetData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset data ke default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto gap-2 pt-3 border-t border-slate-100 mt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('jobdesk')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'jobdesk' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Jobdesk
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Piutang & Omset ({unpaidInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Master Produk
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Quick KPI Bar across the top of dashboard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-6 divide-x divide-slate-100 overflow-x-auto py-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Omset September 2026</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">
                  {formatRupiah(omsetBulanBerjalan)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pl-6 cursor-pointer" onClick={() => setActiveTab('transactions')}>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                  Total Piutang Berjalan ({unpaidInvoices.length})
                </div>
                <div className="text-sm font-extrabold text-amber-900 font-mono">
                  {formatRupiah(totalPiutang)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pl-6">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Calon Konsumen</div>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {customers.filter(c => c.status === 'Calon Konsumen').length} Prospek
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pl-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Konsumen Resmi</div>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {customers.filter(c => c.status === 'Konsumen Resmi').length} Unit Aktif
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMaintenanceForecastOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pantau Siklus 4/8/18 Bulan
            </button>
          </div>

        </div>

        {/* Operational Flowchart Walkthrough Banner (Always accessible on Jobdesk or as a toggle) */}
        {activeTab === 'jobdesk' && (
          <FlowchartGuide
            onNewProspect={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            onNewInstallation={() => {
              setPreselectedCustomerForSchedule(null);
              setDefaultScheduleType('Pemasangan');
              setIsNewScheduleOpen(true);
            }}
            onOpenMaintenanceForecast={() => setIsMaintenanceForecastOpen(true)}
            onOpenInvoices={() => setActiveTab('transactions')}
          />
        )}

        {/* View Content based on Tab */}
        {activeTab === 'jobdesk' && (
          <JobdeskSchedule
            schedules={schedules}
            onUpdateStatus={(sch) => setActiveScheduleForTech(sch)}
            onAddNewSchedule={() => {
              setPreselectedCustomerForSchedule(null);
              setDefaultScheduleType('Pemasangan');
              setIsNewScheduleOpen(true);
            }}
            onOpenInvoice={(sch) => {
              setScheduleForInvoice(sch);
              setIsNewInvoiceOpen(true);
            }}
            onReviewResult={(sch) => setActiveScheduleForReview(sch)}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            onOpenInvoice={(tx) => setActiveInvoice(tx)}
            onCreateNewInvoice={() => {
              setScheduleForInvoice(null);
              setIsNewInvoiceOpen(true);
            }}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            onEditCustomer={(cust) => {
              setEditingCustomer(cust);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={handleDeleteCustomer}
            onConvertToOfficial={handleConvertToOfficial}
            onScheduleJob={(cust, jobType) => {
              setPreselectedCustomerForSchedule(cust);
              setDefaultScheduleType(jobType);
              setIsNewScheduleOpen(true);
            }}
          />
        )}

        {activeTab === 'products' && (
          <MasterProductsView
            products={products}
            onAddProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(prod) => {
              setEditingProduct(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Printable Invoice Modal (User's Exact PDF Layout with Non-PPN / PPN 11% Toggle) */}
      {activeInvoice && (
        <InvoiceModal
          invoice={activeInvoice}
          onClose={() => setActiveInvoice(null)}
          onSave={handleSaveTransaction}
          customers={customers}
          products={products}
        />
      )}

      {/* 2. New Invoice / Sales Order Creation */}
      {isNewInvoiceOpen && (
        <NewInvoiceModal
          onClose={() => {
            setIsNewInvoiceOpen(false);
            setScheduleForInvoice(null);
          }}
          onSave={(newTx) => {
            handleSaveTransaction(newTx);
            setActiveInvoice(newTx); // Automatically open preview for printing
          }}
          customers={customers}
          products={products}
          fromSchedule={scheduleForInvoice}
        />
      )}

      {/* 3. New Schedule Modal (Penugasan Teknisi) */}
      {isNewScheduleOpen && (
        <NewScheduleModal
          onClose={() => {
            setIsNewScheduleOpen(false);
            setPreselectedCustomerForSchedule(null);
          }}
          onSave={handleSaveSchedule}
          customers={customers}
          products={products}
          preselectedCustomer={preselectedCustomerForSchedule}
          defaultType={defaultScheduleType}
        />
      )}

      {/* 4. Customer Modal (Add/Edit Calon Konsumen & Konsumen Resmi) */}
      {isCustomerModalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={() => {
            setIsCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />
      )}

      {/* 5. Master Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* 6. Technician Field Update Modal */}
      {activeScheduleForTech && (
        <TechnicianUpdateModal
          schedule={activeScheduleForTech}
          onClose={() => setActiveScheduleForTech(null)}
          onSave={handleUpdateScheduleStatus}
          onOpenInvoice={(sch) => {
            setScheduleForInvoice(sch);
            setIsNewInvoiceOpen(true);
          }}
        />
      )}

      {/* 7. Review Hasil Pengerjaan / Survei */}
      {activeScheduleForReview && (
        <ReviewModal
          schedule={activeScheduleForReview}
          onClose={() => setActiveScheduleForReview(null)}
          onOpenInvoice={(sch) => {
            setScheduleForInvoice(sch);
            setIsNewInvoiceOpen(true);
          }}
        />
      )}

      {/* 8. Maintenance Cycle Forecaster (4, 8, 12, 18 Bulan) */}
      {isMaintenanceForecastOpen && (
        <MaintenanceForecastModal
          customers={customers}
          products={products}
          onClose={() => setIsMaintenanceForecastOpen(false)}
          onScheduleMaintenance={(cust, serviceName) => {
            setPreselectedCustomerForSchedule(cust);
            setDefaultScheduleType('Maintenance');
            setIsNewScheduleOpen(true);
          }}
        />
      )}

      {/* 9. Google Sheets Live Sync Modal */}
      {isGoogleSheetsModalOpen && (
        <GoogleSheetsSyncModal
          currentUser={currentUser}
          onClose={() => setIsGoogleSheetsModalOpen(false)}
          onUserChange={(user) => setCurrentUser(user)}
          transactions={transactions}
          schedules={schedules}
          customers={customers}
          products={products}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-medium text-slate-700">
            PT. Master Sinergi Bersaudara · Sistem Manajemen Operasional Filter Air
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Bogor - Jakarta · Telp: 02129230393 · WA: 0818 808 707
          </div>
        </div>
      </footer>

    </div>
  );
}
