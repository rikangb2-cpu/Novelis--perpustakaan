import React, { useState, useEffect } from 'react';
import { Novel } from '../../types/novel';
import { GENRES } from '../../data/initialBooks';
import { BookCover } from '../BookCover';
import { 
  Plus, 
  Star,
  CheckCircle2,
  Bookmark,
  BookOpen,
  Folder,
  FolderOpen,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';

interface CollectionTabProps {
  novels: Novel[];
  initialFolder?: 'all' | 'reading' | 'completed' | 'want_to_read' | 'genres';
  onSelectNovel: (novel: Novel) => void;
  onOpenAddModal: () => void;
}

export const CollectionTab: React.FC<CollectionTabProps> = ({
  novels,
  initialFolder = 'all',
  onSelectNovel,
  onOpenAddModal
}) => {
  const [activeShelf, setActiveShelf] = useState<'all' | 'reading' | 'completed' | 'want_to_read' | 'genres'>(initialFolder);
  const [selectedGenreFolder, setSelectedGenreFolder] = useState<string>('Fantasi & Petualangan');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialFolder) {
      setActiveShelf(initialFolder);
    }
  }, [initialFolder]);

  // Counts for each shelf
  const countReading = novels.filter((n) => n.status === 'reading').length;
  const countCompleted = novels.filter((n) => n.status === 'completed').length;
  const countWant = novels.filter((n) => n.status === 'want_to_read').length;

  // Filter novels by selected shelf
  const getNovelsForShelf = () => {
    switch (activeShelf) {
      case 'reading':
        return novels.filter((n) => n.status === 'reading');
      case 'completed':
        return novels.filter((n) => n.status === 'completed');
      case 'want_to_read':
        return novels.filter((n) => n.status === 'want_to_read');
      case 'genres':
        return novels.filter((n) => n.genre.toLowerCase().includes(selectedGenreFolder.toLowerCase()));
      case 'all':
      default:
        return novels;
    }
  };

  const shelfNovels = getNovelsForShelf();

  const getShelfTitle = () => {
    switch (activeShelf) {
      case 'reading':
        return { name: 'Rak Sedang Dibaca', desc: 'Buku yang masih aktif dan sedang Anda nikmati.' };
      case 'completed':
        return { name: 'Rak Selesai Dibaca', desc: 'Arsip novel yang sudah Anda tuntaskan.' };
      case 'want_to_read':
        return { name: 'Rak Daftar Ingin Baca', desc: 'Daftar antrean novel yang siap Anda buka selanjutnya.' };
      case 'genres':
        return { name: `Folder Genre: ${selectedGenreFolder}`, desc: 'Pengelompokan novel berdasarkan tema cerita.' };
      case 'all':
      default:
        return { name: 'Semua Koleksi Perpustakaan', desc: 'Seluruh novel yang tersimpan di perpustakaan pribadi Anda.' };
    }
  };

  const shelfInfo = getShelfTitle();

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-slate-50/50">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Penyimpanan Koleksi
            </h2>
            <p className="text-xs text-slate-500">
              Rak & folder novel pribadi Anda
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Rak Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Daftar Rinci"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onOpenAddModal}
              className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Separated Storage Shelves Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveShelf('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-press flex items-center gap-1.5 ${
              activeShelf === 'all'
                ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span>Semua</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeShelf === 'all' ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
              {novels.length}
            </span>
          </button>

          <button
            onClick={() => setActiveShelf('reading')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-press flex items-center gap-1.5 ${
              activeShelf === 'reading'
                ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Sedang Dibaca</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeShelf === 'reading' ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
              {countReading}
            </span>
          </button>

          <button
            onClick={() => setActiveShelf('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-press flex items-center gap-1.5 ${
              activeShelf === 'completed'
                ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selesai</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeShelf === 'completed' ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'}`}>
              {countCompleted}
            </span>
          </button>

          <button
            onClick={() => setActiveShelf('want_to_read')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-press flex items-center gap-1.5 ${
              activeShelf === 'want_to_read'
                ? 'bg-sky-100 border border-sky-300 text-sky-900 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-sky-600" />
            <span>Ingin Dibaca</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeShelf === 'want_to_read' ? 'bg-sky-200 text-sky-900' : 'bg-slate-100 text-slate-500'}`}>
              {countWant}
            </span>
          </button>

          <button
            onClick={() => setActiveShelf('genres')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-press flex items-center gap-1.5 ${
              activeShelf === 'genres'
                ? 'bg-purple-100 border border-purple-300 text-purple-900 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Folder Genre</span>
          </button>
        </div>
      </div>

      {/* Jika Tab "Folder Genre" dipilih, tampilkan folder-folder genre terpisah */}
      {activeShelf === 'genres' && (
        <div className="px-5 mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-2">
            Pilih Folder Genre:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {GENRES.filter((g) => g !== 'Semua').map((g) => {
              const genreCount = novels.filter((n) => n.genre.toLowerCase().includes(g.toLowerCase())).length;
              const isSelected = selectedGenreFolder === g;

              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenreFolder(g)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-100 border-purple-300 text-purple-950 border shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600 fill-purple-400' : 'text-slate-400'}`} />
                  <span>{g}</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full text-slate-600 font-semibold">
                    {genreCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Shelf Information Banner */}
      <div className="px-5 mt-4">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{shelfInfo.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {shelfInfo.desc}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg shrink-0">
            {shelfNovels.length} Novel
          </span>
        </div>
      </div>

      {/* Novels Display in this Shelf */}
      <div className="px-5 mt-4">
        {shelfNovels.length > 0 ? (
          viewMode === 'grid' ? (
            /* GRID VIEW (Sampul Buku di Rak - Responsif di semua gadget) */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {shelfNovels.map((novel) => {
                const progress = Math.min(100, Math.round((novel.currentPage / (novel.totalPages || 1)) * 100));

                return (
                  <div
                    key={novel.id}
                    onClick={() => onSelectNovel(novel)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer touch-press group flex flex-col shadow-2xs hover:shadow-md"
                  >
                    <div className="flex justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-200">
                      <BookCover novel={novel} size="md" showProgress={true} />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wider block truncate">
                          {novel.genre}
                        </span>
                        <h4 className="font-serif-novel text-sm font-bold text-slate-900 truncate mt-0.5">
                          {novel.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {novel.author}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-amber-700 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {novel.rating}.0
                        </span>

                        {novel.status === 'completed' ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selesai
                          </span>
                        ) : novel.status === 'reading' ? (
                          <span className="text-slate-600 font-medium">
                            {progress}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            Ingin Baca
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW (Daftar Rinci Penyimpanan) */
            <div className="space-y-3">
              {shelfNovels.map((novel) => {
                const progress = Math.min(100, Math.round((novel.currentPage / (novel.totalPages || 1)) * 100));

                return (
                  <div
                    key={novel.id}
                    onClick={() => onSelectNovel(novel)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 flex gap-3.5 items-center cursor-pointer touch-press transition-all group shadow-2xs hover:shadow-xs"
                  >
                    <div className="shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <BookCover novel={novel} size="sm" showProgress={false} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                        {novel.genre}
                      </span>
                      <h4 className="font-serif-novel text-sm font-bold text-slate-900 truncate mt-0.5">
                        {novel.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {novel.author}
                      </p>

                      <div className="mt-2 flex items-center gap-2.5 text-[10px] text-slate-500">
                        <span className="text-amber-700 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {novel.rating}.0
                        </span>
                        <span>·</span>
                        <span>Hal {novel.currentPage} / {novel.totalPages}</span>
                        <span>·</span>
                        <span className={novel.status === 'completed' ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                          {novel.status === 'completed' ? 'Selesai' : `${progress}%`}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <Folder className="w-10 h-10 text-slate-400 mx-auto mb-2.5" />
            <h4 className="text-sm font-semibold text-slate-800">
              Rak Ini Masih Kosong
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Belum ada novel yang tersimpan di {shelfInfo.name}.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer touch-press shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Novel ke Rak Ini</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
