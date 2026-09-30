import React, { useState } from 'react';
import { Customer } from '../types';
import { Users, UserPlus, Search, Phone, MapPin, Calendar, CheckCircle2, Clock, Wrench, ArrowRight, Edit, Trash2 } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onConvertToOfficial: (customer: Customer) => void;
  onScheduleJob: (customer: Customer, type: 'Pemasangan' | 'Maintenance' | 'Survei') => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onConvertToOfficial,
  onScheduleJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Konsumen Resmi' | 'Calon Konsumen'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Rumah Tangga' | 'Industri / Komersial'>('all');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.installedUnit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Data Pelanggan & Calon Konsumen (Customers)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen database calon pembeli (prospek survei) dan konsumen terpasang resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddCustomer}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Tambah Konsumen / Prospek Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, ID, alamat, unit filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Konsumen Resmi">Konsumen Resmi (Deal)</option>
            <option value="Calon Konsumen">Calon Konsumen (Prospek)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="Rumah Tangga">Rumah Tangga</option>
            <option value="Industri / Komersial">Industri / Komersial</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] ml-1">
            Total: {filteredCustomers.length}
          </span>
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Nama Konsumen</th>
                <th className="py-3 px-4">Kontak & Alamat</th>
                <th className="py-3 px-4">Unit Terpasang</th>
                <th className="py-3 px-4">Tgl Pasang / Survei</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data konsumen dengan filter ini.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const isOfficial = customer.status === 'Konsumen Resmi';
                  const waNumber = customer.phone.replace(/[^0-9]/g, '').replace(/^0/, '62');

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        {customer.id}
                      </td>

                      {/* Name & Type */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {customer.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{customer.type}</span>
                          {customer.waterSource && (
                            <>
                              <span>·</span>
                              <span>{customer.waterSource}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Phone & Address */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 text-slate-800 font-mono font-medium">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{customer.phone || '-'}</span>
                          {customer.phone && (
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded hover:bg-emerald-100"
                              title="Chat WhatsApp"
                            >
                              WA
                            </a>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {customer.installedUnit || '-'}
                        </div>
                        {customer.waterIssue && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            Masalah: {customer.waterIssue}
                          </div>
                        )}
                      </td>

                      {/* Install Date */}
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {customer.firstInstallDate !== '-' ? customer.firstInstallDate : (
                          customer.surveyReport?.date ? (
                            <span className="text-purple-700">Survei: {customer.surveyReport.date}</span>
                          ) : '-'
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          isOfficial
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {isOfficial ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-purple-600" />
                          )}
                          {customer.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If Calon Konsumen, option to Convert or Schedule Survey */}
                          {!isOfficial ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onScheduleJob(customer, 'Survei')}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-medium"
                                title="Jadwalkan Survei Teknisi"
                              >
                                Jadwal Survei
                              </button>
                              <button
                                type="button"
                                onClick={() => onConvertToOfficial(customer)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                                title="Calon Konsumen Deal -> Jadikan Konsumen Resmi"
                              >
                                Deal Pemasangan <ArrowRight className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onScheduleJob(customer, 'Maintenance')}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-medium flex items-center gap-1"
                                title="Jadwalkan Perawatan Berkala"
                              >
                                <Wrench className="w-3 h-3" />
                                Maintenance
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => onEditCustomer(customer)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                            title="Edit Data Konsumen"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteCustomer(customer.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
