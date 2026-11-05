import React, { useState } from 'react';
import { Novel, NovelStatus } from '../types/novel';
import { GENRES } from '../data/initialBooks';
import { BookCover } from './BookCover';
import { X, Plus, Check } from 'lucide-react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNovel: (novel: Novel) => void;
}

const COLOR_PRESETS = [
  { id: 'emerald', label: 'Emerald Forest', value: 'from-emerald-700 via-teal-800 to-slate-900' },
  { id: 'rose', label: 'Crimson Wine', value: 'from-rose-800 via-amber-900 to-stone-900' },
  { id: 'amber', label: 'Warm Amber', value: 'from-amber-700 via-stone-800 to-black' },
  { id: 'blue', label: 'Sapphire Midnight', value: 'from-sky-800 via-indigo-900 to-slate-900' },
  { id: 'purple', label: 'Royal Violet', value: 'from-purple-800 via-violet-900 to-slate-900' },
  { id: 'slate', label: 'Classic Slate', value: 'from-slate-700 via-zinc-800 to-black' }
];

const PATTERN_PRESETS: Array<{ id: Novel['coverPattern']; label: string }> = [
  { id: 'stars', label: 'Bintang' },
  { id: 'botanical', label: 'Flora & Daun' },
  { id: 'classic', label: 'Klasik' },
  { id: 'geometric', label: 'Geometris' },
  { id: 'minimalist', label: 'Minimalis' }
];

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddNovel
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState(GENRES[1] || 'Fantasi & Petualangan');
  const [totalPages, setTotalPages] = useState<number>(300);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalChapters, setTotalChapters] = useState<number>(20);
  const [status, setStatus] = useState<NovelStatus>('want_to_read');
  const [synopsis, setSynopsis] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [selectedPattern, setSelectedPattern] = useState<Novel['coverPattern']>('stars');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preview novel object for dynamic cover
  const previewNovel: Novel = {
    id: 'preview',
    title: title || 'Judul Novel Anda',
    author: author || 'Nama Penulis',
    genre,
    coverColor: selectedColor,
    coverPattern: selectedPattern,
    coverImageUrl: customImageUrl || undefined,
    totalPages,
    currentPage,
    totalChapters,
    currentChapter: Math.max(1, Math.ceil((currentPage / (totalPages || 1)) * totalChapters)),
    synopsis,
    isFavorite: false,
    status,
    rating: 5,
    personalNotes,
    lastReadDate: 'Baru ditambahkan',
    addedDate: 'Hari ini',
    excerpt: {
      chapterTitle: 'Bab 1: Awal Mula',
      content: [synopsis || 'Kisah ini baru saja ditambahkan ke dalam perpustakaan pribadi Anda.']
    },
    readingHistory: []
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Mohon isi judul novel');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Mohon isi nama penulis');
      return;
    }

    const newNovel: Novel = {
      ...previewNovel,
      id: `novel-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      totalPages: Number(totalPages) || 200,
      currentPage: Number(currentPage) || 0,
      totalChapters: Number(totalChapters) || 10,
      coverImageUrl: customImageUrl.trim() || undefined,
      pdfUrl: pdfDataUrl || undefined,
      pdfFileName: pdfFileName || undefined,
      pdfFileSize: pdfFileSize || undefined,
      addedDate: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
      lastReadDate: currentPage > 0 ? 'Hari ini' : 'Belum dibaca'
    };

    onAddNovel(newNovel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg max-h-[90vh] bg-white rounded-t-3xl border-t border-slate-200 flex flex-col overflow-hidden text-slate-900 shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        {/* Sheet Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1" />

        {/* Header - Clean White Theme */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-600 stroke-[2.4]" />
            <h3 className="text-base font-bold text-slate-900">
              Tambah Novel Baru
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Live Cover Preview Strip */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="shrink-0 shadow-md">
              <BookCover novel={previewNovel} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                Pratinjau Sampul Buku
              </span>
              <h4 className="text-sm font-bold truncate text-slate-900 mt-0.5">
                {title || 'Judul Novel'}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {author || 'Nama Penulis'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Sampul dirancang rapi dengan efek hardcover fisik.
              </p>
            </div>
          </div>

          {/* Form Fields: Judul & Penulis */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Novel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: Sang Pemimpi, Pulang, Dilan 1990"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Penulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: Andrea Hirata, Tere Liye, Pramoedya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Genre & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                {GENRES.filter((g) => g !== 'Semua').map((g) => (
                  <option key={g} value={g} className="bg-white text-slate-900">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Membaca
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NovelStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="want_to_read" className="bg-white text-slate-900">
                  Ingin Dibaca
                </option>
                <option value="reading" className="bg-white text-slate-900">
                  Sedang Dibaca
                </option>
                <option value="completed" className="bg-white text-slate-900">
                  Selesai
                </option>
              </select>
            </div>
          </div>

          {/* Halaman & Bab */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Halaman
              </label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Bab
              </label>
              <input
                type="number"
                min="1"
                value={totalChapters}
                onChange={(e) => setTotalChapters(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Optional: Link Gambar Sampul Kustom */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              URL Gambar Sampul (Opsional)
            </label>
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://... atau biarkan kosong untuk sampul otomatis"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          {/* Lampirkan File PDF Novel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Lampirkan File PDF Novel (.pdf)
            </label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <span className="text-xs font-semibold text-slate-800 block truncate">
                  {pdfFileName ? `📄 ${pdfFileName} (${pdfFileSize})` : 'Belum ada file PDF dipilih'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Dapat dibaca langsung di e-reader dan disinkronkan ke Supabase Storage
                </span>
              </div>
              <label className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-2xs shrink-0">
                <span>{pdfFileName ? 'Ubah File' : 'Pilih PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                      setPdfFileName(file.name);
                      setPdfFileSize(sizeInMb);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setPdfDataUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Cover Color Palette Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Warna Sampul Buku
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((clr) => (
                <button
                  key={clr.id}
                  type="button"
                  onClick={() => setSelectedColor(clr.value)}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedColor === clr.value
                      ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${clr.value} shrink-0`} />
                  <span className="text-[11px] text-slate-700 font-medium truncate">
                    {clr.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cover Pattern Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Motif & Ornamen Sampul
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PATTERN_PRESETS.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => setSelectedPattern(pat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    selectedPattern === pat.id
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {pat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sinopsis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sinopsis Singkat
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={3}
              placeholder="Ceritakan gambaran besar alur atau daya tarik novel ini..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white shadow-2xs"
            />
          </div>

          {/* Catatan Pribadi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Pribadi (Opsional)
            </label>
            <input
              type="text"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Contoh: Rekomendasi dari teman / dipinjam dari perpustakaan"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 pb-4">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/25 touch-press transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan ke Rak Perpustakaan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
