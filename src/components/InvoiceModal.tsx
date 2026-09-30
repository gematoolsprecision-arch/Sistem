import React, { useState } from 'react';
import { Customer, InvoiceItem, InvoiceTransaction, MasterProduct } from '../types';
import { Logo } from './Logo';
import { Printer, Download, CheckCircle, Clock, X, Plus, Trash2, Edit3 } from 'lucide-react';

interface InvoiceModalProps {
  invoice: InvoiceTransaction | null;
  onClose: () => void;
  onSave?: (updatedInvoice: InvoiceTransaction) => void;
  customers: Customer[];
  products: MasterProduct[];
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onSave,
  customers,
  products
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceTransaction | null>(invoice);

  // Edit form state
  const [taxType, setTaxType] = useState<'Non-PPN' | 'PPN 11%'>(invoice?.taxType || 'Non-PPN');
  const [discount, setDiscount] = useState<number>(invoice?.discount || 0);
  const [downPayment, setDownPayment] = useState<number>(invoice?.downPayment || 0);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Belum Bayar'>(invoice?.paymentStatus || 'Belum Bayar');
  const [notes, setNotes] = useState<string>(invoice?.notes || "BCA 133 012 7020 a.n Rifa'atul Mahmudah");
  const [dueDate, setDueDate] = useState<string>(invoice?.dueDate || invoice?.date || '');

