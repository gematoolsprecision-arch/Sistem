import React, { useState } from 'react';
import { InvoiceTransaction } from '../types';
import { FileText, DollarSign, Clock, CheckCircle2, Search, Printer, Plus, TrendingUp, AlertCircle } from 'lucide-react';

interface TransactionsViewProps {
  transactions: InvoiceTransaction[];
  onOpenInvoice: (tx: InvoiceTransaction) => void;
  onCreateNewInvoice: () => void;
  onUpdatePaymentStatus: (invoiceNumber: string, status: 'Lunas' | 'Belum Bayar') => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenInvoice,
  onCreateNewInvoice,
  onUpdatePaymentStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'piutang' | 'all' | 'lunas'>('piutang');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState<'all' | 'current' | 'last'>('current');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Current simulation reference: September 2026
  const CURRENT_YEAR_MONTH = '2026-09';

  // Calculate automated financial indicators
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(CURRENT_YEAR_MONTH));
  
  // Omset bulan berjalan: sum of total transaction values in this month
  const omsetBulanBerjalan = currentMonthTransactions.reduce((acc, t) => acc + t.total, 0);

  // Total Piutang (All uncollected amounts across system)
  const unpaidTransactions = transactions.filter(t => t.paymentStatus === 'Belum Bayar');
  const totalPiutang = unpaidTransactions.reduce((acc, t) => acc + (t.amountDue || (t.total - t.downPayment)), 0);

  // Total lunas bulan berjalan
  const lunasBulanBerjalan = currentMonthTransactions
    .filter(t => t.paymentStatus === 'Lunas')
    .reduce((acc, t) => acc + t.total, 0);

  // Filtering transactions list
  const filteredList = transactions.filter(t => {
    // Tab filter
    if (activeTab === 'piutang' && t.paymentStatus !== 'Belum Bayar') return false;
    if (activeTab === 'lunas' && t.paymentStatus !== 'Lunas') return false;

    // Month filter
    if (monthFilter === 'current' && !t.date.startsWith(CURRENT_YEAR_MONTH)) return false;

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchInv = t.invoiceNumber.toLowerCase().includes(q);
      const matchCust = t.customerName.toLowerCase().includes(q) || t.customerId.toLowerCase().includes(q);
      const matchItem = t.items.some(it => it.productName.toLowerCase().includes(q));
      if (!matchInv && !matchCust && !matchItem) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Omset Bulan Berjalan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Omset Bulan Berjalan
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {formatRupiah(omsetBulanBerjalan)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{currentMonthTransactions.length} Transaksi</span>
            <span>periode September 2026</span>
          </div>
        </div>

        {/* Total Piutang (Belum Bayar) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Total Piutang Berjalan
            </span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 font-mono mt-2">
            {formatRupiah(totalPiutang)}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {unpaidTransactions.length} invoice belum dilunasi konsumen
          </div>
        </div>

        {/* Penerimaan Lunas Masuk Kas/Bank */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Penerimaan Lunas (Bulan Ini)
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-2">
            {formatRupiah(lunasBulanBerjalan)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Terbayar ke BCA Rifa'atul Mahmudah
          </div>
        </div>

        {/* Total Transaksi Sepanjang Masa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Arsip Transaksi
            </span>
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 font-mono mt-2">
            {transactions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Invoice tersimpan dalam sistem
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Navigation / Filter Bar */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Segmented Tab */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setActiveTab('piutang')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'piutang'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Daftar Piutang (Belum Bayar)</span>
              <span className={`text-[10px] font-mono px-1.5 rounded-full ${
                activeTab === 'piutang' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {unpaidTransactions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Invoice
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lunas')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'lunas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sudah Lunas
            </button>
          </div>

          {/* Right Action buttons & Period */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="current">Bulan Ini (September 2026)</option>
              <option value="all">Semua Periode Transaksi</option>
            </select>

            <button
              type="button"
              onClick={onCreateNewInvoice}
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Terbitkan Invoice Baru
            </button>
          </div>

        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50/50 border-b border-slate-200/80 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Invoice, Nama Pelanggan, atau Produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-[11px] text-slate-500 ml-auto font-mono">
            Ditemukan {filteredList.length} transaksi
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Item Transaksi</th>
                <th className="py-3 px-4 text-center">Pajak</th>
                <th className="py-3 px-4 text-right">Total Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredList.map((tx) => {
                  const isUnpaid = tx.paymentStatus === 'Belum Bayar';
                  const itemSummary = tx.items.map(it => `${it.productName} (${it.quantity}x)`).join(', ');

                  return (
                    <tr key={tx.invoiceNumber} className="hover:bg-slate-50/50 transition-colors">
                      {/* Invoice No */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {tx.invoiceNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tx.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{tx.customerId}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="truncate text-slate-700 font-medium" title={itemSummary}>
                          {itemSummary}
                        </div>
                        {tx.discount > 0 && (
                          <div className="text-[10px] text-rose-600 font-mono">
                            Diskon: {formatRupiah(tx.discount)}
                          </div>
                        )}
                      </td>

                      {/* PPN Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          tx.taxType === 'PPN 11%'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.taxType}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                        {formatRupiah(tx.total)}
                        {isUnpaid && tx.downPayment > 0 && (
                          <div className="text-[10px] text-amber-700 font-normal">
                            Sisa: {formatRupiah(tx.amountDue)}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          isUnpaid
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isUnpaid ? (
                            <Clock className="w-3 h-3 text-amber-600" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          {tx.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isUnpaid && (
                            <button
                              type="button"
                              onClick={() => onUpdatePaymentStatus(tx.invoiceNumber, 'Lunas')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                              title="Tandai Pembayaran Lunas"
                            >
                              Tandai Lunas
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenInvoice(tx)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Buka / Cetak PDF Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium hidden sm:inline">Cetak</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
