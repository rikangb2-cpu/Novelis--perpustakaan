import React, { useState, useEffect } from 'react';
import { Novel, TabType, UserProfile, NovelStatus, BookQuote } from './types/novel';
import { INITIAL_BOOKS } from './data/initialBooks';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { CollectionTab } from './components/tabs/CollectionTab';
import { SearchTab } from './components/tabs/SearchTab';
import { FavoritesTab } from './components/tabs/FavoritesTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { BookDetailModal } from './components/BookDetailModal';
import { ReaderModal } from './components/ReaderModal';
import { AddBookModal } from './components/AddBookModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SupabaseModal } from './components/SupabaseModal';
import { QuoteCardModal } from './components/QuoteCardModal';

const STORAGE_KEY_BOOKS = 'novelia_books_v1';
const STORAGE_KEY_PROFILE = 'novelia_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Rian Anggara',
  dailyGoalMinutes: 30,
  streakDays: 7,
  favoriteGenre: 'Sastra & Fiksi Sejarah',
  avatarSeed: 'rian'
};

export default function App() {
  // Load initial novels from localStorage or default
  const [novels, setNovels] = useState<Novel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (saved) {
        const parsed: Novel[] = JSON.parse(saved);
        return parsed.map((item) => {
          const defaultMatch = INITIAL_BOOKS.find((b) => b.id === item.id);
          if (defaultMatch && defaultMatch.coverImageUrl && !item.coverImageUrl) {
            return { ...item, coverImageUrl: defaultMatch.coverImageUrl };
          }
          return item;
        });
      }
    } catch (e) {
      console.error('Failed to load books from localStorage', e);
    }
    return INITIAL_BOOKS;
  });

  // Load user profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCollectionFolder, setSelectedCollectionFolder] = useState<'all' | 'reading' | 'completed' | 'want_to_read' | 'genres'>('all');

  // Modals state
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [readerNovel, setReaderNovel] = useState<Novel | null>(null);
  const [pdfNovel, setPdfNovel] = useState<Novel | null>(null);
  const [quoteNovel, setQuoteNovel] = useState<Novel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(novels));
    } catch (e) {
      console.error('Failed to save books', e);
    }
  }, [novels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Keep selectedNovel in sync with novels state
  useEffect(() => {
    if (selectedNovel) {
      const updated = novels.find((n) => n.id === selectedNovel.id);
      if (updated) {
        setSelectedNovel(updated);
      }
    }
  }, [novels]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Add novel
  const handleAddNovel = (newNovel: Novel) => {
    setNovels((prev) => [newNovel, ...prev]);
    showToast(`"${newNovel.title}" berhasil ditambahkan ke rak!`);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updatedFav = !n.isFavorite;
          showToast(updatedFav ? `Ditambahkan ke Favorit` : `Dihapus dari Favorit`);
          return { ...n, isFavorite: updatedFav };
        }
        return n;
      })
    );
  };

  // Update novel reading status
  const handleUpdateStatus = (id: string, status: NovelStatus) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          let updatedCurrentPage = n.currentPage;
          if (status === 'completed') {
            updatedCurrentPage = n.totalPages;
          }
          return {
            ...n,
            status,
            currentPage: updatedCurrentPage,
            lastReadDate: 'Hari ini'
          };
        }
        return n;
      })
    );
    showToast(`Status membaca diperbarui`);
  };

  // Update page progress
  const handleUpdateProgress = (id: string, page: number, chapter: number) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const isDone = page >= n.totalPages;
          return {
            ...n,
            currentPage: Math.min(n.totalPages, Math.max(0, page)),
            currentChapter: Math.min(n.totalChapters, Math.max(1, chapter)),
            status: isDone ? 'completed' : n.status === 'want_to_read' ? 'reading' : n.status,
            lastReadDate: 'Hari ini'
          };
        }
        return n;
      })
    );
  };

  // Update rating
  const handleUpdateRating = (id: string, rating: number) => {
    setNovels((prev) =>
      prev.map((n) => (n.id === id ? { ...n, rating } : n))
    );
    showToast(`Rating disimpan: ${rating} Bintang`);
  };

  // Update notes
  const handleUpdateNotes = (id: string, notes: string) => {
    setNovels((prev) =>
      prev.map((n) => (n.id === id ? { ...n, personalNotes: notes } : n))
    );
    showToast(`Catatan pribadi disimpan`);
  };

  // Attach PDF to novel
  const handleAttachPdf = (novelId: string, file: File, dataUrl: string) => {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novelId) {
          return {
            ...n,
            pdfUrl: dataUrl,
            pdfFileName: file.name,
            pdfFileSize: sizeInMb
          };
        }
        return n;
      })
    );
    showToast(`File PDF ${file.name} berhasil dilampirkan!`);
  };

  // Save Quote to novel
  const handleSaveQuote = (novelId: string, quote: BookQuote) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novelId) {
          return {
            ...n,
            quotes: [quote, ...(n.quotes || [])]
          };
        }
        return n;
      })
    );
    showToast(`Kutipan berhasil disimpan ke novel!`);
  };

  // Delete novel
  const handleDeleteNovel = (id: string) => {
    const novelToDelete = novels.find((n) => n.id === id);
    setNovels((prev) => prev.filter((n) => n.id !== id));
    if (selectedNovel?.id === id) {
      setSelectedNovel(null);
    }
    showToast(`"${novelToDelete?.title || 'Novel'}" telah dihapus.`);
  };

  // Record reading session progress from Reader
  const handleRecordProgress = (novelId: string, pagesRead: number, note?: string) => {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === novelId) {
          const newCurrentPage = Math.min(n.totalPages, n.currentPage + pagesRead);
          const newChapter = Math.min(n.totalChapters, n.currentChapter + 1);
          const isCompleted = newCurrentPage >= n.totalPages;

          const newLog = {
            id: `log-${Date.now()}`,
            date: dateStr,
            time: timeStr,
            pagesRead,
            chapter: n.currentChapter,
            note: note || `Selesai membaca Bab ${n.currentChapter}`
          };

          return {
            ...n,
            currentPage: newCurrentPage,
            currentChapter: newChapter,
            status: isCompleted ? 'completed' : 'reading',
            lastReadDate: 'Hari ini, ' + timeStr,
            readingHistory: [newLog, ...(n.readingHistory || [])]
          };
        }
        return n;
      })
    );

    showToast(`+${pagesRead} halaman dicatat ke riwayat membaca!`);
  };

  // Profile name update
  const handleUpdateProfileName = (name: string) => {
    setProfile((prev) => ({ ...prev, name }));
    showToast(`Nama profil diubah menjadi ${name}`);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast(`Pengaturan profil diperbarui`);
  };

  // Reset data to defaults
  const handleResetData = () => {
    setNovels(INITIAL_BOOKS);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY_BOOKS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    showToast('Perpustakaan dikembalikan ke koleksi awal.');
  };

  const handleNavigateToCollection = (folder?: 'all' | 'reading' | 'completed' | 'want_to_read') => {
    if (folder) {
      setSelectedCollectionFolder(folder);
    }
    setActiveTab('collection');
  };

  const handleSelectNovelById = (id: string) => {
    const target = novels.find((n) => n.id === id);
    if (target) {
      setSelectedNovel(target);
    }
  };

  const favoritesCount = novels.filter((n) => n.isFavorite).length;

  return (
    <AndroidFrame>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 backdrop-blur-md">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Main Tab Screen Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeTab
            novels={novels}
            profile={profile}
            onSelectNovel={setSelectedNovel}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenReader={setReaderNovel}
            onNavigateToCollection={handleNavigateToCollection}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionTab
            novels={novels}
            initialFolder={selectedCollectionFolder}
            onSelectNovel={setSelectedNovel}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            novels={novels}
            onSelectNovel={setSelectedNovel}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab
            novels={novels}
            onSelectNovel={setSelectedNovel}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToCollection={() => setActiveTab('collection')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            novels={novels}
            onUpdateProfileName={handleUpdateProfileName}
            onResetData={handleResetData}
            onSelectNovelById={handleSelectNovelById}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        favoritesCount={favoritesCount}
      />

      {/* Detail Novel Screen Modal */}
      <BookDetailModal
        novel={selectedNovel}
        isOpen={Boolean(selectedNovel)}
        onClose={() => setSelectedNovel(null)}
        onToggleFavorite={handleToggleFavorite}
        onUpdateStatus={handleUpdateStatus}
        onUpdateProgress={handleUpdateProgress}
        onUpdateRating={handleUpdateRating}
        onUpdateNotes={handleUpdateNotes}
        onDeleteNovel={handleDeleteNovel}
        onOpenReader={(novel) => {
          setSelectedNovel(null);
          setReaderNovel(novel);
        }}
        onOpenPdfModal={(novel) => {
          setPdfNovel(novel);
        }}
        onOpenQuoteModal={(novel) => {
          setQuoteNovel(novel);
        }}
      />

      {/* Reader View Modal */}
      <ReaderModal
        novel={readerNovel}
        isOpen={Boolean(readerNovel)}
        onClose={() => setReaderNovel(null)}
        onRecordProgress={handleRecordProgress}
        onOpenPdf={(novel) => {
          setPdfNovel(novel);
        }}
        onOpenQuoteModal={(novel) => {
          setQuoteNovel(novel);
        }}
      />

      {/* PDF Viewer & Upload Modal */}
      <PdfViewerModal
        novel={pdfNovel}
        isOpen={Boolean(pdfNovel)}
        onClose={() => setPdfNovel(null)}
        onAttachPdf={handleAttachPdf}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* Aesthetic Quote Card Modal */}
      <QuoteCardModal
        novel={quoteNovel}
        isOpen={Boolean(quoteNovel)}
        onClose={() => setQuoteNovel(null)}
        onSaveQuote={handleSaveQuote}
      />

      {/* Supabase Cloud Setup & Sync Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        novels={novels}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Add Novel Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNovel={handleAddNovel}
      />
    </AndroidFrame>
  );
}
