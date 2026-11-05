import React, { useState } from 'react';
import { Novel, UserProfile } from '../../types/novel';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  Edit2, 
  RotateCcw, 
  Share2, 
  Bookmark, 
  Database, 
  Sparkles, 
  Printer, 
  Trophy,
  ExternalLink
} from 'lucide-react';

interface ProfileTabProps {
  profile: UserProfile;
  novels: Novel[];
  isCloudConnected?: boolean;
  onUpdateProfileName: (name: string) => void;
  onResetData: () => void;
  onSelectNovelById: (id: string) => void;
  onOpenSupabaseModal: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  novels,
  isCloudConnected = false,
  onUpdateProfileName,
  onResetData,
  onSelectNovelById,
  onOpenSupabaseModal
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Aggregate stats
  const totalBooks = novels.length;
  const completedBooks = novels.filter((n) => n.status === 'completed').length;
  const totalPagesRead = novels.reduce((acc, curr) => acc + (curr.currentPage || 0), 0);

  // Achievements calculation
  const achievements = [
    {
      id: 'ach-1',
      title: 'Pembaca Pertama',
      desc: 'Mulai petualangan di perpustakaan digital',
      unlocked: totalBooks > 0,
      icon: '🌱'
    },
    {
      id: 'ach-2',
      title: 'Kolektor Sastra',
      desc: 'Memiliki 5 atau lebih novel di rak Anda',
      unlocked: totalBooks >= 5,
      icon: '📚'
    },
    {
      id: 'ach-3',
      title: 'Penakluk 500 Halaman',
      desc: 'Membaca lebih dari 500 halaman buku',
      unlocked: totalPagesRead >= 500,
      icon: '⚡'
    },
    {
      id: 'ach-4',
      title: 'Streak Pembaca Hebat',
      desc: 'Membaca 7 hari berturut-turut tanpa jeda',
      unlocked: profile.streakDays >= 7,
      icon: '🔥'
    },
    {
      id: 'ach-5',
      title: 'Tamat Mahakarya',
      desc: 'Menyelesaikan minimal 1 novel sampai tamat',
      unlocked: completedBooks >= 1,
      icon: '🏆'
    }
  ];

  // Flatten reading history from all novels
  const allLogs: Array<{
    logId: string;
    novelId: string;
    novelTitle: string;
    novelAuthor: string;
    date: string;
    time: string;
    pagesRead: number;
    chapter: number;
    note?: string;
  }> = [];

