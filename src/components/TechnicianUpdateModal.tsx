import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { CheckCircle2, Clock, X, Wrench, FileText } from 'lucide-react';

interface TechnicianUpdateModalProps {
  schedule: ScheduleItem | null;
  onClose: () => void;
  onSave: (id: string, status: ScheduleItem['status'], fieldNotes: string) => void;
  onOpenInvoice?: (schedule: ScheduleItem) => void;
}

export const TechnicianUpdateModal: React.FC<TechnicianUpdateModalProps> = ({
  schedule,
  onClose,
  onSave,
  onOpenInvoice
}) => {
  if (!schedule) return null;

  const [status, setStatus] = useState<ScheduleItem['status']>(schedule.status);
  const [fieldNotes, setFieldNotes] = useState<string>(schedule.fieldNotes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(schedule.id, status, fieldNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Update Jobdesk Teknisi</h3>
              <p className="text-xs text-slate-400">ID: {schedule.id} · {schedule.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Customer summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 text-sm">{schedule.customerName}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                schedule.type === 'Pemasangan'
                  ? 'bg-blue-100 text-blue-800'
                  : schedule.type === 'Survei'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {schedule.type}
              </span>
            </div>
            <p className="text-slate-600 text-xs">{schedule.address}</p>
            <div className="text-slate-700 font-medium pt-1">
              Produk / Job: <span className="text-blue-900 font-bold">{schedule.product}</span>
            </div>
            {schedule.notes && (
              <div className="text-slate-500 italic pt-1">
                Catatan Kantor/Sales: "{schedule.notes}"
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Status Pengerjaan</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Belum Dikerjakan')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  status === 'Belum Dikerjakan'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Clock className={`w-5 h-5 ${status === 'Belum Dikerjakan' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="font-semibold text-xs">Belum Dikerjakan</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('Selesai')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  status === 'Selesai'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${status === 'Selesai' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="font-semibold text-xs">Selesai Dikerjakan</span>
              </button>
            </div>
          </div>

          {/* Field Report Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Laporan Hasil Pengerjaan / Catatan Lapangan
            </label>
            <textarea
              rows={4}
              required={status === 'Selesai'}
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              placeholder="Contoh: Unit berhasil dipasang di samping toren dak atas. Hasil uji air TDS 65 ppm, jernih tidak berbau. Media filter terisi penuh. Garansi dijelaskan ke konsumen."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Laporan ini dapat langsung direview oleh tim Sales untuk presentasi atau penagihan pembayaran.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {schedule.invoiceNumber ? (
              <span className="text-[11px] text-slate-500 font-mono">
                No Inv: {schedule.invoiceNumber}
              </span>
            ) : status === 'Selesai' && onOpenInvoice ? (
              <button
                type="button"
                onClick={() => {
                  onSave(schedule.id, status, fieldNotes);
                  onOpenInvoice(schedule);
                  onClose();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Terbitkan Invoice Langsung
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors"
              >
                Simpan Laporan
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
