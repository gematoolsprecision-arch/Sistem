import React, { useState } from 'react';
import { MasterProduct } from '../types';
import { Package, Plus, Search, Edit, Trash2, Calendar, Tag } from 'lucide-react';

interface MasterProductsViewProps {
  products: MasterProduct[];
  onAddProduct: () => void;
  onEditProduct: (product: MasterProduct) => void;
  onDeleteProduct: (id: string) => void;
}

export const MasterProductsView: React.FC<MasterProductsViewProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Katalog Master Produk & Layanan (Master_Products)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar harga unit penjernih air, media filter, suku cadang, dan siklus interval perawatan (maintenance).
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProduct}
          className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          + Tambah Produk / Item Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk, sparepart, media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Semua Kategori ({products.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({products.filter(p => p.category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Produk / Jasa</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Interval Perawatan</th>
                <th className="py-3 px-4 text-right">Harga Resmi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada produk yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      {product.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-md">
                          {product.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {product.intervalMonths > 0 ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[11px]">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          Setiap {product.intervalMonths} Bulan
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Sekali Pasang</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatRupiah(product.price)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
