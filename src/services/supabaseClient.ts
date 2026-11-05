import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Novel, ReadingLog, BookQuote } from '../types/novel';

const STORAGE_KEY_SUPABASE_URL = 'novelia_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'novelia_supabase_anon_key';

export const DEFAULT_SUPABASE_URL = 'https://pgwidcasecyaqnwqkkbb.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnd2lkY2FzZWN5YXFud3Fra2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NzIyOTIsImV4cCI6MjEwOTQ0ODI5Mn0.m0PJ-HF5QISds3QehLq_TVpj8DQBPs3moYAxFrEr9vg';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '' : '';

  return {
    url: (storedUrl || envUrl || DEFAULT_SUPABASE_URL).trim(),
    anonKey: (storedKey || envKey || DEFAULT_SUPABASE_ANON_KEY).trim()
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);

    // Recreate client
    supabaseClientInstance = null;
  }
}

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  const { url, anonKey } = getSupabaseCredentials();

  if (url && anonKey) {
    try {
      supabaseClientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return supabaseClientInstance;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
    }
  }

  return null;
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

// Test connection and schema readiness
export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<{
  success: boolean;
  message: string;
  novelCount?: number;
  tablesReady?: boolean;
}> {
  const { url: defaultUrl, anonKey: defaultKey } = getSupabaseCredentials();
  const testUrl = (overrideUrl || defaultUrl).trim();
  const testKey = (overrideKey || defaultKey).trim();

  if (!testUrl || !testKey) {
    return {
      success: false,
      message: 'Supabase URL dan Anon Key belum diisi.'
    };
  }

  try {
    const testClient = createClient(testUrl, testKey);
    const { count, error } = await testClient
      .from('novels')
      .select('id', { count: 'exact', head: true });

    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message.includes('relation "public.novels" does not exist') ||
        error.message.includes('relation "novels" does not exist')
      ) {
        return {
          success: false,
          tablesReady: false,
          message: 'Koneksi ke Supabase aktif, namun tabel "novels" belum dibuat. Buka tab "Skrip SQL Supabase" lalu salin & jalankan skrip tersebut di SQL Editor Supabase.'
        };
      }
      return {
        success: false,
        message: `Gagal mengakses database: ${error.message}`
      };
    }

    return {
      success: true,
      tablesReady: true,
      novelCount: count ?? 0,
      message: `Terhubung dengan sukses ke Supabase! Ditemukan ${count ?? 0} novel di database cloud.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Kesalahan saat menghubungkan ke Supabase: ${err?.message || 'Periksa kembali URL dan Anon Key Anda'}`
    };
  }
}

// Convert DB snake_case row to Novel model
export function mapRowToNovel(row: any): Novel {
  return {
    id: row.id,
    title: row.title || 'Tanpa Judul',
    author: row.author || 'Anonim',
    genre: row.genre || 'Fiksi',
    coverColor: row.cover_color || 'from-amber-700 via-stone-800 to-black',
    coverPattern: row.cover_pattern || 'stars',
    coverImageUrl: row.cover_image_url || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfFileName: row.pdf_file_name || undefined,
    pdfFileSize: row.pdf_file_size || undefined,
    pdfPageCount: row.pdf_page_count || undefined,
    totalPages: Number(row.total_pages) || 200,
    currentPage: Number(row.current_page) || 0,
    totalChapters: Number(row.total_chapters) || 10,
    currentChapter: Number(row.current_chapter) || 1,
    synopsis: row.synopsis || '',
    isFavorite: Boolean(row.is_favorite),
    status: row.status || 'want_to_read',
    rating: Number(row.rating) || 5,
    personalNotes: row.personal_notes || '',
    lastReadDate: row.last_read_date || 'Belum dibaca',
    addedDate: row.added_date || 'Hari ini',
    excerpt: typeof row.excerpt === 'object' && row.excerpt !== null ? row.excerpt : {
      chapterTitle: `Bab ${row.current_chapter || 1}: Bagian Awal`,
      content: [row.synopsis || 'Membaca membuka cakrawala pemikiran yang luas.']
    },
    readingHistory: Array.isArray(row.reading_logs) ? row.reading_logs.map(mapRowToReadingLog) : [],
    quotes: Array.isArray(row.book_quotes) ? row.book_quotes.map(mapRowToBookQuote) : []
  };
}

