import React, { useState } from 'react';
import { Customer, MasterProduct } from '../types';
import { Wrench, Calendar, Phone, ArrowRight, X, AlertCircle, Clock, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface MaintenanceForecastModalProps {
  customers: Customer[];
  products: MasterProduct[];
  onClose: () => void;
  onScheduleMaintenance: (customer: Customer, recommendedService: string) => void;
}

export const MaintenanceForecastModal: React.FC<MaintenanceForecastModalProps> = ({
  customers,
  products,
  onClose,
  onScheduleMaintenance
}) => {
  // Default to September 2026 (simulation time)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 1 = Jan, 9 = Sep

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to parse YYYY-MM-DD
  const parseDate = (dStr?: string) => {
    if (!dStr || dStr === '-') return null;
    const parts = dStr.split('-');
    if (parts.length < 2) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    return { year, month };
  };

  // Helper to check if a target month/year matches an interval cycle from a start month/year
  const getCycleMatch = (startYear: number, startMonth: number, targetYear: number, targetMonth: number, intervalMonths: number) => {
    const totalMonthsDiff = (targetYear - startYear) * 12 + (targetMonth - startMonth);
    if (totalMonthsDiff <= 0) return null;
    if (totalMonthsDiff % intervalMonths === 0) {
      return Math.floor(totalMonthsDiff / intervalMonths);
    }
    return null;
  };

  // Filter products requiring 4 & 18 months special rule
  const isSpecial4and18 = (unitName: string) => {
    const u = unitName.toUpperCase();
    return (
      u.includes('OH300 E') ||
      u.includes('M300 MANUAL') ||
      u.includes('M300 AUTOMATIC') ||
      u.includes('M300 SC') ||
      u.includes('M200')
    );
  };

  // Compute maintenance candidates for the selected month/year
  const dueCandidates = customers
    .filter(c => c.status === 'Konsumen Resmi')
    .map(c => {
      // Base date: check lastServiceDate or firstInstallDate
      const baseDateStr = c.lastServiceDate || c.firstInstallDate;
      const baseParsed = parseDate(baseDateStr);

      if (!baseParsed) return null;

      const unit = c.installedUnit || '';
      const dueServices: { service: string; cycleType: 'routine-4' | 'sand-18' | 'standard'; cycleNumber: number }[] = [];

      if (isSpecial4and18(unit)) {
        // 1. Check 4-month routine service
        const cycle4 = getCycleMatch(baseParsed.year, baseParsed.month, selectedYear, selectedMonth, 4);
        if (cycle4 !== null) {
          dueServices.push({
            service: 'Service = Carbon Aktif Powder dan pencucian cloth filter',
            cycleType: 'routine-4',
            cycleNumber: cycle4
          });
        }

        // 2. Check 18-month sand replacement
        const installParsed = parseDate(c.lastSandChangeDate || c.firstInstallDate);
        if (installParsed) {
          const cycle18 = getCycleMatch(installParsed.year, installParsed.month, selectedYear, selectedMonth, 18);
          if (cycle18 !== null) {
            dueServices.push({
              service: 'Pergantian Pasir Sand (Media Sand Silica & Pasir Aktif)',
              cycleType: 'sand-18',
              cycleNumber: cycle18
            });
          }
        }
      } else {
        // Standard products (e.g. Toclas 12 bulan, MAF 6 bulan, Solahart 12 bulan)
        let interval = 12;
        let defaultService = 'Perawatan Berkala & Penggantian Filter';

        const u = unit.toLowerCase();
        if (u.includes('toclas')) {
          interval = 12;
          defaultService = 'Penggantian CARTRIDGE TOCLAS & Pembersihan Tabung';
        } else if (u.includes('solahart')) {
          interval = 12;
          defaultService = 'Service Solahart (Kuras Tangki & Inspeksi Anoda)';
        } else if (u.includes('maf')) {
          interval = 6;
          defaultService = 'Backwash Besar & Inspeksi Media Filter MAF';
        }

        const cycle = getCycleMatch(baseParsed.year, baseParsed.month, selectedYear, selectedMonth, interval);
        if (cycle !== null) {
          dueServices.push({
            service: defaultService,
            cycleType: 'standard',
            cycleNumber: cycle
          });
        }
      }

      if (dueServices.length === 0) return null;

      return {
        customer: c,
        baseDateStr,
        dueServices
      };
    })
    .filter(Boolean) as {
      customer: Customer;
      baseDateStr: string;
      dueServices: { service: string; cycleType: 'routine-4' | 'sand-18' | 'standard'; cycleNumber: number }[];
    }[];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Siklus Perawatan Otomatis Berdasarkan Interval Produk
              </h3>
              <p className="text-xs text-slate-400">
                Mengikuti tanggal terakhir perawatan / pemasangan (Interval 4 Bulan Rutin & 18 Bulan Pasir Sand)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month & Year Selection Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-800">Pilih Periode Bulan & Tahun:</span>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-blue-900 focus:outline-none"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none font-mono"
            >
              {[2015, 2016, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027].map(yr => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 mr-1">Pilih Bulan:</span>
            <button
              type="button"
              onClick={() => { setSelectedMonth(9); setSelectedYear(2026); }}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                selectedMonth === 9 && selectedYear === 2026
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Bulan Ini (Sep 2026)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedMonth(10); setSelectedYear(2026); }}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                selectedMonth === 10 && selectedYear === 2026
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Okt 2026
            </button>
            <button
              type="button"
              onClick={() => { setSelectedMonth(11); setSelectedYear(2026); }}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                selectedMonth === 11 && selectedYear === 2026
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Nov 2026
            </button>
            <button
              type="button"
              onClick={() => { setSelectedMonth(12); setSelectedYear(2026); }}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                selectedMonth === 12 && selectedYear === 2026
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Des 2026
            </button>
            <button
              type="button"
              onClick={() => { setSelectedMonth(1); setSelectedYear(2027); }}
              className={`px-2.5 py-1 rounded-md font-semibold ${
                selectedMonth === 1 && selectedYear === 2027
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Jan 2027
            </button>
          </div>

        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Explanation Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-amber-950 leading-relaxed">
              <span className="font-bold">Logika Siklus Otomatis: </span>
              Menampilkan konsumen yang masuk jadwal servis di bulan <strong>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</strong>.
              Untuk produk <em>OH300 E, M300 MANUAL, M300 AUTOMATIC, M300 AUTOMATIC BERKAPUR</em>, sistem otomatis menghitung <strong>Siklus Rutin 4 Bulan</strong> (Karbon & cloth filter) dan <strong>Siklus Khusus 18 Bulan</strong> (Pergantian Pasir Sand).
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
            <span>Daftar Konsumen Jatuh Tempo ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})</span>
            <span className="font-bold text-slate-800">{dueCandidates.length} Pelanggan</span>
          </div>

          {dueCandidates.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="font-bold text-slate-800 text-sm">Tidak ada jadwal jatuh tempo di bulan {MONTH_NAMES[selectedMonth - 1]} {selectedYear}</div>
              <p className="text-slate-500 text-xs mt-1">
                Silakan ganti pilihan bulan atau gunakan tombol contoh di atas untuk melihat siklus bulan lainnya.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {dueCandidates.map(({ customer, baseDateStr, dueServices }) => {
                const waNumber = customer.phone.replace(/[^0-9]/g, '').replace(/^0/, '62');

                return (
                  <div key={customer.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{customer.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{customer.id}</span>
                        
                        {/* Service Badges */}
                        {dueServices.map((ds, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              ds.cycleType === 'sand-18'
                                ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                : ds.cycleType === 'routine-4'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {ds.cycleType === 'sand-18' ? '★ Ganti Pasir Sand (18 Bln)' : '✓ Rutin 4 Bulan'}
                          </span>
                        ))}
                      </div>

                      <p className="text-slate-600 text-xs">{customer.address}</p>

                      <div className="text-xs text-slate-800">
                        Unit Terpasang: <span className="font-semibold text-blue-900">{customer.installedUnit}</span>
                        <span className="text-slate-400 mx-2">·</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Terakhir Pasang/Servis: {baseDateStr}
                        </span>
                      </div>

                      <div className="space-y-0.5 pt-1">
                        {dueServices.map((ds, i) => (
                          <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>Jatuh Tempo: <strong>{ds.service}</strong> (Siklus ke-{ds.cycleNumber})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                      {customer.phone && (
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                            `Halo ${customer.name}, kami dari PT. Master Sinergi Bersaudara. Menginfokan bahwa unit ${customer.installedUnit} Anda sudah memasuki jadwal perawatan berkala (${dueServices.map(d => d.service).join(' & ')}) untuk bulan ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}. Apakah kami bisa jadwalkan kunjungan tim ke lokasi Anda? Terima kasih.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Hubungi Konsumen via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          Chat WA
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const primaryService = dueServices[0]?.service || 'Maintenance Rutin';
                          onScheduleMaintenance(customer, primaryService);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Jadwalkan
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
