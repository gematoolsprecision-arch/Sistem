import React, { useState } from 'react';
import { Customer, InvoiceItem, InvoiceTransaction, MasterProduct, ScheduleItem } from '../types';
import { FileText, Plus, Trash2, X } from 'lucide-react';

interface NewInvoiceModalProps {
  onClose: () => void;
  onSave: (tx: InvoiceTransaction) => void;
  customers: Customer[];
  products: MasterProduct[];
  fromSchedule?: ScheduleItem | null;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  onClose,
  onSave,
  customers,
  products,
  fromSchedule
}) => {
  const [customerId, setCustomerId] = useState(fromSchedule?.customerId || '');
  const [customerName, setCustomerName] = useState(fromSchedule?.customerName || '');
  const [customerAddress, setCustomerAddress] = useState(fromSchedule?.address || '');
  const [customerPhone, setCustomerPhone] = useState(fromSchedule?.phone || '');
  
  // Simulation current date: 2026-09-30
  const [date, setDate] = useState('2026-09-30');
  const [dueDate, setDueDate] = useState('2026-10-07');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1553640 + Math.random() * 500)}`);
  
  const [taxType, setTaxType] = useState<'Non-PPN' | 'PPN 11%'>('Non-PPN');
  const [discount, setDiscount] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Belum Bayar'>('Belum Bayar');
  const [notes, setNotes] = useState<string>("BCA 133 012 7020 a.n Rifa'atul Mahmudah");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    if (fromSchedule) {
      // Find matching product
      const matchProd = products.find(p => p.name.toLowerCase() === fromSchedule.product.toLowerCase());
      if (matchProd) {
        return [
          {
            id: `item-${Date.now()}`,
            productName: matchProd.name,
            description: matchProd.description,
            quantity: 1,
            price: matchProd.price,
            amount: matchProd.price
          }
        ];
      } else {
        return [
          {
            id: `item-${Date.now()}`,
            productName: fromSchedule.product,
            description: `Pelaksanaan ${fromSchedule.type} - ${fromSchedule.product}`,
            quantity: 1,
            price: 15000000,
            amount: 15000000
          }
        ];
      }
    }
    // Default 1 empty product item
    const firstProd = products[0];
    return [
      {
        id: `item-${Date.now()}`,
        productName: firstProd?.name || 'M300 Automatic',
        description: firstProd?.description || '',
        quantity: 1,
        price: firstProd?.price || 24500000,
        amount: firstProd?.price || 24500000
      }
    ];
  });

  // Selector for adding product
  const [selectedProdId, setSelectedProdId] = useState('');
  const [addQty, setAddQty] = useState(1);

  const handleSelectTaxType = (newTax: 'Non-PPN' | 'PPN 11%') => {
    setTaxType(newTax);
    if (newTax === 'PPN 11%') {
      setNotes('BCA - 1671 662 992 a.n PT. MASTER SINERGI BERSAUDARA');
    } else {
      setNotes("BCA 133 012 7020 a.n Rifa'atul Mahmudah");
    }
  };

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const c = customers.find(item => item.id === id);
    if (c) {
      setCustomerName(c.name);
      setCustomerAddress(c.address);
      setCustomerPhone(c.phone);
    }
  };

  const handleAddItem = () => {
    if (!selectedProdId) return;
    const prod = products.find(p => p.id === selectedProdId);
    if (!prod) return;

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productName: prod.name,
      description: prod.description || prod.name,
      quantity: addQty,
      price: prod.price,
      amount: prod.price * addQty
    };

    setItems([...items, newItem]);
    setSelectedProdId('');
    setAddQty(1);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const taxable = Math.max(0, subtotal - discount);
  const taxAmount = taxType === 'PPN 11%' ? taxable * 0.11 : 0;
  const total = taxable + taxAmount;
  const amountDue = Math.max(0, total - downPayment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Tambahkan minimal 1 item produk/jasa ke invoice.');
      return;
    }

    const newTx: InvoiceTransaction = {
      invoiceNumber,
      date,
      dueDate,
      customerId: customerId || 'CUST-GENERAL',
      customerName,
      customerAddress,
      customerPhone,
      items,
      subtotal,
      discount,
      taxType,
      taxAmount,
      total,
      downPayment,
      amountDue: paymentStatus === 'Lunas' ? 0 : amountDue,
      paymentStatus,
      notes,
      scheduleId: fromSchedule?.id
    };

    onSave(newTx);
    onClose();
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Penerbitan Invoice & Sales Order</h3>
              <p className="text-xs text-slate-400">Pilihan versi Non-PPN atau PPN 11% sesuai permintaan konsumen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Invoice Header Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">No. Invoice *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-blue-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal Terbit</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Jatuh Tempo (Due Date)</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>

          {/* Customer Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pilih Konsumen Terdaftar</label>
              <select
                value={customerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="">-- Pilih dari database atau isi manual --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Konsumen *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Konsumen"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Alamat Penagihan / Pemasangan *</label>
            <input
              type="text"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Alamat lengkap konsumen..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>

          {/* Items Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Item Barang & Jasa</label>
            <div className="space-y-2 mb-3">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex-1 font-semibold text-slate-800">{item.productName}</div>
                  <div className="w-16 text-center font-mono">Qty: {item.quantity}</div>
                  <div className="w-28 text-right font-mono text-slate-700">{formatRupiah(item.price)}</div>
                  <div className="w-32 text-right font-mono font-bold text-slate-900">{formatRupiah(item.amount)}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add item row */}
            <div className="flex flex-wrap items-end gap-2 p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-blue-900 text-[11px] font-medium mb-1">Tambah dari Master Produk</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-2 py-1.5"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatRupiah(p.price)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-blue-900 text-[11px] font-medium mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={addQty}
                  onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-blue-200 rounded-lg px-2 py-1.5 text-center"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProdId}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>
          </div>

          {/* Versi Pajak & Financial Controls (Non-PPN vs PPN 11%) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Versi Pajak PPN (Sesuai Kebutuhan Pelanggan):</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() => handleSelectTaxType('Non-PPN')}
                  className={`px-3 py-1 rounded font-semibold transition-all ${
                    taxType === 'Non-PPN'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Non-PPN
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTaxType('PPN 11%')}
                  className={`px-3 py-1 rounded font-semibold transition-all ${
                    taxType === 'PPN 11%'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PPN 11%
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Diskon Potongan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Uang Muka / DP (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Status Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
                >
                  <option value="Belum Bayar">Belum Bayar (Piutang)</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-200 pt-2 space-y-1 text-slate-700 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Diskon:</span>
                  <span className="font-mono">-{formatRupiah(discount)}</span>
                </div>
              )}
              {taxType === 'PPN 11%' && (
                <div className="flex justify-between text-blue-700">
                  <span>PPN 11%:</span>
                  <span className="font-mono">+{formatRupiah(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total Invoice:</span>
                <span className="font-mono text-sm">{formatRupiah(total)}</span>
              </div>
              {downPayment > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Uang Muka (DP):</span>
                  <span className="font-mono">-{formatRupiah(downPayment)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-blue-800 text-sm">
                <span>Sisa Tagihan (Amount Due):</span>
                <span className="font-mono">{formatRupiah(paymentStatus === 'Lunas' ? 0 : amountDue)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Rekening Pembayaran & Catatan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
            >
              Terbitkan Invoice & Simpan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
