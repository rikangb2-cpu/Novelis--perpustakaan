import React from 'react';
import { Novel } from '../../types/novel';
import { BookCover } from '../BookCover';
import { Heart, Star, BookOpen } from 'lucide-react';

interface FavoritesTabProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToCollection: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  novels,
  onSelectNovel,
  onToggleFavorite,
  onNavigateToCollection
}) => {
  const favoriteNovels = novels.filter((n) => n.isFavorite);

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-slate-50/50">
      {/* Top Header - Clean White Theme */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Novel Favorit</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {favoriteNovels.length} novel yang paling Anda sukai
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
          <Heart className="w-4 h-4 fill-rose-500" />
        </div>
      </div>

      {/* Favorites List */}
      <div className="px-5 mt-5">
        {favoriteNovels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {favoriteNovels.map((novel) => {
              const progress = Math.min(100, Math.round((novel.currentPage / (novel.totalPages || 1)) * 100));

              return (
                <div
                  key={novel.id}
                  onClick={() => onSelectNovel(novel)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer touch-press relative group flex gap-4 shadow-2xs hover:shadow-sm"
                >
                  {/* Cover */}
                  <div className="shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <BookCover novel={novel} size="sm" showProgress={false} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                        {novel.genre}
                      </span>
                      <h4 className="font-serif-novel text-sm font-bold text-slate-900 truncate mt-0.5">
                        {novel.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {novel.author}
                      </p>
                    </div>

                    {novel.personalNotes && (
                      <p className="text-[11px] text-slate-600 italic line-clamp-1 my-1">
                        "{novel.personalNotes}"
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2.5 text-[10px] text-slate-500">
                      <span className="text-amber-700 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {novel.rating}.0
                      </span>
                      <span>·</span>
                      <span>{novel.totalPages} hal</span>
                      <span>·</span>
                      <span className={novel.status === 'completed' ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                        {novel.status === 'completed' ? 'Selesai' : `${progress}%`}
                      </span>
                    </div>
                  </div>

                  {/* Quick Unfavorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(novel.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                    title="Hapus dari Favorit"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-rose-500">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              Belum Ada Novel Favorit
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Tandai novel yang Anda sukai dengan ikon hati di halaman detail untuk menyimpannya di rak ini.
            </p>
            <button
              onClick={onNavigateToCollection}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer touch-press transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Jelajahi Koleksi Rak</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
