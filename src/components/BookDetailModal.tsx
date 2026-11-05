import React, { useState } from 'react';
import { Novel, NovelStatus } from '../types/novel';
import { BookCover } from './BookCover';
import { generatePrintablePdfCard } from '../utils/supabaseHelper';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  BookOpen, 
  Clock, 
  Edit3, 
  Trash2, 
  Bookmark,
  FileText,
  Quote,
  Printer,
  Sparkles,
  Paperclip
} from 'lucide-react';

interface BookDetailModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdateStatus: (id: string, status: NovelStatus) => void;
  onUpdateProgress: (id: string, page: number, chapter: number) => void;
  onUpdateRating: (id: string, rating: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteNovel: (id: string) => void;
  onOpenReader: (novel: Novel) => void;
  onOpenPdfModal: (novel: Novel) => void;
  onOpenQuoteModal: (novel: Novel) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  novel,
  isOpen,
  onClose,
  onToggleFavorite,
  onUpdateStatus,
  onUpdateProgress,
  onUpdateRating,
  onUpdateNotes,
  onDeleteNovel,
  onOpenReader,
  onOpenPdfModal,
  onOpenQuoteModal
}) => {
  if (!isOpen || !novel) return null;

  const [notes, setNotes] = useState(novel.personalNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentPageInput, setCurrentPageInput] = useState(novel.currentPage);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const progressPercent = Math.min(100, Math.round((novel.currentPage / (novel.totalPages || 1)) * 100));

  const handleSaveNotes = () => {
    onUpdateNotes(novel.id, notes);
    setIsEditingNotes(false);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentPageInput(val);
    const approxChapter = Math.max(1, Math.ceil((val / (novel.totalPages || 1)) * novel.totalChapters));
    onUpdateProgress(novel.id, val, approxChapter);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 overflow-y-auto no-scrollbar animate-in fade-in duration-200">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 transition-colors touch-press cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px]">
          Detail Novel
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(novel.id)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-rose-50 text-slate-400 transition-colors touch-press cursor-pointer"
            aria-label="Favorit"
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                novel.isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-10 max-w-2xl mx-auto w-full">
        {/* Hero Cover Header */}
        <div className="relative pt-6 pb-8 px-5 flex flex-col items-center bg-gradient-to-b from-slate-100 via-slate-50 to-white overflow-hidden border-b border-slate-100">
          <div className="relative z-10 my-2 shadow-xl">
            <BookCover novel={novel} size="lg" />
          </div>

          <div className="mt-4 text-center z-10 px-4 max-w-sm">
            <h1 className="font-serif-novel text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              {novel.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 font-medium">
              karya <span className="text-amber-700 font-bold">{novel.author}</span>
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{novel.genre}</span>
              <span aria-hidden="true">·</span>
              <span>{novel.totalPages} Halaman</span>
              <span aria-hidden="true">·</span>
              <span>{novel.totalChapters} Bab</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5 z-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onUpdateRating(novel.id, star)}
                className="p-1 touch-press cursor-pointer"
                aria-label={`Beri bintang ${star}`}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= novel.rating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-slate-300 hover:text-amber-400'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-700 ml-1">
              {novel.rating}.0
            </span>
          </div>
        </div>

        {/* Primary Action Button: Baca / Lanjutkan */}
        <div className="px-5 mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => onOpenReader(novel)}
            className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 touch-press transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{novel.currentPage > 0 ? 'Lanjutkan Membaca' : 'Mulai Membaca'}</span>
          </button>

          {/* Secondary PDF & Quote Action Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onOpenPdfModal(novel)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{novel.pdfUrl ? 'Buka PDF' : 'Upload PDF'}</span>
            </button>

            <button
              onClick={() => onOpenQuoteModal(novel)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Quote className="w-3.5 h-3.5 text-amber-600" />
              <span>Kutipan</span>
            </button>

            <button
              onClick={() => generatePrintablePdfCard(novel)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              title="Cetak kartu PDF ringkasan novel ini"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* Status Selector Segmented Control */}
        <div className="px-5 mt-6">
          <label className="text-xs font-bold text-slate-700 tracking-wide block mb-2">
            Status Membaca
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(
              [
                { id: 'want_to_read', label: 'Ingin Dibaca' },
                { id: 'reading', label: 'Sedang Dibaca' },
                { id: 'completed', label: 'Selesai' }
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                onClick={() => onUpdateStatus(novel.id, st.id)}
                className={`py-2 px-1 text-xs font-medium rounded-lg transition-all touch-press cursor-pointer text-center truncate ${
                  novel.status === st.id
                    ? 'bg-white text-amber-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reading Progress Card */}
        <div className="px-5 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                Progres Membaca
              </span>
              <span className="text-xs font-bold text-amber-700 tabular-nums">
                {progressPercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={novel.totalPages}
              value={currentPageInput}
              onChange={handleProgressChange}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />

            <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
              <span>Halaman {novel.currentPage} dari {novel.totalPages}</span>
              <span>Bab {novel.currentChapter} dari {novel.totalChapters}</span>
            </div>
          </div>
        </div>

        {/* Synopsis Section */}
        <div className="px-5 mt-6">
          <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase mb-2">
            Sinopsis
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs">
            {novel.synopsis || 'Belum ada sinopsis untuk buku ini.'}
          </p>
        </div>

        {/* Saved Quotes Section */}
        {novel.quotes && novel.quotes.length > 0 && (
          <div className="px-5 mt-6">
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase mb-2 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-600" />
              Kutipan Favorit Pembaca ({novel.quotes.length})
            </h4>
            <div className="space-y-2">
              {novel.quotes.map((q) => (
                <div key={q.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-800 italic leading-relaxed">
                  "{q.text}"
                  <span className="not-italic text-[10px] text-slate-500 block mt-1 font-sans">
                    Hal {q.page || '—'} · Disimpan {q.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Notes Section */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Catatan Pribadi
            </h4>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tulis kesan, kutipan favorit, atau catatan penting..."
                className="w-full p-3 rounded-xl bg-white border border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer shadow-2xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed italic shadow-2xs">
              {novel.personalNotes ? (
                `"${novel.personalNotes}"`
              ) : (
                <span className="text-slate-400 not-italic">
                  Belum ada catatan pribadi. Ketuk Edit untuk menulis kesan Anda.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Reading History Log for this novel */}
        <div className="px-5 mt-6">
          <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Riwayat Membaca Terakhir
          </h4>

          {novel.readingHistory && novel.readingHistory.length > 0 ? (
            <div className="space-y-2">
              {novel.readingHistory.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <span>{log.date}</span>
                      <span className="text-slate-400 text-[10px]">{log.time}</span>
                    </div>
                    {log.note && (
                      <p className="mt-1 text-slate-600 text-[11px]">{log.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-700">+{log.pagesRead} hal</span>
                    <p className="text-[10px] text-slate-400">Bab {log.chapter}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              Belum ada riwayat sesi membaca yang tercatat.
            </p>
          )}
        </div>

        {/* Danger Zone: Hapus Novel */}
        <div className="px-5 mt-8 pt-4 border-t border-slate-200">
          {showDeleteConfirm ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <p className="text-xs text-rose-800 font-medium mb-3">
                Apakah Anda yakin ingin menghapus novel ini dari perpustakaan?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-700 hover:text-slate-900 cursor-pointer font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => onDeleteNovel(novel.id)}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs text-white font-bold hover:bg-rose-700 cursor-pointer shadow-2xs"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus dari Perpustakaan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
