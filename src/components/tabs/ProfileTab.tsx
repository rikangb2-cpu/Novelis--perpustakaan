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
  ExternalLink,
  Camera,
  Upload,
  X,
  Check
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: '1', label: 'Rian (Default)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: '2', label: 'Pembaca Kacamata', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: '3', label: 'Wanita Hijab', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { id: '4', label: 'Wanita Sastra', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: '5', label: 'Pria Santai', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: '6', label: 'Pecinta Buku Kafe', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' }
];

interface ProfileTabProps {
  profile: UserProfile;
  novels: Novel[];
  isCloudConnected?: boolean;
  onUpdateProfileName: (name: string) => void;
  onUpdateAvatar?: (url: string) => void;
  onResetData: () => void;
  onSelectNovelById: (id: string) => void;
  onOpenSupabaseModal: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  novels,
  isCloudConnected = false,
  onUpdateProfileName,
  onUpdateAvatar,
  onResetData,
  onSelectNovelById,
  onOpenSupabaseModal
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          if (onUpdateAvatar) {
            onUpdateAvatar(resultStr);
          }
          setIsAvatarModalOpen(false);
          confetti({ particleCount: 40, spread: 60 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (url: string) => {
    if (onUpdateAvatar) {
      onUpdateAvatar(url);
    }
    setIsAvatarModalOpen(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarInput.trim() && onUpdateAvatar) {
      onUpdateAvatar(customAvatarInput.trim());
      setIsAvatarModalOpen(false);
      setCustomAvatarInput('');
      confetti({ particleCount: 30, spread: 50 });
    }
  };

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
          <div className="relative group shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsAvatarModalOpen(true)}
              />
            ) : (
              <div 
                onClick={() => setIsAvatarModalOpen(true)}
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-xs cursor-pointer"
              >
                {profile.name.charAt(0)}
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer transition-transform hover:scale-110"
              title="Ganti Foto Profil Pengguna"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Pengguna Online" />
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
                  title="Ubah Nama"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pengguna Aktif
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500">Anggota Sejak 2026</span>
            </div>
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

      {/* Modal Ubah Foto Profil Pengguna */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-2xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Foto Profil Pengguna</h3>
                  <p className="text-[11px] text-slate-500">Pilih avatar atau unggah foto Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* Current Preview */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-300 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-3xl shadow-md">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2">{profile.name}</h4>
                <p className="text-xs text-slate-500">Foto profil ditampilkan di Ruang Sapaan & Akun</p>
              </div>

              {/* Upload Custom Image Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Unggah Foto dari Galeri / File Komputer</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Mendukung format JPG, PNG, WEBP (maks. 5MB)
                </p>
              </div>

              {/* Avatar Presets Grid */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Atau Pilih Dari Pustaka Avatar
                </h5>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = profile.avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.url)}
                        className={`group relative p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400'
                            : 'border-slate-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden mb-1.5 shadow-2xs">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-700 block truncate">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Image URL input */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Gunakan URL Gambar Web:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    value={customAvatarInput}
                    onChange={(e) => setCustomAvatarInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 text-xs border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleApplyCustomUrl}
                    disabled={!customAvatarInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-40 cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 px-5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