  novels.forEach((novel) => {
    if (novel.readingHistory) {
      novel.readingHistory.forEach((log) => {
        allLogs.push({
          logId: log.id,
          novelId: novel.id,
          novelTitle: novel.title,
          novelAuthor: novel.author,
          date: log.date,
          time: log.time,
          pagesRead: log.pagesRead,
          chapter: log.chapter,
          note: log.note
        });
      });
    }
  });

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateProfileName(tempName.trim());
      setIsEditingName(false);
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  const handleShareSummary = () => {
    const summary = `📚 NOVELIA - Perpustakaan Pribadi ${profile.name}\n` +
      `Total Koleksi: ${totalBooks} novel\n` +
      `Selesai Dibaca: ${completedBooks} novel\n` +
      `Total Halaman Terbaca: ${totalPagesRead.toLocaleString('id-ID')} hal\n` +
      `Streak Membaca: ${profile.streakDays} hari berturut-turut! 🔥\n` +
      `Dikelola di NOVELIA Digital Library`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      confetti({ particleCount: 35, spread: 60 });
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handlePrintLibraryReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = novels.map((n, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>${n.title}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${n.author}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${n.genre}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${n.currentPage} / ${n.totalPages} hal</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${n.status === 'completed' ? 'Selesai' : n.status === 'reading' ? 'Sedang Dibaca' : 'Ingin Baca'}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Katalog Perpustakaan: ${profile.name} - NOVELIA</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { background: #f8fafc; text-align: left; padding: 10px 8px; border-bottom: 2px solid #cbd5e1; }
        </style>
      </head>
      <body>
        <h2>NOVELIA – Katalog Perpustakaan Pribadi</h2>
        <p>Pemilik: <strong>${profile.name}</strong> · Tanggal: ${new Date().toLocaleDateString('id-ID')} · Total: ${totalBooks} Novel</p>
        <table>
          <thead>
            <tr><th>No</th><th>Judul Novel</th><th>Penulis</th><th>Genre</th><th>Progres</th><th>Status</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-slate-50/50">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Profil Pembaca
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Statistik, pencapaian, dan sinkronisasi perpustakaan Anda
        </p>
      </div>

      {/* User Card */}
      <div className="px-5 mt-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xl shadow-xs shrink-0">
            {profile.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 text-sm text-slate-900 border border-amber-500 focus:outline-none w-full"
                />
                <button
                  onClick={handleSaveName}
                  className="px-2.5 py-1 rounded bg-amber-600 text-white font-semibold text-xs cursor-pointer shadow-2xs"
                >
                  Simpan
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {profile.name}
                </h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-400 hover:text-amber-700 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-0.5">
              Pembaca Aktif · Anggota Sejak 2026
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Pecinta Sastra Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Cloud Connection Card (Feature Highlight) */}
      <div className="px-5 mt-4">
        <div 
          onClick={onOpenSupabaseModal}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm touch-press ${
            isCloudConnected 
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300' 
              : 'bg-gradient-to-r from-slate-50 to-slate-100/70 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs transition-colors ${
                isCloudConnected ? 'bg-emerald-600' : 'bg-slate-700'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isCloudConnected ? 'text-emerald-800' : 'text-slate-600'
                  }`}>
                    {isCloudConnected ? 'Supabase Cloud Terhubung' : 'Cloud Database & Storage'}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isCloudConnected ? 'Sinkronisasi Realtime Aktif' : 'Sambungkan Supabase & Anon Key'}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {isCloudConnected 
                    ? 'Novel, riwayat membaca, dan file PDF tersimpan di server cloud'
                    : 'Koneksikan database cloud, ekspor JSON, dan dapatkan skrip SQL'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
              isCloudConnected 
                ? 'text-emerald-800 bg-white/80 border-emerald-200' 
                : 'text-slate-700 bg-white border-slate-200'
            }`}>
              {isCloudConnected ? 'Kelola' : 'Sambungkan'} &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Reading Statistics Cards */}
      <div className="px-5 mt-5">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
          Statistik Membaca
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tabular-nums block">
                {totalBooks}
              </span>
              <span className="text-[10px] text-slate-500">Total Koleksi</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-700 tabular-nums block">
                {completedBooks}
              </span>
              <span className="text-[10px] text-slate-500">Novel Tamat</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tabular-nums block">
                {totalPagesRead.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-500">Halaman Terbaca</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <span className="text-lg font-bold text-orange-600 tabular-nums block">
                {profile.streakDays} Hari
              </span>
              <span className="text-[10px] text-slate-500">Reading Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lencana Pencapaian (Achievements) */}
      <div className="px-5 mt-6">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Lencana Pencapaian ({achievements.filter((a) => a.unlocked).length}/{achievements.length})</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-amber-50/60 border-amber-200 text-slate-900 shadow-2xs'
                  : 'bg-white border-slate-200 opacity-60 text-slate-500'
              }`}
            >
              <span className="text-xl block mb-1">{ach.icon}</span>
              <h5 className="text-xs font-bold truncate">{ach.title}</h5>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                {ach.desc}
              </p>
              {ach.unlocked && (
                <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full inline-block mt-2">
                  Tercapai ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Membaca (Timeline Log) */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Riwayat Membaca Terakhir</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            {allLogs.length} sesi tercatat
          </span>
        </div>

        {allLogs.length > 0 ? (
          <div className="space-y-2.5">
            {allLogs.slice(0, 5).map((log) => (
              <div
                key={log.logId}
                onClick={() => onSelectNovelById(log.novelId)}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-300 transition-colors flex items-start justify-between cursor-pointer touch-press shadow-2xs"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span className="font-semibold text-slate-800">{log.date}</span>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <h5 className="font-serif-novel text-xs font-bold text-slate-900 truncate">
                    {log.novelTitle}
                  </h5>
                  {log.note && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                      "{log.note}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-700 tabular-nums">
                    +{log.pagesRead} hal
                  </span>
                  <p className="text-[10px] text-slate-400">Bab {log.chapter}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            Belum ada catatan sesi membaca. Buka novel dan baca bab untuk mencatat riwayat.
          </div>
        )}
      </div>

      {/* Actions & Utilities */}
      <div className="px-5 mt-6 space-y-2.5">
        <div className="flex gap-2">
          {/* Share Summary */}
          <button
            onClick={handleShareSummary}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-press shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{copySuccess ? 'Disalin ke Clipboard!' : 'Bagikan Statistik'}</span>
          </button>

          {/* Print PDF Catalog */}
          <button
            onClick={handlePrintLibraryReport}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-press shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            <span>Cetak PDF Katalog</span>
          </button>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm ? (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <p className="text-xs text-rose-800 font-medium mb-3">
              Kembalikan perpustakaan ke novel bawaan awal dengan sampul bergambar lengkap?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-700 hover:text-slate-900 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs text-white font-bold hover:bg-rose-700 cursor-pointer shadow-2xs"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 rounded-xl text-[11px] text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ke Koleksi Bawaan Awal</span>
          </button>
        )}
      </div>
    </div>
  );
};
