import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Calendar, CheckCircle2, Clock, MapPin, Phone, User, Wrench, Plus, Eye, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

interface JobdeskScheduleProps {
  schedules: ScheduleItem[];
  onUpdateStatus: (schedule: ScheduleItem) => void;
  onAddNewSchedule: () => void;
  onOpenInvoice?: (schedule: ScheduleItem) => void;
  onReviewResult?: (schedule: ScheduleItem) => void;
}

export const JobdeskSchedule: React.FC<JobdeskScheduleProps> = ({
  schedules,
  onUpdateStatus,
  onAddNewSchedule,
  onOpenInvoice,
  onReviewResult
}) => {
  // Reference date: 2026-09-30 (Today)
  const TODAY = '2026-09-30';
  const YESTERDAY = '2026-09-29';
  const TOMORROW = '2026-10-01';

  const [activeDateTab, setActiveDateTab] = useState<'today' | 'yesterday' | 'tomorrow' | 'all'>('today');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getFilteredSchedules = () => {
    return schedules.filter(item => {
      // Date filter
      if (activeDateTab === 'today' && item.date !== TODAY) return false;
      if (activeDateTab === 'yesterday' && item.date !== YESTERDAY) return false;
      if (activeDateTab === 'tomorrow' && item.date !== TOMORROW) return false;

      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;

      // Status filter
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;

      return true;
    });
  };

  const filtered = getFilteredSchedules();

  // Counts for quick badges
  const countToday = schedules.filter(s => s.date === TODAY).length;
  const countYesterday = schedules.filter(s => s.date === YESTERDAY).length;
  const countTomorrow = schedules.filter(s => s.date === TOMORROW).length;

  return (
    <div className="space-y-4">
      
      {/* Top Header & Date Segmented Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Jobdesk Teknisi & Jadwal Lapangan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring jadwal pemasangan unit baru & maintenance rutin untuk tim teknisi dan sales.
          </p>
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveDateTab('yesterday')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeDateTab === 'yesterday'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Kemarin (29 Sep)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200/80 rounded-full text-slate-700">
              {countYesterday}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDateTab('today')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeDateTab === 'today'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hari Ini (30 Sep)</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeDateTab === 'today' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {countToday}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDateTab('tomorrow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeDateTab === 'tomorrow'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Besok (01 Okt)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200/80 rounded-full text-slate-700">
              {countTomorrow}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDateTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeDateTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAddNewSchedule}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          + Buat Jadwal Baru
        </button>
      </div>

      {/* Filter and summary ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Filter Jenis:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
          >
            <option value="all">Semua Jenis Pekerjaan</option>
            <option value="Pemasangan">Pemasangan Unit Baru</option>
            <option value="Maintenance">Maintenance / Perawatan</option>
            <option value="Survei">Survei Lapangan</option>
          </select>

          <span className="ml-2">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Belum Dikerjakan">Belum Dikerjakan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Menampilkan <span className="font-bold text-slate-800">{filtered.length}</span> pekerjaan
        </div>
      </div>

      {/* List / Table of Schedules */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada jadwal untuk kriteria ini</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Gunakan tombol "Buat Jadwal Baru" untuk menjadwalkan pemasangan atau perawatan konsumen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((item) => {
            const isCompleted = item.status === 'Selesai';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                {/* Left zone: Customer, address, job type */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.customerName}</span>
                    
                    {/* Job Type Tag */}
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      item.type === 'Pemasangan'
                        ? 'bg-blue-100 text-blue-800'
                        : item.type === 'Survei'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.type}
                    </span>

                    {/* Completion Status Tag */}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {item.status}
                    </span>

                    {item.time && (
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.time}
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{item.address}</span>
                  </div>

                  {/* Product & Notes */}
                  <div className="text-xs text-slate-800 font-medium">
                    Pekerjaan: <span className="text-blue-900 font-bold">{item.product}</span>
                    {item.notes && (
                      <span className="text-slate-500 font-normal ml-2">
                        · "{item.notes}"
                      </span>
                    )}
                  </div>

                  {/* Invoice badge if present */}
                  {item.invoiceNumber && (
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <span className="font-mono text-blue-700 font-semibold">
                        Invoice: {item.invoiceNumber}
                      </span>
                    </div>
                  )}

                  {/* Field Notes Summary if completed */}
                  {item.fieldNotes && (
                    <div className="mt-2 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-700 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <span className="font-semibold text-slate-900">Hasil Pengerjaan: </span>
                        {item.fieldNotes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Zone: Action Controls */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  
                  {/* WhatsApp Quick Button */}
                  {item.phone && (
                    <a
                      href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1 font-medium transition-colors"
                      title="Hubungi Konsumen via WhatsApp"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      WhatsApp
                    </a>
                  )}

                  {/* Update Status by Technician */}
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Wrench className="w-3 h-3" />
                    {isCompleted ? 'Update Laporan' : 'Kerjakan / Selesai'}
                  </button>

                  {/* Review Hasil by Sales */}
                  {item.fieldNotes && onReviewResult && (
                    <button
                      type="button"
                      onClick={() => onReviewResult(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Review Hasil
                    </button>
                  )}

                  {/* Direct Invoice generation if completed and no invoice yet */}
                  {isCompleted && !item.invoiceNumber && onOpenInvoice && (
                    <button
                      type="button"
                      onClick={() => onOpenInvoice(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Terbitkan Invoice
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
