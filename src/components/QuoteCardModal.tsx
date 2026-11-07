import React, { useState } from 'react';
import { Novel, BookQuote } from '../types/novel';
import confetti from 'canvas-confetti';
import { X, Quote, Share2, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface QuoteCardModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (novelId: string, quote: BookQuote) => void;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  novel,
  isOpen,
  onClose,
  onSaveQuote
}) => {
  const [quoteText, setQuoteText] = useState(
    novel?.synopsis ? `"${novel.synopsis.slice(0, 140)}..."` : 'Membaca adalah petualangan jiwa tanpa batas.'
  );
  const [pageNumber, setPageNumber] = useState<number>(novel?.currentPage || 1);
  const [cardTheme, setCardTheme] = useState<'amber' | 'emerald' | 'indigo' | 'rose'>('amber');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !novel) return null;

  const themeStyles = {
    amber: 'bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-amber-200 text-slate-900',
    emerald: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 border-emerald-200 text-slate-900',
    indigo: 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100/40 border-indigo-200 text-slate-900',
    rose: 'bg-gradient-to-br from-rose-50 via-white to-rose-100/40 border-rose-200 text-slate-900'
  };

  const handleCopy = () => {
    const formatted = `"${quoteText}"\n— ${novel.author}, novel "${novel.title}" (Hal ${pageNumber})\nDisimpan di NOVELIA Digital Library`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!quoteText.trim()) return;
    const newQuote: BookQuote = {
      id: `quote-${Date.now()}`,
      text: quoteText.trim(),
      page: pageNumber,
      date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
    };
    onSaveQuote(novel.id, newQuote);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Kutipan Indah dari Novel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar max-h-[80vh]">
          {/* Aesthetic Card Preview */}
          <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden transition-all ${themeStyles[cardTheme]}`}>
            <Quote className="w-10 h-10 text-amber-500/20 absolute -top-1 -left-1 pointer-events-none" />
            
            <p className="font-serif-novel text-base leading-relaxed italic text-slate-800 relative z-10">
              "{quoteText}"
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                  {novel.title}
                </span>
                <span className="text-[11px] text-slate-500">
                  {novel.author} · Hal {pageNumber}
                </span>
              </div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                NOVELIA
              </span>
            </div>
          </div>

          {/* Edit Quote Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Kutipan:
            </label>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows={3}
              placeholder="Ketik kalimat atau kutipan favorit dari novel ini..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Page Number & Theme Picker */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Halaman:</span>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['amber', 'emerald', 'indigo', 'rose'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCardTheme(t)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    cardTheme === t ? 'scale-110 border-slate-900 ring-1 ring-slate-400' : 'border-transparent'
                  } ${
                    t === 'amber' ? 'bg-amber-300' : t === 'emerald' ? 'bg-emerald-300' : t === 'indigo' ? 'bg-indigo-300' : 'bg-rose-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kutipan'}</span>
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan ke Novel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
