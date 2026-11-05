export type NovelStatus = 'reading' | 'completed' | 'want_to_read';

export interface ReadingLog {
  id: string;
  date: string; // e.g. "5 Nov 2026"
  time: string; // e.g. "14:30"
  pagesRead: number;
  chapter: number;
  note?: string;
  durationMinutes?: number;
}

export interface NovelExcerpt {
  chapterTitle: string;
  content: string[];
}

export interface NovelChapter {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string[];
  pageStart?: number;
  pageEnd?: number;
}

export interface BookQuote {
  id: string;
  text: string;
  page?: number;
  date: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  coverPattern: 'geometric' | 'classic' | 'stars' | 'botanical' | 'minimalist';
  coverImageUrl?: string;
  coverCustomUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  pdfPageCount?: number;
  sourceFileName?: string;
  sourceFileType?: 'pdf' | 'txt' | 'md' | 'manual';
  totalPages: number;
  currentPage: number;
  totalChapters: number;
  currentChapter: number;
  synopsis: string;
  isFavorite: boolean;
  status: NovelStatus;
  rating: number; // 1 to 5
  personalNotes: string;
  lastReadDate: string;
  addedDate: string;
  excerpt: NovelExcerpt;
  chapters?: NovelChapter[];
  readingHistory: ReadingLog[];
  quotes?: BookQuote[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  dailyGoalMinutes: number;
  streakDays: number;
  favoriteGenre: string;
  avatarSeed: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export type TabType = 'home' | 'collection' | 'search' | 'favorites' | 'profile';
