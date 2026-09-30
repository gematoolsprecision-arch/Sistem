import React from 'react';
import { ArrowRight, PhoneCall, ClipboardCheck, Wrench, CheckCircle2, FileText, Calendar, Repeat, Sparkles } from 'lucide-react';

interface FlowchartGuideProps {
  onNewProspect: () => void;
  onNewInstallation: () => void;
  onOpenMaintenanceForecast: () => void;
  onOpenInvoices: () => void;
}

export const FlowchartGuide: React.FC<FlowchartGuideProps> = ({
  onNewProspect,
  onNewInstallation,
  onOpenMaintenanceForecast,
  onOpenInvoices
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-3xl shadow-sm border border-slate-700/50">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Alur Kerja Operasional Lapangan (Sales & Teknisi)
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-white mt-0.5">
            PT. Master Sinergi Bersaudara
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Sistem terintegrasi dari prospek masuk, survei kualitas air, eksekusi pemasangan unit, penagihan invoice, hingga siklus perawatan berkala (4, 8, 12, 18 bulan).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onNewProspect}
            className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            + Input Prospek Baru
          </button>
          <button
            type="button"
            onClick={onOpenMaintenanceForecast}
            className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Repeat className="w-3.5 h-3.5" />
            Cek Siklus Perawatan
          </button>
        </div>
      </div>

      {/* 3 Interactive Workflow Lanes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        
        {/* Track 1: Prospek & Survei */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 flex items-center justify-center text-[11px]">1</span>
                Prospek & Survei
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tahap 1</span>
            </div>

            <div className="space-y-2.5 text-slate-300">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Input Prospek: </span>
                  Sales input calon pembeli dari Telp/WA ke database Calon Konsumen.
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <ClipboardCheck className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Jadwal & Hasil Survei: </span>
                  Teknisi survei air (TDS/pH/besi) & update laporan ke sistem agar sales siap presentasi penawaran.
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNewProspect}
            className="mt-4 w-full py-2 bg-slate-700/80 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
          >
            Mulai Prospek / Survei <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Track 2: Pemasangan & Penjualan */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-blue-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-500 text-blue-300 flex items-center justify-center text-[11px]">2</span>
                Pemasangan & Penjualan
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tahap 2</span>
            </div>

            <div className="space-y-2.5 text-slate-300">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Deal & Jadwal Pasang: </span>
                  Status diubah jadi Konsumen Resmi, sales jadwalkan pemasangan unit.
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Invoice PDF: </span>
                  Teknisi update selesai, sales terbitkan invoice (Non-PPN atau PPN 11%) & unduh PDF.
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNewInstallation}
            className="mt-4 w-full py-2 bg-slate-700/80 hover:bg-slate-700 text-blue-300 font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
          >
            Jadwalkan Pemasangan <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Track 3: Perawatan / Maintenance Rutin */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 flex items-center justify-center text-[11px]">3</span>
                Perawatan / Maintenance
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tahap 3</span>
            </div>

            <div className="space-y-2.5 text-slate-300">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <Repeat className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Pantau Siklus: </span>
                  Sistem deteksi interval 4, 8, atau 18 bulan berdasarkan produk terpasang.
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2">
                <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Eksekusi & Tagihan: </span>
                  Teknisi eksekusi cuci media / ganti part, lalu sales menagih pembayaran.
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMaintenanceForecast}
            className="mt-4 w-full py-2 bg-slate-700/80 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
          >
            Pantau Konsumen Jatuh Tempo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
