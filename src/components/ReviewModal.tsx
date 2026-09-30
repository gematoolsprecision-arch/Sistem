import React from 'react';
import { ScheduleItem } from '../types';
import { Eye, CheckCircle2, Clock, MapPin, User, FileText, X } from 'lucide-react';

interface ReviewModalProps {
  schedule: ScheduleItem | null;
  onClose: () => void;
  onOpenInvoice?: (schedule: ScheduleItem) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  schedule,
  onClose,
  onOpenInvoice
}) => {
  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Review Hasil Pengerjaan / Survei</h3>
              <p className="text-xs text-slate-400">Verifikasi Laporan Lapangan Teknisi untuk Sales & Manajemen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            schedule.status === 'Selesai'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {schedule.status === 'Selesai' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
              <span>Status: {schedule.status}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              {schedule.date} {schedule.time ? `(${schedule.time})` : ''}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div>
              <span className="text-slate-500">Konsumen:</span>
              <div className="font-bold text-slate-900 text-sm">{schedule.customerName}</div>
            </div>

            <div>
              <span className="text-slate-500">Alamat:</span>
              <div className="text-slate-700 flex items-start gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{schedule.address}</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              <span className="text-slate-500">Jenis Pekerjaan:</span>
              <div className="font-semibold text-slate-800">{schedule.type}</div>
            </div>

            <div className="pt-1">
              <span className="text-slate-500">Produk / Jobdesk:</span>
              <div className="font-bold text-blue-900">{schedule.product}</div>
            </div>

            {schedule.notes && (
              <div className="pt-1">
                <span className="text-slate-500">Instruksi Awal:</span>
                <div className="text-slate-600 italic">"{schedule.notes}"</div>
              </div>
            )}
          </div>

          {/* Laporan Hasil Lapangan */}
          <div>
            <div className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Laporan Hasil & Catatan Pengerjaan di Lapangan
            </div>
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 text-slate-800 leading-relaxed text-xs font-sans">
              {schedule.fieldNotes || (
                <span className="text-slate-400 italic">Belum ada laporan catatan yang diinputkan.</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {schedule.status === 'Selesai' && !schedule.invoiceNumber && onOpenInvoice ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInvoice(schedule);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                Terbitkan Invoice Pelanggan
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors ml-auto"
            >
              Tutup Review
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
