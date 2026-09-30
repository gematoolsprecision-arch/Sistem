import React, { useState } from 'react';
import { Customer } from '../types';
import { Users, X } from 'lucide-react';

interface CustomerModalProps {
  customer: Customer | null; // null for new
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customer,
  onClose,
  onSave,
}) => {
  const isEditing = !!customer;

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [type, setType] = useState<Customer['type']>(customer?.type || 'Rumah Tangga');
  const [status, setStatus] = useState<Customer['status']>(customer?.status || 'Calon Konsumen');
  const [installedUnit, setInstalledUnit] = useState(customer?.installedUnit || '-');
  const [firstInstallDate, setFirstInstallDate] = useState(customer?.firstInstallDate || '-');
  const [waterSource, setWaterSource] = useState(customer?.waterSource || 'Air Tanah (Sumur)');
  const [waterIssue, setWaterIssue] = useState(customer?.waterIssue || '');
  const [notes, setNotes] = useState(customer?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = customer?.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer: Customer = {
      id,
      name,
      phone,
      address,
      type,
      status,
      installedUnit: status === 'Konsumen Resmi' ? installedUnit : '-',
      firstInstallDate: status === 'Konsumen Resmi' ? (firstInstallDate === '-' ? new Date().toISOString().split('T')[0] : firstInstallDate) : '-',
      waterSource,
      waterIssue,
      notes,
      surveyReport: customer?.surveyReport
    };

    onSave(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isEditing ? 'Edit Data Konsumen' : 'Tambah Calon Konsumen / Konsumen Baru'}
              </h3>
              <p className="text-xs text-slate-400">Sheet Customers · Database Pelanggan MSB</p>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Konsumen *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bapak Daniel / Ibu Susan"
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
                placeholder="Contoh: 08123456789"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat rumah / ruko / proyek instalasi..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tipe Konsumen</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Rumah Tangga">Rumah Tangga</option>
                <option value="Industri / Komersial">Industri / Komersial</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status Prospek / Konsumen</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
              >
                <option value="Calon Konsumen">Calon Konsumen (Perlu Survei / Negosiasi)</option>
                <option value="Konsumen Resmi">Konsumen Resmi (Sudah Deal / Terpasang)</option>
              </select>
            </div>
          </div>

          {/* Conditional installed unit if official customer */}
          {status === 'Konsumen Resmi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
              <div>
                <label className="block text-blue-900 font-semibold mb-1">Unit Terpasang</label>
                <input
                  type="text"
                  value={installedUnit}
                  onChange={(e) => setInstalledUnit(e.target.value)}
                  placeholder="Contoh: M300 Automatic, TOCLAS TW 200"
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-blue-900 font-semibold mb-1">Tgl Pemasangan Pertama</label>
                <input
                  type="date"
                  value={firstInstallDate === '-' ? '' : firstInstallDate}
                  onChange={(e) => setFirstInstallDate(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sumber Air Baku</label>
              <input
                type="text"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                placeholder="Air Tanah / PAM / WTP"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Keluhan / Masalah Air</label>
              <input
                type="text"
                value={waterIssue}
                onChange={(e) => setWaterIssue(e.target.value)}
                placeholder="Keruh, berbau besi, berkapur, dll"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Catatan Tambahan Sales</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan kebutuhan, preferensi jam kunjungan, dll..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none"
            />
          </div>

          {/* Buttons */}
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
              {isEditing ? 'Simpan Perubahan' : 'Simpan Konsumen'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
