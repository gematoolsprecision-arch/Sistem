import React, { useState } from 'react';
import { Customer } from '../types';
import { ClipboardCheck, CheckCircle2, X, ArrowRight, User, Droplets } from 'lucide-react';

interface ProspectsSurveyModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSaveSurvey: (customerId: string, surveyData: NonNullable<Customer['surveyReport']>) => void;
  onConvertToOfficial: (customer: Customer) => void;
}

export const ProspectsSurveyModal: React.FC<ProspectsSurveyModalProps> = ({
  customer,
  onClose,
  onSaveSurvey,
  onConvertToOfficial
}) => {
  if (!customer) return null;

  const [date, setDate] = useState(customer.surveyReport?.date || '2026-09-30');
  const [waterTds, setWaterTds] = useState(customer.surveyReport?.waterTds || '210 ppm');
  const [waterPh, setWaterPh] = useState(customer.surveyReport?.waterPh || '6.8');
  const [waterIssue, setWaterIssue] = useState(customer.surveyReport?.waterIssue || customer.waterIssue || 'Air tanah keruh dan berbau besi halus.');
  const [recommendation, setRecommendation] = useState(
    customer.surveyReport?.recommendation || 'Disarankan pemasangan unit filter M300 Automatic dengan Media Carbon Aktif & Sand Silica.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSurvey(customer.id, {
      date,
      waterTds,
      waterPh,
      waterIssue,
      recommendation,
      status: 'Survei Selesai',
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Laporan Hasil Survei Lapangan</h3>
              <p className="text-xs text-slate-400">Analisis Kualitas Air untuk Presentasi Sales ke Calon Konsumen</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Customer info preview */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3.5 space-y-1">
            <div className="font-bold text-purple-950 text-sm">{customer.name}</div>
            <div className="text-slate-600">{customer.address}</div>
            <div className="text-slate-500 font-mono text-[11px]">Telp/WA: {customer.phone} · Tipe: {customer.type}</div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tanggal Survei</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>

          {/* Water Test Parameters */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-600" />
              Hasil Uji Fisik & Kimia Air Baku
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Total Dissolved Solids (TDS)</label>
                <input
                  type="text"
                  value={waterTds}
                  onChange={(e) => setWaterTds(e.target.value)}
                  placeholder="Contoh: 180 ppm"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Derajat Keasaman (pH)</label>
                <input
                  type="text"
                  value={waterPh}
                  onChange={(e) => setWaterPh(e.target.value)}
                  placeholder="Contoh: 6.8"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Karakteristik & Keluhan Masalah Air</label>
              <input
                type="text"
                value={waterIssue}
                onChange={(e) => setWaterIssue(e.target.value)}
                placeholder="Contoh: Bau lumpur pekat, noda kuning pada wastafel, pasir halus..."
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Rekomendasi Unit & Solusi Penjualan</label>
            <textarea
              rows={3}
              required
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Rekomendasi spesifikasi unit filter, media, pompa pendorong untuk presentasi sales..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {customer.status === 'Calon Konsumen' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConvertToOfficial(customer);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
              >
                Konsumen Deal (Jadikan Resmi) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
              >
                Simpan Hasil Survei
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