  // Add Item Selector
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  if (!currentInvoice) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num).replace('IDR', 'Rp');
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotals = (currentItems: InvoiceItem[], disc: number, tax: 'Non-PPN' | 'PPN 11%', dp: number) => {
    const subtotal = currentItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const taxableAmount = Math.max(0, subtotal - disc);
    const taxAmount = tax === 'PPN 11%' ? taxableAmount * 0.11 : 0;
    const total = taxableAmount + taxAmount;
    const amountDue = Math.max(0, total - dp);
    return { subtotal, discount: disc, taxAmount, total, downPayment: dp, amountDue };
  };

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productName: prod.name,
      description: prod.description || prod.name,
      quantity: itemQuantity,
      price: prod.price,
      amount: prod.price * itemQuantity
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    setSelectedProductId('');
    setItemQuantity(1);

    const totals = calculateTotals(newItems, discount, taxType, downPayment);
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        items: newItems,
        ...totals,
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const totals = calculateTotals(newItems, discount, taxType, downPayment);
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        items: newItems,
        ...totals,
      });
    }
  };

  const getBankAccount = (tax: 'Non-PPN' | 'PPN 11%') => {
    return tax === 'PPN 11%'
      ? "BCA - 1671 662 992 a.n PT. MASTER SINERGI BERSAUDARA"
      : "BCA 133 012 7020 a.n Rifa'atul Mahmudah";
  };

  const handleToggleTax = (newTax: 'Non-PPN' | 'PPN 11%') => {
    setTaxType(newTax);
    const newNotes = getBankAccount(newTax);
    setNotes(newNotes);
    const totals = calculateTotals(items, discount, newTax, downPayment);
    if (currentInvoice) {
      const updated = {
        ...currentInvoice,
        taxType: newTax,
        notes: newNotes,
        ...totals
      };
      setCurrentInvoice(updated);
      if (onSave) onSave(updated);
    }
  };

  const handleDiscountChange = (val: number) => {
    setDiscount(val);
    const totals = calculateTotals(items, val, taxType, downPayment);
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        ...totals
      });
    }
  };

  const handleDownPaymentChange = (val: number) => {
    setDownPayment(val);
    const totals = calculateTotals(items, discount, taxType, val);
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        ...totals
      });
    }
  };

  const handleSaveEdits = () => {
    if (!currentInvoice) return;
    const totals = calculateTotals(items, discount, taxType, downPayment);
    const updated: InvoiceTransaction = {
      ...currentInvoice,
      items,
      taxType,
      dueDate,
      notes,
      paymentStatus,
      ...totals
    };
    setCurrentInvoice(updated);
    if (onSave) onSave(updated);
    setIsEditing(false);
  };

  const activeTotals = calculateTotals(
    isEditing ? items : currentInvoice.items,
    isEditing ? discount : currentInvoice.discount,
    isEditing ? taxType : currentInvoice.taxType,
    isEditing ? downPayment : currentInvoice.downPayment
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-auto overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-base text-slate-100">
              {currentInvoice.invoiceNumber}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                currentInvoice.paymentStatus === 'Lunas'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {currentInvoice.paymentStatus === 'Lunas' ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              )}
              {currentInvoice.paymentStatus}
            </span>
          </div>

          {/* Quick Actions & Tax Switcher */}
          <div className="flex items-center gap-2">
            {/* PPN Switcher Segment */}
            <div className="bg-slate-800 p-0.5 rounded-lg flex items-center text-xs">
              <button
                type="button"
                onClick={() => handleToggleTax('Non-PPN')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  (isEditing ? taxType : currentInvoice.taxType) === 'Non-PPN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tanpa PPN
              </button>
              <button
                type="button"
                onClick={() => handleToggleTax('PPN 11%')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  (isEditing ? taxType : currentInvoice.taxType) === 'PPN 11%'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pakai PPN (11%)
              </button>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              {isEditing ? 'Tutup Edit' : 'Edit Invoice'}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit Panel (if active) */}
        {isEditing && (
          <div className="bg-slate-50 border-b border-slate-200 p-4 print:hidden">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Pengaturan Invoice & Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Status Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                >
                  <option value="Belum Bayar">Belum Bayar (Piutang)</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Jatuh Tempo (Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Diskon (Rp)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => handleDiscountChange(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Uang Muka / DP (Rp)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

            {/* Tambah Produk Cepat */}
            <div className="flex flex-wrap items-end gap-2 bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Pilih Produk Dari Master</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatRupiah(p.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProductId}
                className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Item
              </button>
              <button
                type="button"
                onClick={handleSaveEdits}
                className="ml-auto px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRINTABLE INVOICE PAPER (Matches user's exact uploaded design) */}
        {/* ========================================================================= */}
        <div id="printable-invoice" className="p-8 sm:p-12 text-slate-900 bg-white font-sans text-sm">
          
          {/* Top Blue Hero Banner */}
          <div className="bg-[#1E6DEB] text-white p-8 rounded-t-lg -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">INVOICE</h1>
              <div className="text-blue-100 text-xs mt-1">
                PT. Master Sinergi Bersaudara · Solusi Filter Air Bersih & Higienis
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs uppercase tracking-wider text-blue-200 font-medium">
                Amount Due (IDR)
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-0.5">
                {formatRupiah(activeTotals.amountDue)}
              </div>
            </div>
          </div>

          {/* Bill To & Invoice Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 text-xs">
            <div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-2">
                BILL TO
              </div>
              <div className="text-slate-900 font-bold text-base mb-1">
                {currentInvoice.customerName}
              </div>
              <div className="text-slate-600 leading-relaxed max-w-sm">
                {currentInvoice.customerAddress}
              </div>
              {currentInvoice.customerPhone && (
                <div className="text-slate-500 mt-1 font-mono">
                  Telp/WA: {currentInvoice.customerPhone}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:text-right">
              <div className="flex justify-between sm:justify-end gap-6">
                <span className="text-slate-500 font-medium">Invoice Number:</span>
                <span className="font-bold text-slate-900 font-mono">{currentInvoice.invoiceNumber.replace('INV-', '')}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6">
                <span className="text-slate-500 font-medium">Invoice Date:</span>
                <span className="text-slate-800 font-medium">
                  {new Date(currentInvoice.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6">
                <span className="text-slate-500 font-medium">Payment Due:</span>
                <span className="text-slate-800 font-medium">
                  {new Date(currentInvoice.dueDate || currentInvoice.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 pt-1">
                <span className="text-slate-900 font-semibold">Amount Due (IDR):</span>
                <span className="font-bold text-slate-950 font-mono text-sm">
                  {formatRupiah(activeTotals.amountDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5">ITEMS</th>
                  <th className="py-2.5 text-center w-24">QUANTITY</th>
                  <th className="py-2.5 text-right w-36">PRICE</th>
                  <th className="py-2.5 text-right w-40">AMOUNT</th>
                  {isEditing && <th className="py-2.5 text-center w-12 print:hidden">AKSI</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {(isEditing ? items : currentInvoice.items).map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-4 align-top">
                      <div className="font-bold text-slate-900 text-sm">{item.productName}</div>
                      {item.description && item.description !== item.productName && (
                        <div className="text-slate-500 text-xs mt-0.5 leading-snug">{item.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 text-center text-slate-700 font-mono align-top">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 text-right text-slate-700 font-mono align-top">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900 font-mono align-top">
                      {formatRupiah(item.price * item.quantity)}
                    </td>
                    {isEditing && (
                      <td className="py-3.5 text-center align-top print:hidden">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotals & Calculations Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-200 mb-12">
            {/* Left: Notes & Bank Payment Terms */}
            <div className="w-full sm:w-1/2">
              <div className="text-slate-900 font-bold text-xs mb-1.5">Notes / Terms</div>
              <div className="text-slate-700 font-mono text-xs bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                {currentInvoice.notes || "BCA 133 012 7020 a.n Rifa'atul Mahmudah"}
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                * Bukti transfer pembayaran mohon dikirimkan melalui WhatsApp Admin/Sales.
              </div>
            </div>

            {/* Right: Financial Totals Breakdown */}
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Subtotal:</span>
                <span className="font-mono text-slate-800">{formatRupiah(activeTotals.subtotal)}</span>
              </div>

              {activeTotals.discount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Discount:</span>
                  <span className="font-mono text-rose-600">({formatRupiah(activeTotals.discount)})</span>
                </div>
              )}

              {/* PPN Line if applicable */}
              {activeTotals.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">PPN (11%):</span>
                  <span className="font-mono text-slate-800">{formatRupiah(activeTotals.taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                <span>Total:</span>
                <span className="font-mono">{formatRupiah(activeTotals.total)}</span>
              </div>

              {activeTotals.downPayment > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Down Payment:</span>
                  <span className="font-mono text-slate-800">{formatRupiah(activeTotals.downPayment)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-extrabold border-t-2 border-slate-900 pt-2 text-base">
                <span>Amount Due (IDR):</span>
                <span className="font-mono text-blue-700">{formatRupiah(activeTotals.amountDue)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer (3-column branding & contact exactly as uploaded sample) */}
          <div className="border-t border-slate-200 pt-8 mt-12 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center text-xs">
            {/* Logo */}
            <div className="sm:col-span-4 flex justify-start">
              <Logo size="invoice" />
            </div>

            {/* Address */}
            <div className="sm:col-span-5 text-slate-600 text-[11px] leading-relaxed">
              <div className="font-bold text-slate-900 mb-0.5">PT. Master Sinergi Bersaudara</div>
              <div>The Green Hill Cluster Chedi Blok C3 No 40 Kel. Pondok Rajeg Kec Cibinong</div>
              <div>Bogor, Jawa Barat 16914 Indonesia</div>
            </div>

            {/* Contact */}
            <div className="sm:col-span-3 text-slate-600 text-[11px] leading-relaxed sm:text-right">
              <div className="font-bold text-slate-900 mb-0.5">Contact Information</div>
              <div>Phone: 02129230393</div>
              <div>Mobile: 0818 808 707</div>
              <a href="https://www.masterfilterair.co.id" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                www.masterfilterair.co.id
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
