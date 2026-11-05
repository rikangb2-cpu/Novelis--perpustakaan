import React, { useState } from 'react';
import { Novel } from '../../types/novel';
import { GENRES } from '../../data/initialBooks';
import { BookCover } from '../BookCover';
import { Search, X, Star, ChevronRight } from 'lucide-react';

interface SearchTabProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onOpenAddModal: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  novels,
  onSelectNovel,
  onOpenAddModal
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua');

  const popularSearches = ['Tere Liye', 'Andrea Hirata', 'Fiksi Sejarah', 'Fantasi', 'Bumi'];

  const filteredNovels = novels.filter((novel) => {
    const q = query.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      novel.title.toLowerCase().includes(q) || 
      novel.author.toLowerCase().includes(q) ||
      novel.synopsis.toLowerCase().includes(q);

    const matchesGenre = 
      selectedGenre === 'Semua' || 
      novel.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesQuery && matchesGenre;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-slate-50/50">
      {/* Search Header Bar - Clean White Theme */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
          Cari Novel
        </h2>

        {/* Search Input Container */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul novel atau nama penulis..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Genre Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedGenre === g
                  ? 'bg-amber-100 border border-amber-300 text-amber-900 font-bold shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested keywords when no query */}
      {!query && (
        <div className="px-5 mt-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pencarian Cepat
          </span>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((keyword) => (
              <button
                key={keyword}
                onClick={() => setQuery(keyword)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Search className="w-3 h-3 text-amber-600" />
                <span>{keyword}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results List */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            {filteredNovels.length} Novel Ditemukan
          </span>
          {query && (
            <span className="text-[11px] text-amber-700 font-medium italic">
              kata kunci: "{query}"
            </span>
          )}
        </div>

        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredNovels.map((novel) => {
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
                      <span>{novel.totalPages} hal</span>
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
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">
              Novel Tidak Ditemukan
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tidak ada novel yang cocok dengan kata kunci "{query}". Ingin menambahkannya ke perpustakaan pribadi?
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer touch-press shadow-xs"
            >
              <span>Tambah "{query}" ke Rak</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
