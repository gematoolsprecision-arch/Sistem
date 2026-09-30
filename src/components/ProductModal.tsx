import React, { useState } from 'react';
import { MasterProduct } from '../types';
import { Package, X } from 'lucide-react';

interface ProductModalProps {
  product: MasterProduct | null;
  onClose: () => void;
  onSave: (product: MasterProduct) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<MasterProduct['category']>(product?.category || 'Unit Filter');
  const [intervalMonths, setIntervalMonths] = useState<number>(product?.intervalMonths || 0);
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [description, setDescription] = useState(product?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = product?.id || `PROD-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct: MasterProduct = {
      id,
      name,
      category,
      intervalMonths: Number(intervalMonths) || 0,
      price: Number(price) || 0,
      description
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isEditing ? 'Edit Master Produk' : 'Tambah Master Produk Baru'}
              </h3>
              <p className="text-xs text-slate-400">Sheet Master_Products · Katalog & Siklus Service</p>
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
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nama Produk / Layanan *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: M300 Automatic, Cartridge TOCLAS, dll"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kategori Produk</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Unit Filter">Unit Filter</option>
                <option value="Sparepart">Sparepart / Suku Cadang</option>
                <option value="Media Filter">Media Filter</option>
                <option value="Service & Maintenance">Service & Maintenance</option>
                <option value="Pemanas Air Solar">Pemanas Air Solar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Interval Perawatan (Bulan)</label>
              <input
                type="number"
                min="0"
                value={intervalMonths}
                onChange={(e) => setIntervalMonths(parseInt(e.target.value) || 0)}
                placeholder="Contoh: 4, 8, 12, 18 (0 jika bukan siklus)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                4 bln: cuci media/karbon, 8 bln: softener, 12 bln: pasir/cartridge, 18 bln: packing.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Harga Resmi (Rp) *</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder="Contoh: 24500000"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Deskripsi & Spesifikasi Produk</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spesifikasi debit, material, keunggulan, petunjuk garansi..."
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
