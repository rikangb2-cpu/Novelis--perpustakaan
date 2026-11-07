import React, { useState, useEffect, useRef } from 'react';
import { Novel, NovelChapter } from '../types/novel';
import { ambientSound, AmbientSoundType } from '../utils/ambientAudio';
import confetti from 'canvas-confetti';
import { 
  X, 
  Type, 
  Check, 
  BookmarkCheck,
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Timer,
  Quote,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Sparkles,
  ExternalLink,
  Download,
  FileCheck2
} from 'lucide-react';

interface ReaderModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordProgress: (novelId: string, pagesRead: number, note?: string, targetChapter?: number) => void;
  onOpenPdf?: (novel: Novel) => void;
  onOpenQuoteModal?: (novel: Novel) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  novel,
  isOpen,
  onClose,
  onRecordProgress,
  onOpenPdf,
  onOpenQuoteModal
}) => {
  if (!isOpen || !novel) return null;

  // View modes: 'text' (e-reader format with extracted file content) or 'pdf' (original embedded visual viewer)
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');
  
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('light');
  const [fontSize, setFontSize] = useState<number>(17); // 15, 17, 19, 21
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Active chapter state
  const chapters: NovelChapter[] = (novel.chapters && novel.chapters.length > 0)
    ? novel.chapters
    : [
        {
          id: 'chap-1',
          chapterNumber: 1,
          chapterTitle: novel.excerpt?.chapterTitle || `Bab ${novel.currentChapter || 1}: Pendahuluan Kisah`,
          content: novel.excerpt?.content || [
            novel.synopsis || 'Kisah ini dimulai dari halaman pertama naskah novel Anda...',
            'Membaca adalah petualangan imajinasi yang membuka cakrawala pemikiran yang luas.'
          ]
        }
      ];

  const initialChapIdx = Math.max(0, Math.min(chapters.length - 1, (novel.currentChapter || 1) - 1));
  const [currentChapterIdx, setCurrentChapterIdx] = useState(initialChapIdx);
  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  const readingContainerRef = useRef<HTMLDivElement>(null);

  // Reading stopwatch / timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Ambient sound
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState(0.5);

  // Sync chapter index if novel prop changes
  useEffect(() => {
    if (novel) {
      const idx = Math.max(0, Math.min(chapters.length - 1, (novel.currentChapter || 1) - 1));
      setCurrentChapterIdx(idx);
    }
  }, [novel?.id]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Clean up audio on unmount or close
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  const handleSoundChange = (type: AmbientSoundType) => {
    setActiveSound(type);
    ambientSound.play(type);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIdx(index);
    setShowChapterMenu(false);
    if (readingContainerRef.current) {
      readingContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const targetChapNum = chapters[index]?.chapterNumber || (index + 1);
    onRecordProgress(
      novel.id,
      0,
      `Buka Bab ${targetChapNum}: ${chapters[index]?.chapterTitle || ''}`,
      targetChapNum
    );
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chapters.length - 1) {
      const nextIdx = currentChapterIdx + 1;
      const targetChapNum = chapters[nextIdx]?.chapterNumber || (nextIdx + 1);
      setCurrentChapterIdx(nextIdx);
      if (readingContainerRef.current) {
        readingContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Record progress for advancing to next chapter
      const pagesRead = Math.max(5, Math.ceil((novel.totalPages || 100) / chapters.length));
      onRecordProgress(
        novel.id, 
        pagesRead, 
        `Lanjut membaca ke Bab ${targetChapNum}: ${chapters[nextIdx].chapterTitle}`,
        targetChapNum
      );
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      const prevIdx = currentChapterIdx - 1;
      setCurrentChapterIdx(prevIdx);
      if (readingContainerRef.current) {
        readingContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const targetChapNum = chapters[prevIdx]?.chapterNumber || (prevIdx + 1);
      onRecordProgress(
        novel.id,
        0,
        `Kembali ke Bab ${targetChapNum}: ${chapters[prevIdx].chapterTitle}`,
        targetChapNum
      );
    }
  };

  const themeClasses = {
    dark: 'bg-[#0f141c] text-slate-200',
    sepia: 'bg-[#f7efe1] text-[#2c221a]',
    light: 'bg-[#ffffff] text-[#1e293b]'
  };

  const topBarThemeClasses = {
    dark: 'bg-[#0f141c]/95 border-slate-800 text-slate-300',
    sepia: 'bg-[#f7efe1]/95 border-[#e2d5c3] text-[#4a3b2c]',
    light: 'bg-white/95 border-slate-200 text-slate-700'
  };

  const handleFinishSession = () => {
    const minutesSpent = Math.max(1, Math.round(timerSeconds / 60));
    const pagesRead = Math.max(5, Math.ceil((novel.totalPages || 100) / chapters.length));
    onRecordProgress(novel.id, pagesRead, `Membaca ${currentChapter.chapterTitle} (${minutesSpent} menit)`);
    setHasRecorded(true);
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      setHasRecorded(false);
    }, 2800);
  };

  const hasUploadedFile = Boolean(novel.pdfFileName || novel.sourceFileName || novel.pdfUrl);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses[readerTheme]} select-text animate-in fade-in duration-200`}>
      
      {/* Reader Top Bar */}
      <div className={`sticky top-0 z-20 flex items-center justify-between px-3 md:px-5 py-2.5 backdrop-blur-md border-b ${topBarThemeClasses[readerTheme]} select-none shadow-2xs`}>
        
        {/* Left: Close & Chapter Drawer Button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              ambientSound.stop();
              onClose();
            }}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Tutup Reader"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowChapterMenu(!showChapterMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold cursor-pointer transition-colors"
            title="Daftar Bab"
          >
            <List className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Daftar Bab ({chapters.length})</span>
          </button>
        </div>

        {/* Center: Novel Title, Current Chapter & Reading Stopwatch */}
        <div className="text-center truncate px-2 max-w-[180px] sm:max-w-xs md:max-w-md">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono tabular-nums opacity-80">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-0.5 hover:opacity-75 cursor-pointer"
              title={isTimerRunning ? 'Jeda Stopwatch' : 'Mulai Stopwatch'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
          <h4 className="text-xs font-serif-novel font-bold truncate mt-0.5">
            {novel.title} · {currentChapter.chapterTitle}
          </h4>
        </div>

        {/* Right Toolbar: View Mode Switcher, Quote, Settings */}
        <div className="flex items-center gap-1">
          {/* Mode Switcher if PDF is attached */}
          {novel.pdfUrl && (
            <div className="flex bg-black/5 dark:bg-white/10 p-0.5 rounded-lg text-xs mr-1">
              <button
                onClick={() => setViewMode('text')}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  viewMode === 'text'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Mode Teks E-Reader (Isi File Ekstraksi)"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Teks</span>
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  viewMode === 'pdf'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Mode Dokumen PDF Asli"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">PDF</span>
              </button>
            </div>
          )}

          {onOpenQuoteModal && (
            <button
              onClick={() => onOpenQuoteModal(novel)}
              className="p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              title="Buat Kartu Kutipan Estetis"
            >
              <Quote className="w-4 h-4 text-amber-500" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Pengaturan Tampilan & Suara Relaksasi"
          >
            <Type className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chapter Selection Drawer / Dropdown */}
      {showChapterMenu && (
        <div className="absolute top-14 left-4 z-40 w-72 max-h-[70vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div>
              <h5 className="text-xs font-bold">Daftar Bab Novel</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {chapters.length} Bab dari file naskah
              </p>
            </div>
            <button
              onClick={() => setShowChapterMenu(false)}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {chapters.map((chap, idx) => (
              <button
                key={chap.id || idx}
                onClick={() => handleSelectChapter(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  currentChapterIdx === idx
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate pr-2">{chap.chapterTitle}</span>
                {currentChapterIdx === idx && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reader Customizer Panel Dropdown (Theme, Font & Ambient Audio) */}
      {showSettings && (
        <div className={`px-5 py-3.5 border-b shadow-md select-none ${
          readerTheme === 'dark' ? 'bg-[#18202d] border-slate-800' : readerTheme === 'sepia' ? 'bg-[#eee3d1] border-[#d8c7af]' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Row 1: Ambient Relaxation Audio */}
          <div className="mb-3.5 pb-3 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-1.5 opacity-90">
                <Headphones className="w-3.5 h-3.5 text-amber-600" />
                Suara Latar Membaca (Relaksasi)
              </span>
              {activeSound !== 'none' && (
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Volume2 className="w-3.5 h-3.5" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-16 accent-amber-500 cursor-pointer h-1"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'none', label: 'Mati' },
                  { id: 'rain', label: '🌧️ Hujan Tenang' },
                  { id: 'fireplace', label: '🔥 Api Unggun' },
                  { id: 'waves', label: '🌊 Ombak Samudra' },
                  { id: 'cafe', label: '☕ Suasana Kafe' }
                ] as const
              ).map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSoundChange(sound.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeSound === sound.id
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-black/5 hover:bg-black/10 dark:bg-white/10'
                  }`}
                >
                  {sound.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Theme Palette & Font Size */}
          <div className="flex items-center justify-between">
            {/* Color Paper */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium opacity-80">Kertas:</span>
              <button
                onClick={() => setReaderTheme('light')}
                className={`w-6 h-6 rounded-full bg-white border ${
                  readerTheme === 'light' ? 'ring-2 ring-amber-600' : 'border-slate-300'
                } flex items-center justify-center cursor-pointer`}
                title="Putih Bersih"
              />
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`w-6 h-6 rounded-full bg-[#f7efe1] border ${
                  readerTheme === 'sepia' ? 'ring-2 ring-amber-600' : 'border-stone-400'
                } flex items-center justify-center cursor-pointer`}
                title="Sepia Hangat"
              />
              <button
                onClick={() => setReaderTheme('dark')}
                className={`w-6 h-6 rounded-full bg-[#0f141c] border ${
                  readerTheme === 'dark' ? 'ring-2 ring-amber-400' : 'border-slate-700'
                } flex items-center justify-center cursor-pointer`}
                title="Mode Malam OLED"
              />
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium opacity-80">Ukuran:</span>
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="px-2 py-0.5 text-xs font-bold rounded bg-black/10 hover:bg-black/20 cursor-pointer"
              >
                A-
              </button>
              <span className="text-xs font-mono w-5 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="px-2 py-0.5 text-xs font-bold rounded bg-black/10 hover:bg-black/20 cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading View Content */}
      {viewMode === 'text' ? (
        /* MODE 1: E-READER TEXT (Extracted directly from uploaded novel file) */
        <div 
          ref={readingContainerRef}
          className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-14 py-8 leading-relaxed font-serif-novel no-scrollbar max-w-3xl mx-auto w-full"
        >
          {/* Chapter Heading Banner */}
          <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-sans opacity-60 font-bold">
                {novel.genre} · Bab {currentChapterIdx + 1} dari {chapters.length}
              </span>
              {hasUploadedFile && (
                <span className="inline-flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                  <FileCheck2 className="w-3 h-3" />
                  <span>Isi File Asli</span>
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {currentChapter.chapterTitle}
            </h2>
            <p className="text-xs italic opacity-75 mt-0.5">
              Karya {novel.author}
            </p>
          </div>

          {/* Real Extracted Paragraphs */}
          <div className="space-y-6" style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
            {currentChapter.content && currentChapter.content.length > 0 ? (
              currentChapter.content.map((para, idx) => (
                <p key={idx} className="indent-6 text-justify">
                  {idx === 0 ? (
                    <span>
                      <span className="float-left text-4xl leading-none font-bold mr-2 mt-1 opacity-90 text-amber-600">
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </span>
                  ) : (
                    para
                  )}
                </p>
              ))
            ) : (
              <p className="italic opacity-70 text-center py-10">
                Tidak ada teks yang dapat dimuat pada bab ini.
              </p>
            )}
          </div>

          {/* Chapter Navigation Buttons (Previous & Next Chapter) */}
          <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3 font-sans">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIdx === 0}
              className="px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bab Sebelumnya</span>
            </button>

            <span className="text-xs text-center font-mono opacity-60">
              {currentChapterIdx + 1} / {chapters.length}
            </span>

            {currentChapterIdx < chapters.length - 1 ? (
              <button
                onClick={handleNextChapter}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>Bab Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishSession}
                disabled={hasRecorded}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Selesaikan Novel</span>
              </button>
            )}
          </div>

          {/* Record Session Milestone */}
          <div className="mt-6 pt-4 flex flex-col items-center select-none font-sans">
            <button
              onClick={handleFinishSession}
              disabled={hasRecorded}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                hasRecorded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-amber-600 hover:text-white'
              }`}
            >
              {hasRecorded ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Sesi Tercatat di Riwayat Membaca!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-amber-500" />
                  <span>Tandai Progres Sesi Membaca Ini</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* MODE 2: ORIGINAL EMBEDDED PDF VIEWER */
        <div className="flex-1 w-full h-full flex flex-col bg-slate-950">
          {novel.pdfUrl ? (
            <iframe
              src={`${novel.pdfUrl}#toolbar=1&navpanes=0`}
              title={`PDF ${novel.title}`}
              className="w-full flex-1 border-none bg-slate-900"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">File PDF Belum Tersedia</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Lampirkan file PDF untuk novel ini agar dapat dibaca dalam format dokumen PDF asli.
              </p>
              <button
                onClick={() => setViewMode('text')}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer"
              >
                Kembali ke Mode Teks
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
