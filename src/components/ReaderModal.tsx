import React, { useState, useEffect } from 'react';
import { Novel } from '../types/novel';
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
  FileText
} from 'lucide-react';

interface ReaderModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordProgress: (novelId: string, pagesRead: number, note?: string) => void;
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

  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('light');
  const [fontSize, setFontSize] = useState<number>(17); // 15, 17, 19, 21
  const [showSettings, setShowSettings] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Reading stopwatch / timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Ambient sound
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState(0.5);

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

  const themeClasses = {
    dark: 'bg-[#0f141c] text-slate-200',
    sepia: 'bg-[#f7efe1] text-[#2c221a]',
    light: 'bg-[#ffffff] text-[#1e293b]'
  };

  const topBarThemeClasses = {
    dark: 'bg-[#0f141c]/90 border-slate-800 text-slate-300',
    sepia: 'bg-[#f7efe1]/95 border-[#e2d5c3] text-[#4a3b2c]',
    light: 'bg-white/95 border-slate-200 text-slate-700'
  };

  const excerpt = novel.excerpt || {
    chapterTitle: `Bab ${novel.currentChapter || 1}: Pendahuluan Kisah`,
    content: [
      novel.synopsis || 'Kisah ini dimulai dari halaman pertama perpustakaan Anda...',
      'Membaca adalah jendela menuju ribuan petualangan yang tak terbatas oleh ruang dan waktu.',
      'Lanjutkan membaca novel ini di buku fisik atau e-book resmi Anda untuk kisah selengkapnya.'
    ]
  };

  const handleFinishSession = () => {
    const minutesSpent = Math.max(1, Math.round(timerSeconds / 60));
    onRecordProgress(novel.id, 15, `Membaca ${excerpt.chapterTitle} (${minutesSpent} menit)`);
    setHasRecorded(true);
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      setHasRecorded(false);
    }, 2800);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses[readerTheme]} select-text animate-in fade-in duration-200`}>
      {/* Reader Top Bar */}
      <div className={`sticky top-0 z-20 flex items-center justify-between px-4 py-2.5 backdrop-blur-md border-b ${topBarThemeClasses[readerTheme]} select-none`}>
        <button
          onClick={() => {
            ambientSound.stop();
            onClose();
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Tutup Reader"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Novel Title & Reading Stopwatch */}
        <div className="text-center truncate px-2">
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
          <h4 className="text-xs font-serif-novel font-bold truncate max-w-[180px] md:max-w-xs mt-0.5">
            {novel.title} · {excerpt.chapterTitle}
          </h4>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-1">
          {onOpenQuoteModal && (
            <button
              onClick={() => onOpenQuoteModal(novel)}
              className="p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              title="Buat Kartu Kutipan"
            >
              <Quote className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {novel.pdfUrl && onOpenPdf && (
            <button
              onClick={() => onOpenPdf(novel)}
              className="p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              title="Buka Dokumen PDF"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
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

      {/* Book Reading Body */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 leading-relaxed font-serif-novel no-scrollbar max-w-3xl mx-auto w-full">
        <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/10">
          <p className="text-xs uppercase tracking-widest font-sans opacity-60">
            {novel.genre}
          </p>
          <h2 className="text-xl md:text-2xl font-bold mt-1">
            {excerpt.chapterTitle}
          </h2>
          <p className="text-xs italic opacity-75 mt-0.5">
            Karya {novel.author}
          </p>
        </div>

        <div className="space-y-6" style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
          {excerpt.content.map((para, idx) => (
            <p key={idx} className="indent-6 text-justify">
              {idx === 0 ? (
                <span>
                  <span className="float-left text-4xl leading-none font-bold mr-2 mt-1 opacity-90">
                    {para.charAt(0)}
                  </span>
                  {para.slice(1)}
                </span>
              ) : (
                para
              )}
            </p>
          ))}
        </div>

        {/* Reader Note & Log Trigger */}
        <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col items-center select-none font-sans">
          <button
            onClick={handleFinishSession}
            disabled={hasRecorded}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              hasRecorded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {hasRecorded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Sesi Selesai! (+15 hal dicatat)</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Tandai Selesai Membaca Bab Ini</span>
              </>
            )}
          </button>
          <p className="mt-2 text-[11px] opacity-60 text-center">
            Mencatat sesi ini akan memperbarui riwayat membaca dan streak di profil Anda.
          </p>
        </div>
      </div>

      {/* Reader Bottom Navigation Bar */}
      <div className={`h-12 border-t px-6 flex items-center justify-between text-xs select-none ${topBarThemeClasses[readerTheme]}`}>
        <span className="opacity-75 font-sans">
          Hal {novel.currentPage} dari {novel.totalPages}
        </span>
        <span className="opacity-75 font-sans">
          Bab {novel.currentChapter} / {novel.totalChapters}
        </span>
      </div>
    </div>
  );
};
