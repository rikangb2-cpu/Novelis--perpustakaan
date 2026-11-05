import React, { useState, useRef } from 'react';
import { Novel } from '../types/novel';
import { 
  X, 
  Upload, 
  FileText, 
  Maximize2, 
  Download, 
  Check, 
  Bookmark, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PdfViewerModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onAttachPdf: (novelId: string, file: File, dataUrl: string) => void;
  onUpdateProgress: (novelId: string, page: number, chapter: number) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  novel,
  isOpen,
  onClose,
  onAttachPdf,
  onUpdateProgress
}) => {
  if (!isOpen || !novel) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(novel.currentPage || 1);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.txt', '.md'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt && file.type !== 'application/pdf') {
      alert('Mohon pilih file berekstensi .pdf, .txt, atau .md');
      return;
    }

    setUploadProgress(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onAttachPdf(novel.id, file, result);
      setUploadProgress(false);
      setSuccessMsg(`File ${file.name} berhasil dimuat & isi novel diperbarui!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    };
    reader.onerror = () => {
      setUploadProgress(false);
      alert('Gagal membaca file');
    };
    reader.readAsDataURL(file);
  };

  const handleSavePage = (newPage: number) => {
    const validPage = Math.max(1, Math.min(novel.totalPages || 500, newPage));
    setCurrentPage(validPage);
    const approxChapter = Math.max(1, Math.ceil((validPage / (novel.totalPages || 1)) * novel.totalChapters));
    onUpdateProgress(novel.id, validPage, approxChapter);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white select-none animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">
              {novel.title}
            </h3>
            <p className="text-[10px] text-slate-400">
              {novel.pdfFileName ? `PDF: ${novel.pdfFileName}` : 'Dokumen PDF Novel'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {novel.pdfUrl ? (
            <>
              <a
                href={novel.pdfUrl}
                download={`${novel.title}.pdf`}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Unduh PDF"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
                title="Ganti PDF"
              >
                Ganti File
              </button>
            </>
          ) : null}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,application/pdf,text/plain"
            className="hidden"
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950">
        {successMsg && (
          <div className="absolute top-3 inset-x-4 z-30 flex justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {novel.pdfUrl ? (
          /* PDF Viewer Frame */
          <div className="w-full h-full flex flex-col">
            <iframe
              src={`${novel.pdfUrl}#toolbar=1&navpanes=0`}
              title={`PDF ${novel.title}`}
              className="w-full flex-1 border-none bg-slate-900"
            />

            {/* Quick Page Tracker Bar at Bottom */}
            <div className="h-12 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Progres Halaman:</span>
                <input
                  type="number"
                  min="1"
                  max={novel.totalPages}
                  value={currentPage}
                  onChange={(e) => handleSavePage(Number(e.target.value))}
                  className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold text-center text-xs focus:outline-none"
                />
                <span>dari {novel.totalPages} hal</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSavePage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSavePage(currentPage + 1)}
                  disabled={currentPage >= novel.totalPages}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload PDF Dropzone Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
              <FileText className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Lampirkan File PDF Novel
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Simpan file PDF novel <strong>{novel.title}</strong> ke dalam perpustakaan pribadi Anda agar bisa dibaca langsung kapan pun dan disinkronkan ke Supabase Storage.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadProgress}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 touch-press transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>{uploadProgress ? 'Sedang Membaca PDF...' : 'Pilih File PDF dari Gadget'}</span>
            </button>

            <div className="mt-8 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-left w-full space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Info Supabase Cloud Storage:</span>
              </div>
              <p>• File PDF disimpan di penyimpanan lokal peramban Anda.</p>
              <p>• Nantinya file ini siap di-upload ke bucket <code>novel-pdfs</code> Supabase.</p>
              <p>• Mendukung pembacaan di HP, Tablet, iPad, maupun Komputer.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