// Convert Novel to Supabase snake_case row
export function mapNovelToRow(novel: Novel) {
  return {
    id: novel.id,
    title: novel.title,
    author: novel.author,
    genre: novel.genre,
    cover_color: novel.coverColor,
    cover_pattern: novel.coverPattern,
    cover_image_url: novel.coverImageUrl || null,
    pdf_url: novel.pdfUrl || null,
    pdf_file_name: novel.pdfFileName || null,
    pdf_file_size: novel.pdfFileSize || null,
    total_pages: novel.totalPages,
    current_page: novel.currentPage,
    total_chapters: novel.totalChapters,
    current_chapter: novel.currentChapter,
    synopsis: novel.synopsis,
    is_favorite: novel.isFavorite,
    status: novel.status,
    rating: novel.rating,
    personal_notes: novel.personalNotes,
    last_read_date: novel.lastReadDate,
    added_date: novel.addedDate,
    excerpt: novel.excerpt || null
  };
}

export function mapRowToReadingLog(row: any): ReadingLog {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    pagesRead: Number(row.pages_read) || 0,
    chapter: Number(row.chapter) || 1,
    durationMinutes: Number(row.duration_minutes) || 0,
    note: row.note || undefined
  };
}

export function mapRowToBookQuote(row: any): BookQuote {
  return {
    id: row.id,
    text: row.text || '',
    page: row.page !== null && row.page !== undefined ? Number(row.page) : undefined,
    date: row.date || 'Hari ini'
  };
}

// ==========================================
// SUPABASE DATABASE OPERATIONS
// ==========================================

export async function fetchNovelsFromSupabase(): Promise<Novel[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    // Try nested relations first
    const { data: novelsData, error } = await client
      .from('novels')
      .select('*, reading_logs(*), book_quotes(*)')
      .order('created_at', { ascending: false });

    if (!error && novelsData) {
      return novelsData.map(mapRowToNovel);
    }

    // Fallback: simple query if relations or foreign keys aren't set yet
    const { data: simpleData, error: simpleError } = await client
      .from('novels')
      .select('*')
      .order('added_date', { ascending: false });

    if (!simpleError && simpleData) {
      return simpleData.map(mapRowToNovel);
    }

    if (error) {
      console.warn('Supabase fetch error:', error.message);
    }
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
  }

  return null;
}

export async function insertNovelToSupabase(novel: Novel): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapNovelToRow(novel);
    const { error } = await client.from('novels').upsert(row);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return false;
    }

    // Insert initial reading logs if any
    if (novel.readingHistory && novel.readingHistory.length > 0) {
      const logs = novel.readingHistory.map((l) => ({
        id: l.id,
        novel_id: novel.id,
        date: l.date,
        time: l.time,
        pages_read: l.pagesRead,
        chapter: l.chapter,
        note: l.note || null,
        duration_minutes: l.durationMinutes || 0
      }));
      await client.from('reading_logs').upsert(logs);
    }

    // Insert quotes if any
    if (novel.quotes && novel.quotes.length > 0) {
      const quotes = novel.quotes.map((q) => ({
        id: q.id,
        novel_id: novel.id,
        text: q.text,
        page: q.page ?? null,
        date: q.date
      }));
      await client.from('book_quotes').upsert(quotes);
    }

    return true;
  } catch (err) {
    console.error('Supabase insert exception:', err);
    return false;
  }
}

