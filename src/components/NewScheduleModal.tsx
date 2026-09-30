import React, { useState } from 'react';
import { Customer, MasterProduct, ScheduleItem } from '../types';
import { Calendar, Wrench, X } from 'lucide-react';

interface NewScheduleModalProps {
  onClose: () => void;
  onSave: (schedule: ScheduleItem) => void;
  customers: Customer[];
  products: MasterProduct[];
  preselectedCustomer?: Customer | null;
  defaultType?: 'Pemasangan' | 'Maintenance' | 'Survei';
}

export const NewScheduleModal: React.FC<NewScheduleModalProps> = ({
  onClose,
  onSave,
  customers,
  products,
  preselectedCustomer,
  defaultType = 'Pemasangan'
}) => {
  const [customerId, setCustomerId] = useState(preselectedCustomer?.id || '');
  const [customerName, setCustomerName] = useState(preselectedCustomer?.name || '');
  const [address, setAddress] = useState(preselectedCustomer?.address || '');
  const [phone, setPhone] = useState(preselectedCustomer?.phone || '');
  const [type, setType] = useState<ScheduleItem['type']>(defaultType);
  const [product, setProduct] = useState(
    preselectedCustomer?.installedUnit && preselectedCustomer.installedUnit !== '-'
      ? preselectedCustomer.installedUnit
      : (products[0]?.name || 'M300 Automatic')
  );
  // Default to today: 2026-09-30
  const [date, setDate] = useState('2026-09-30');
  const [time, setTime] = useState('09:00 - 12:00');
  const [notes, setNotes] = useState('');

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const c = customers.find(item => item.id === id);
    if (c) {
      setCustomerName(c.name);
      setAddress(c.address);
      setPhone(c.phone);
      if (c.installedUnit && c.installedUnit !== '-') {
        setProduct(c.installedUnit);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `SCH-${date.replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;

    const newSchedule: ScheduleItem = {
      id,
      customerId: customerId || `CUST-PROSP-${Date.now()}`,
      customerName,
      address,
      phone,
      type,
      product,
      date,
      time,
      notes,
      status: 'Belum Dikerjakan'
    };

    onSave(newSchedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Buat Jadwal Lapangan Teknisi</h3>
              <p className="text-xs text-slate-400">Sheet Jadwal_Service · Penugasan Sales ke Teknisi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Pilih Konsumen */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pilih dari Database Konsumen</label>
            <select
              value={customerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            >
              <option value="">-- Ketik manual atau pilih pelanggan yang ada --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Konsumen *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Konsumen"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / Telp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Alamat Pemasangan / Servis *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap lokasi kerja teknisi..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Jenis Pekerjaan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
              >
                <option value="Pemasangan">Pemasangan Unit Baru</option>
                <option value="Maintenance">Maintenance / Perawatan Rutin</option>
                <option value="Survei">Survei Kondisi Air & Jalur Pipa</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Produk Terkait / Jobdesk</label>
              <input
                type="text"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Contoh: M300 Automatic, Service Karbon, dll"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Estimasi Jam</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 - 12:00"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Keterangan / Instruksi Khusus Sales</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bawa kran bypass 1 inch, konfirmasi satpam cluster, dll"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none"
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
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
            >
              Jadwalkan Pekerjaan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
