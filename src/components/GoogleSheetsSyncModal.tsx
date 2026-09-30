import React, { useState } from 'react';
import { Customer, InvoiceTransaction, MasterProduct, ScheduleItem } from '../types';
import { googleSheetsService } from '../services/googleSheetsService';
import { googleSignIn, googleLogout } from '../services/googleAuth';
import { User } from 'firebase/auth';
import { FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, LogOut, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface GoogleSheetsSyncModalProps {
  currentUser: User | null;
  onClose: () => void;
  onUserChange: (user: User | null) => void;
  transactions: InvoiceTransaction[];
  schedules: ScheduleItem[];
  customers: Customer[];
  products: MasterProduct[];
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  currentUser,
  onClose,
  onUserChange,
  transactions,
  schedules,
  customers,
  products
}) => {
  const [spreadsheetInput, setSpreadsheetInput] = useState(googleSheetsService.getSpreadsheetId());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        setMessage({ type: 'success', text: `Berhasil login sebagai ${res.user.email}` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal login Google.' });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await googleLogout();
    onUserChange(null);
    setMessage({ type: 'success', text: 'Telah logout dari Google.' });
  };

  const handleSaveSpreadsheetId = () => {
    if (!spreadsheetInput.trim()) {
      googleSheetsService.clearSpreadsheetId();
      setMessage({ type: 'success', text: 'ID Spreadsheet dibersihkan.' });
      return;
    }
    const cleanId = googleSheetsService.setSpreadsheetId(spreadsheetInput);
    setSpreadsheetInput(cleanId);
    setMessage({ type: 'success', text: `Tersambung ke Spreadsheet ID: ${cleanId}` });
  };

  const handleSyncAll = async () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Silakan login dengan Akun Google terlebih dahulu.' });
      return;
    }
    if (!spreadsheetInput.trim()) {
      setMessage({ type: 'error', text: 'Masukkan ID atau URL Google Spreadsheet Anda.' });
      return;
    }

    const cleanId = googleSheetsService.setSpreadsheetId(spreadsheetInput);
    setSpreadsheetInput(cleanId);

    setIsSyncing(true);
    setMessage(null);
    try {
      await googleSheetsService.syncAllToSpreadsheet(transactions, schedules, customers, products);
      setMessage({
        type: 'success',
        text: 'Semua sheet (Transaksi, Jadwal_Service, Customers, Master_Products) berhasil disinkronkan ke Google Spreadsheet Anda!'
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Gagal menyinkronkan data. Pastikan spreadsheet memiliki izin edit untuk akun Anda.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const currentSheetId = googleSheetsService.getSpreadsheetId();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Integrasi Google Sheets Langsung</h3>
              <p className="text-xs text-slate-400">Sinkronisasi otomatis aplikasi ke Google Spreadsheet online</p>
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
        <div className="p-6 space-y-4">
          
          {/* Status Alert */}
          {message && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{message.text}</span>
            </div>
          )}

          {/* 1. Google Authentication Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">1. Akun Google Terhubung</span>
              {currentUser ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Terhubung
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-700">
                  Belum Login
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{currentUser.displayName || currentUser.email}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 mb-2 leading-relaxed">
                  Hubungkan dengan Akun Google Anda untuk memberikan izin akses membaca dan menulis data ke Google Spreadsheet Anda.
                </p>
                {/* Official Material Google Sign-in Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Google Spreadsheet Link / ID */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="font-bold text-slate-900 text-sm">2. Link / ID Google Spreadsheet Anda</div>
            <p className="text-slate-600 leading-relaxed">
              Buka Google Sheets Anda di browser, lalu copy link (URL) dari address bar atau copy ID unik spreadsheet Anda:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={spreadsheetInput}
                onChange={(e) => setSpreadsheetInput(e.target.value)}
                placeholder="Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs0XR... atau ID spreadsheet"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveSpreadsheetId}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors shrink-0"
              >
                Simpan Link
              </button>
            </div>

            {currentSheetId && (
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Spreadsheet Aktif: <strong className="font-mono text-emerald-800">{currentSheetId}</strong></span>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${currentSheetId}/edit`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  Buka di Google Sheets <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* 3. Sinkronisasi Data Penuh */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-emerald-950 text-sm">3. Sinkronkan Seluruh Data Sekarang</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              Sistem akan otomatis membuat/memperbarui 4 tab lembar kerja di spreadsheet Anda:
              <strong> Transaksi</strong>, <strong>Jadwal_Service</strong>, <strong>Customers</strong>, dan <strong>Master_Products</strong>.
            </p>

            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncing || !currentUser || !spreadsheetInput.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sedang Mengunggah Data ke Google Sheets...' : 'Sinkronkan Semua Data ke Google Sheets'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
