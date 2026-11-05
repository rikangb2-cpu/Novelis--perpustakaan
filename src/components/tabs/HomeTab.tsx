import React from 'react';
import { Novel, UserProfile } from '../../types/novel';
import { BookCover } from '../BookCover';
import { 
  BookMarked, 
  Play, 
  Plus, 
  Flame, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2,
  Bookmark,
  FolderKanban,
  Sparkles
} from 'lucide-react';

interface HomeTabProps {
  novels: Novel[];
  profile: UserProfile;
  onSelectNovel: (novel: Novel) => void;
  onOpenAddModal: () => void;
  onOpenReader: (novel: Novel) => void;
  onNavigateToCollection: (collectionFolder?: 'all' | 'reading' | 'completed' | 'want_to_read') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  novels,
  profile,
  onSelectNovel,
  onOpenAddModal,
  onOpenReader,
  onNavigateToCollection
}) => {
  const currentlyReading = novels.filter((n) => n.status === 'reading');
  const completedNovels = novels.filter((n) => n.status === 'completed');
  const wantToReadNovels = novels.filter((n) => n.status === 'want_to_read');
  const activeNovel = currentlyReading[0] || novels.find((n) => n.currentPage > 0) || novels[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const progressPercent = activeNovel
    ? Math.min(100, Math.round((activeNovel.currentPage / (activeNovel.totalPages || 1)) * 100))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-slate-50/50">
      {/* Top Header Bar - Clean White Theme */}
      <header className="px-5 pt-4 pb-3 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
            <BookMarked className="w-4 h-4 stroke-[2.4]" />
          </div>
          <div>
            <span className="font-serif-novel text-base font-bold tracking-tight text-slate-900 block leading-none">
              NOVELIA
            </span>
            <span className="text-[9px] text-amber-700 font-bold tracking-wider uppercase">
              Perpustakaan Pribadi
            </span>
          </div>
        </div>

        {/* Reader Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-2xs">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="tabular-nums text-[11px]">
            {profile.streakDays} Hari Streak
          </span>
        </div>
      </header>

      {/* 1. BAGIAN KHUSUS SAPAAN PEMBACA (TERPISAH & JELAS) */}
      <section className="px-5 pt-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block mb-0.5">
                Ruang Sapaan
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {getGreeting()}, {profile.name}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-sm shadow-2xs">
              {profile.name.charAt(0)}
            </div>
          </div>

          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed italic border-l-2 border-amber-500 pl-2.5">
            "Satu bab setiap hari membuka cakrawala baru yang tak berbatas."
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Target Harian: <strong className="text-slate-800 font-semibold">{profile.dailyGoalMinutes} Menit</strong></span>
            <span>Total Rak: <strong className="text-amber-700 font-semibold">{novels.length} Novel</strong></span>
          </div>
        </div>
      </section>

      {/* 2. BAGIAN BUKU YANG SEDANG DIBACA (FOKUS & JELAS DENGAN GAMBAR SAMPUL ASLI) */}
      {activeNovel && (
        <section className="px-5 mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-amber-600 text-amber-600" />
              Lanjutkan Membaca
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              {activeNovel.lastReadDate}
            </span>
          </div>

          <div 
            onClick={() => onSelectNovel(activeNovel)}
            className="p-4 rounded-2xl bg-white border border-amber-300/80 hover:border-amber-400 transition-all cursor-pointer shadow-sm hover:shadow-md touch-press group"
          >
            <div className="flex gap-4 items-center">
              {/* Cover with Real Art */}
              <div className="shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <BookCover novel={activeNovel} size="sm" showProgress={false} />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                  {activeNovel.genre}
                </span>
                <h4 className="font-serif-novel text-base font-bold text-slate-900 truncate mt-0.5">
                  {activeNovel.title}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {activeNovel.author}
                </p>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-500">
                      Hal {activeNovel.currentPage} dari {activeNovel.totalPages}
                    </span>
                    <span className="font-bold text-amber-700 tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Bab {activeNovel.currentChapter} dari {activeNovel.totalChapters}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(activeNovel);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>Baca Novel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BAGIAN PENYIMPANAN / RAK KOLEKSI TERPISAH (SEPARATED SHELVES SHORTCUTS) */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-amber-600" />
              Penyimpanan Koleksi Rak
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pilih rak penyimpanan yang ingin Anda buka
            </p>
          </div>
          <button
            onClick={() => onNavigateToCollection('all')}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <span>Buka Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Kategori Penyimpanan Terpisah */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Rak 1: Sedang Dibaca */}
          <div
            onClick={() => onNavigateToCollection('reading')}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 cursor-pointer touch-press transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tabular-nums block">
                {currentlyReading.length}
              </span>
              <span className="text-[11px] text-slate-700 font-medium leading-tight block">
                Sedang Dibaca
              </span>
              <span className="text-[9px] text-amber-700 font-bold mt-1 block">
                Buka Rak &rarr;
              </span>
            </div>
          </div>

          {/* Rak 2: Sudah Selesai */}
          <div
            onClick={() => onNavigateToCollection('completed')}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer touch-press transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tabular-nums block">
                {completedNovels.length}
              </span>
              <span className="text-[11px] text-slate-700 font-medium leading-tight block">
                Selesai Dibaca
              </span>
              <span className="text-[9px] text-emerald-700 font-bold mt-1 block">
                Buka Rak &rarr;
              </span>
            </div>
          </div>

          {/* Rak 3: Daftar Ingin Baca */}
          <div
            onClick={() => onNavigateToCollection('want_to_read')}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 cursor-pointer touch-press transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-2">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tabular-nums block">
                {wantToReadNovels.length}
              </span>
              <span className="text-[11px] text-slate-700 font-medium leading-tight block">
                Ingin Dibaca
              </span>
              <span className="text-[9px] text-sky-700 font-bold mt-1 block">
                Buka Rak &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button (FAB) Tambah Novel */}
      <div className="fixed bottom-20 right-4 sm:right-6 pointer-events-none z-30">
        <button
          onClick={onOpenAddModal}
          className="pointer-events-auto h-12 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 touch-press transition-transform cursor-pointer"
          aria-label="Tambah Novel Baru"
        >
          <Plus className="w-5 h-5 stroke-[2.6]" />
          <span>Tambah Novel</span>
        </button>
      </div>
    </div>
  );
};
