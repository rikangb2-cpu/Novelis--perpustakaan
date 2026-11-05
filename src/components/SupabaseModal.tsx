import React, { useState } from 'react';
import { Novel, UserProfile } from '../types/novel';
import { SUPABASE_SQL_SCHEMA, exportLibraryToSupabaseJson } from '../utils/supabaseHelper';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Server, 
  ShieldCheck, 
  FolderArchive,
  Code2
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  novels,
  profile,
  onUpdateProfile
}) => {
  if (!isOpen) return null;

  const [copiedSql, setCopiedSql] = useState(false);
  const [downloadedJson, setDownloadedJson] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(profile.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(profile.supabaseAnonKey || '');
  const [activeTab, setActiveTab] = useState<'guide' | 'sql' | 'config'>('guide');
  const [savedSettings, setSavedSettings] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonStr = exportLibraryToSupabaseJson(novels);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `novelia_supabase_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedJson(true);
    setTimeout(() => setDownloadedJson(false), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Integrasi Cloud Supabase
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyimpanan Database & PDF Cloud untuk NOVELIA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Panduan & Ekspor
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Skrip SQL Supabase
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Kredensial API
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
                <span className="font-bold block text-sm mb-1 text-emerald-900">
                  ⚡ Siap Diintegrasikan dengan Supabase
                </span>
                Aplikasi ini telah dirancang 100% kompatibel dengan arsitektur Supabase PostgreSQL dan Supabase Storage untuk file PDF novel Anda.
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Jalankan Skrip SQL di Supabase</h5>
                    <p className="text-slate-600 mt-0.5">
                      Buka dashboard project Supabase Anda, masuk ke menu <strong>SQL Editor</strong>, dan tempelkan skrip dari tab <em>"Skrip SQL Supabase"</em> di atas.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Buat Bucket Storage PDF</h5>
                    <p className="text-slate-600 mt-0.5">
                      Di Supabase Dashboard, pilih menu <strong>Storage</strong>, lalu klik <em>"New Bucket"</em> dan beri nama <code>novel-pdfs</code>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Ekspor Data Koleksi Novel Anda</h5>
                    <p className="text-slate-600 mt-0.5">
                      Unduh file JSON berisi semua novel, riwayat membaca, dan kutipan Anda yang siap di-insert ke Supabase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleDownloadJson}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadedJson ? 'File JSON Terunduh!' : 'Unduh JSON Data Perpustakaan'}</span>
                </button>

                <button
                  onClick={handleCopySql}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedSql ? 'SQL Tersalin!' : 'Salin Skrip SQL'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Skrip Tabel & Kebijakan RLS:
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Semua Skrip'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96 border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <p className="text-xs text-slate-600">
                Masukkan Project URL dan Anon Key Supabase Anda untuk menyimpan koneksi langsung ke cloud:
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{savedSettings ? 'Kredensial Tersimpan!' : 'Simpan Kredensial Supabase'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
