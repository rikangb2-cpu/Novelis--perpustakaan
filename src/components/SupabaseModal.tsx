import React, { useState, useEffect } from 'react';
import { Novel, UserProfile } from '../types/novel';
import { SUPABASE_SQL_SCHEMA, exportLibraryToSupabaseJson } from '../utils/supabaseHelper';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection, 
  syncAllLocalNovelsToSupabase,
  fetchNovelsFromSupabase
} from '../services/supabaseClient';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  Download, 
  Server, 
  ShieldCheck, 
  Cloud,
  CloudCheck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Code2,
  FileUp,
  FolderOpen
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onCloudSyncSuccess?: (fetchedNovels: Novel[]) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  novels,
  profile,
  onUpdateProfile,
  onCloudSyncSuccess
}) => {
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url || profile.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialCreds.anonKey || profile.supabaseAnonKey || '');
  
  const [activeTab, setActiveTab] = useState<'config' | 'sync' | 'sql' | 'guide'>('config');
  const [copiedSql, setCopiedSql] = useState(false);
  const [downloadedJson, setDownloadedJson] = useState(false);

  // Testing & Sync states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    novelCount?: number;
    tablesReady?: boolean;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Test connection on mount if credentials exist
  useEffect(() => {
    if (initialCreds.url && initialCreds.anonKey) {
      testSupabaseConnection().then((res) => {
        setTestResult(res);
      });
    }
  }, []);

  if (!isOpen) return null;

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

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
      setTestResult(result);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Gagal menghubungi server Supabase'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    onUpdateProfile({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });

    // Run connection test
    await handleTestConnection();
  };

  const handlePushToCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncAllLocalNovelsToSupabase(novels);
      setSyncStatusMsg(res.message);
      if (res.success) {
        // Refresh test count
        const testRes = await testSupabaseConnection();
        setTestResult(testRes);
      }
    } catch (err: any) {
      setSyncStatusMsg(`Gagal sinkronisasi: ${err?.message || 'Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCredentials = () => {
    if (confirm('Apakah Anda yakin ingin memutuskan koneksi Supabase?')) {
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      saveSupabaseCredentials('', '');
      onUpdateProfile({ supabaseUrl: '', supabaseAnonKey: '' });
      setTestResult(null);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const cloudNovels = await fetchNovelsFromSupabase();
      if (cloudNovels && cloudNovels.length > 0) {
        if (onCloudSyncSuccess) {
          onCloudSyncSuccess(cloudNovels);
        }
        setSyncStatusMsg(`Berhasil mengunduh ${cloudNovels.length} novel dari database cloud!`);
      } else {
        setSyncStatusMsg('Belum ada novel di cloud Supabase. Silakan unggah novel lokal terlebih dahulu.');
      }
    } catch (err: any) {
      setSyncStatusMsg(`Gagal mengambil data dari Supabase: ${err?.message || 'Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const isConnected = testResult?.success === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs transition-colors ${
              isConnected ? 'bg-emerald-600' : 'bg-slate-800'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Koneksi Database Supabase
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isConnected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isConnected ? 'Terhubung' : 'Penyimpanan Lokal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Database PostgreSQL & Penyimpanan PDF Cloud untuk NOVELIA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-4 bg-slate-50 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Kredensial API</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Sinkronisasi Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skrip SQL Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panduan & PDF</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">

          {/* TAB 1: KREDENSIAL API */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Hubungkan NOVELIA langsung ke project Supabase Anda. Masukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> yang dapat ditemukan di: 
                <span className="block mt-1 font-mono text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  Supabase Dashboard &rarr; Project Settings &rarr; API
                </span>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  {testResult.success ? (
                    <CloudCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{testResult.success ? 'Koneksi Berhasil!' : testResult.tablesReady === false ? 'Koneksi API Berhasil (Tabel Belum Ada)' : 'Koneksi Belum Berhasil'}</p>
                    <p className="mt-0.5 text-[11px] opacity-90">{testResult.message}</p>
                    {testResult.tablesReady === false && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('sql')}
                        className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Buka Skrip SQL & Salin Sekarang &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: https://[project-id].supabase.co
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <textarea
                    rows={3}
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono text-[11px] transition-colors resize-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gunakan anon public key (aman untuk client-side aplikasi).
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !supabaseUrl || !supabaseAnonKey}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Memeriksa...' : 'Tes Koneksi'}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Terapkan Kredensial</span>
                  </button>
                </div>

                {(supabaseUrl || supabaseAnonKey) && (
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={handleClearCredentials}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2 cursor-pointer transition-colors"
                    >
                      Putuskan Koneksi & Hapus Kredensial
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: SINKRONISASI CLOUD */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Status Sinkronisasi Cloud
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Koleksi Lokal: <strong>{novels.length} Novel</strong> · Cloud: <strong>{testResult?.novelCount ?? 'Belum dicek'} Novel</strong>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Cloud className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {syncStatusMsg && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium">
                  {syncStatusMsg}
                </div>
              )}

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Unggah Koleksi Lokal ke Supabase
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Kirim {novels.length} novel, riwayat baca, dan kutipan ke database cloud.
                    </p>
                  </div>
                  <button
                    onClick={handlePushToCloud}
                    disabled={isSyncing || !isConnected}
                    className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>{isSyncing ? 'Mengunggah...' : 'Unggah ke Cloud'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Tarik Novel dari Supabase
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Perbarui perpustakaan lokal dengan data terbaru dari database cloud.
                    </p>
                  </div>
                  <button
                    onClick={handlePullFromCloud}
                    disabled={isSyncing || !isConnected}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Tarik Data Cloud</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownloadJson}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadedJson ? 'JSON Terunduh!' : 'Cadangkan Data Perpustakaan (File JSON)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SKRIP SQL SUPABASE */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Skrip PostgreSQL & Kebijakan Akses:
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mencakup tabel `novels`, `reading_logs`, `book_quotes`, dan bucket `novel-pdfs`.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96 border border-slate-800 selection:bg-emerald-800 selection:text-white">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}

          {/* TAB 4: PANDUAN INTEGRASI & STORAGE PDF */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">1. Jalankan Skrip SQL di Supabase</h5>
                    <p className="text-slate-600 mt-0.5">
                      Masuk ke project Supabase Anda, buka menu <strong>SQL Editor</strong> &rarr; <em>New query</em>, tempelkan skrip dari tab <em>"Skrip SQL Supabase"</em>, lalu klik <strong>Run</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">2. Pastikan Storage Bucket 'novel-pdfs' Aktif</h5>
                    <p className="text-slate-600 mt-0.5">
                      Skrip SQL di atas otomatis membuat bucket <code>novel-pdfs</code> dengan akses publik. Anda dapat memeriksanya di menu <strong>Storage</strong> di Supabase. File PDF novel yang Anda unggah akan disimpan di bucket ini.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">3. Masukkan Anon Key & Simpan</h5>
                    <p className="text-slate-600 mt-0.5">
                      Salin <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari Settings &rarr; API ke tab <em>"Kredensial API"</em>, lalu klik Simpan. Semua penambahan novel, catatan, kutipan, dan progres membaca akan otomatis tersinkronisasi ke cloud!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('config')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Server className="w-4 h-4" />
                  <span>Mulai Konfigurasi Kredensial Sekarang</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
