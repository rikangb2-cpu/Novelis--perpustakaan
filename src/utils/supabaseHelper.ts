import { Novel, ReadingLog } from '../types/novel';

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SKRIP SETUP DATABASE SUPABASE UNTUK NOVELIA
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query
-- ==========================================

-- 1. Buat Tabel Novel (Novels Table)
CREATE TABLE IF NOT EXISTS public.novels (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  cover_color TEXT,
  cover_pattern TEXT,
  cover_image_url TEXT,
  pdf_url TEXT,
  pdf_file_name TEXT,
  pdf_file_size TEXT,
  pdf_page_count INT,
  total_pages INT NOT NULL DEFAULT 100,
  current_page INT NOT NULL DEFAULT 0,
  total_chapters INT NOT NULL DEFAULT 10,
  current_chapter INT NOT NULL DEFAULT 1,
  synopsis TEXT,
  is_favorite BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'want_to_read',
  rating INT DEFAULT 5,
  personal_notes TEXT,
  last_read_date TEXT,
  added_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Buat Tabel Riwayat Baca (Reading Logs Table)
CREATE TABLE IF NOT EXISTS public.reading_logs (
  id TEXT PRIMARY KEY,
  novel_id TEXT REFERENCES public.novels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  pages_read INT NOT NULL,
  chapter INT NOT NULL,
  duration_minutes INT DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Buat Tabel Kutipan Buku (Quotes Table)
CREATE TABLE IF NOT EXISTS public.book_quotes (
  id TEXT PRIMARY KEY,
  novel_id TEXT REFERENCES public.novels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  page INT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_quotes ENABLE ROW LEVEL SECURITY;

-- 5. Buat Kebijakan Akses (RLS Policies)
CREATE POLICY "Pengguna dapat mengelola novel mereka sendiri" 
ON public.novels FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pengguna dapat mengelola riwayat baca mereka sendiri" 
ON public.reading_logs FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pengguna dapat mengelola kutipan mereka sendiri" 
ON public.book_quotes FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 6. Setup Storage Bucket untuk File PDF Novel
-- Buat bucket dengan nama: 'novel-pdfs' di tab Storage Supabase.
`;

export function exportLibraryToSupabaseJson(novels: Novel[]): string {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    appName: 'NOVELIA – Perpustakaan Digital Pribadi',
    totalNovels: novels.length,
    data: {
      novels: novels.map((n) => ({
        id: n.id,
        title: n.title,
        author: n.author,
        genre: n.genre,
        total_pages: n.totalPages,
        current_page: n.currentPage,
        total_chapters: n.totalChapters,
        current_chapter: n.currentChapter,
        status: n.status,
        rating: n.rating,
        synopsis: n.synopsis,
        cover_image_url: n.coverImageUrl || null,
        pdf_url: n.pdfUrl || null,
        pdf_file_name: n.pdfFileName || null,
        pdf_file_size: n.pdfFileSize || null,
        personal_notes: n.personalNotes || null,
        is_favorite: n.isFavorite,
        added_date: n.addedDate,
        last_read_date: n.lastReadDate
      })),
      reading_logs: novels.flatMap((n) =>
        (n.readingHistory || []).map((l) => ({
          id: l.id,
          novel_id: n.id,
          date: l.date,
          time: l.time,
          pages_read: l.pagesRead,
          chapter: l.chapter,
          note: l.note || null,
          duration_minutes: l.durationMinutes || 0
        }))
      )
    }
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function generatePrintablePdfCard(novel: Novel) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Mohon izinkan pop-up peramban untuk mencetak ringkasan PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Novel: ${novel.title} - NOVELIA</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          margin: 40px;
          color: #1e293b;
          line-height: 1.6;
        }
        .header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        h1 {
          margin: 10px 0 5px 0;
          font-size: 28px;
        }
        .author {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 15px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          color: #475569;
          margin-top: 25px;
          margin-bottom: 8px;
        }
        .synopsis {
          text-align: justify;
          background: #ffffff;
          padding: 15px;
          border-left: 4px solid #f59e0b;
        }
        .footer {
          margin-top: 50px;
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="badge">NOVELIA Digital Library</span>
        <h1>${novel.title}</h1>
        <div class="author">Karya: ${novel.author} · Genre: ${novel.genre}</div>
      </div>

      <div class="grid">
        <div>
          <strong>Status Membaca:</strong> ${novel.status === 'completed' ? 'Telah Selesai' : novel.status === 'reading' ? 'Sedang Dibaca' : 'Daftar Ingin Baca'}<br>
          <strong>Halaman:</strong> ${novel.currentPage} dari ${novel.totalPages} hal (${Math.round((novel.currentPage / novel.totalPages) * 100)}%)<br>
          <strong>Bab Terakhir:</strong> Bab ${novel.currentChapter} dari ${novel.totalChapters}
        </div>
        <div>
          <strong>Rating Pribadi:</strong> ${novel.rating} / 5 Bintang ⭐<br>
          <strong>Terakhir Dibaca:</strong> ${novel.lastReadDate}<br>
          <strong>File PDF Terlampir:</strong> ${novel.pdfFileName ? novel.pdfFileName : 'Belum diunggah'}
        </div>
      </div>

      <div class="section-title">Sinopsis Buku</div>
      <div class="synopsis">${novel.synopsis || 'Tidak ada sinopsis tercatat.'}</div>

      ${novel.personalNotes ? `
        <div class="section-title">Catatan Pribadi Pembaca</div>
        <div style="font-style: italic; background: #fffbeb; padding: 12px; border-radius: 6px;">
          "${novel.personalNotes}"
        </div>
      ` : ''}

      <div class="footer">
        Dicetak dari NOVELIA – Perpustakaan Digital Pribadi pada ${new Date().toLocaleDateString('id-ID')}
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