export async function updateNovelInSupabase(id: string, updates: Partial<Novel>): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.genre !== undefined) dbUpdates.genre = updates.genre;
    if (updates.currentPage !== undefined) dbUpdates.current_page = updates.currentPage;
    if (updates.totalPages !== undefined) dbUpdates.total_pages = updates.totalPages;
    if (updates.currentChapter !== undefined) dbUpdates.current_chapter = updates.currentChapter;
    if (updates.totalChapters !== undefined) dbUpdates.total_chapters = updates.totalChapters;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.personalNotes !== undefined) dbUpdates.personal_notes = updates.personalNotes;
    if (updates.lastReadDate !== undefined) dbUpdates.last_read_date = updates.lastReadDate;
    if (updates.pdfUrl !== undefined) dbUpdates.pdf_url = updates.pdfUrl;
    if (updates.pdfFileName !== undefined) dbUpdates.pdf_file_name = updates.pdfFileName;
    if (updates.pdfFileSize !== undefined) dbUpdates.pdf_file_size = updates.pdfFileSize;
    if (updates.coverImageUrl !== undefined) dbUpdates.cover_image_url = updates.coverImageUrl;

    const { error } = await client.from('novels').update(dbUpdates).eq('id', id);

    if (error) {
      console.error('Supabase update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase update exception:', err);
    return false;
  }
}

export async function deleteNovelFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('novels').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete exception:', err);
    return false;
  }
}

export async function insertReadingLogToSupabase(novelId: string, log: ReadingLog): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: log.id,
      novel_id: novelId,
      date: log.date,
      time: log.time,
      pages_read: log.pagesRead,
      chapter: log.chapter,
      note: log.note || null,
      duration_minutes: log.durationMinutes || 0
    };

    const { error } = await client.from('reading_logs').upsert(row);
    if (error) {
      console.error('Supabase reading_logs insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase reading_logs exception:', err);
    return false;
  }
}

export async function insertBookQuoteToSupabase(novelId: string, quote: BookQuote): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: quote.id,
      novel_id: novelId,
      text: quote.text,
      page: quote.page ?? null,
      date: quote.date
    };

    const { error } = await client.from('book_quotes').upsert(row);
    if (error) {
      console.error('Supabase book_quotes insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase book_quotes exception:', err);
    return false;
  }
}

// Upload PDF to Supabase Storage bucket ('novel-pdfs')
export async function uploadPdfToSupabase(file: File, novelId: string): Promise<{ publicUrl: string | null; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { publicUrl: null, error: 'Supabase client belum terhubung' };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `novels/${novelId}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await client.storage
      .from('novel-pdfs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return { publicUrl: null, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage
      .from('novel-pdfs')
      .getPublicUrl(filePath);

    return { publicUrl: publicUrlData?.publicUrl || null };
  } catch (err: any) {
    console.error('Supabase storage upload exception:', err);
    return { publicUrl: null, error: err?.message || 'Gagal mengunggah file' };
  }
}

// Auto-seed initial books into Supabase if connected and empty
export async function seedSupabaseIfEmpty(initialNovels: Novel[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { count, error } = await client
      .from('novels')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.warn('Could not check novels count:', error.message);
      return false;
    }

    if (count === 0) {
      const rows = initialNovels.map(mapNovelToRow);
      const { error: seedError } = await client.from('novels').insert(rows);
      if (!seedError) {
        console.log('Successfully seeded initial novels into Supabase!');
        return true;
      }
    }
  } catch (err) {
    console.error('Supabase seed exception:', err);
  }
  return false;
}

// Sync all local novels, reading logs, and quotes to Supabase
export async function syncAllLocalNovelsToSupabase(novels: Novel[]): Promise<{
  success: boolean;
  insertedCount: number;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      insertedCount: 0,
      message: 'Supabase belum terhubung. Konfigurasikan URL & Anon Key terlebih dahulu.'
    };
  }

  try {
    let successCount = 0;
    for (const novel of novels) {
      const ok = await insertNovelToSupabase(novel);
      if (ok) successCount++;
    }

    return {
      success: true,
      insertedCount: successCount,
      message: `Berhasil menyinkronkan ${successCount} dari ${novels.length} novel ke Supabase Cloud!`
    };
  } catch (err: any) {
    return {
      success: false,
      insertedCount: 0,
      message: `Gagal sinkronisasi: ${err?.message || 'Terjadi kesalahan'}`
    };
  }
}
