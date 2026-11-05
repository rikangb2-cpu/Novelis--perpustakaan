import * as pdfjsLib from 'pdfjs-dist';
import { NovelChapter, NovelExcerpt } from '../types/novel';

// Configure pdfjs worker for Vite browser
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    console.warn('Could not set pdfjs workerSrc locally, using unpkg fallback:', e);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.0'}/build/pdf.worker.min.mjs`;
  }
}

export interface ParsedNovelData {
  title?: string;
  author?: string;
  totalPages: number;
  totalChapters: number;
  chapters: NovelChapter[];
  excerpt: NovelExcerpt;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  sourceFileName: string;
  sourceFileType: 'pdf' | 'txt' | 'md' | 'manual';
  rawSummary?: string;
}

/**
 * Clean filename into a legible novel title
 * e.g. "Laskar_Pelangi_Andrea_Hirata.pdf" -> "Laskar Pelangi Andrea Hirata"
 */
export function cleanTitleFromFilename(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  return withoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits plain text into chapters and paragraphs
 */
export function parseTextToChapters(rawText: string, defaultTitle: string): {
  chapters: NovelChapter[];
  excerpt: NovelExcerpt;
  totalPages: number;
  totalChapters: number;
  synopsis: string;
} {
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  if (!normalized) {
    const emptyChapter: NovelChapter = {
      id: 'chap-1',
      chapterNumber: 1,
      chapterTitle: 'Bab 1: Pendahuluan',
      content: ['Dokumen kosong atau tidak memiliki teks yang terbaca.']
    };
    return {
      chapters: [emptyChapter],
      excerpt: { chapterTitle: emptyChapter.chapterTitle, content: emptyChapter.content },
      totalPages: 10,
      totalChapters: 1,
      synopsis: 'Dokumen kosong.'
    };
  }

  // Count words to estimate pages
  const words = normalized.split(/\s+/).filter(Boolean);
  const totalPages = Math.max(1, Math.ceil(words.length / 260));

  // Regular expression to detect chapter headers
  // Matches "Bab 1", "BAB I", "Chapter 1", "Bagian 1", "PROLOG", "EPILOG", etc.
  const chapterRegex = /(?:^|\n{2,})(?:(BAB|Bab|CHAPTER|Chapter|BAGIAN|Bagian|Prolog|PROLOG|Epilog|EPILOG)\s*([0-9IVXLCDM]+|[A-Za-z]+)?[:\s\-–—]*([^\n]*))/g;

  const matches: Array<{
    index: number;
    title: string;
  }> = [];

  let match;
  while ((match = chapterRegex.exec(normalized)) !== null) {
    const prefix = match[1] || 'Bab';
    const num = match[2] ? ` ${match[2]}` : '';
    const subtitle = match[3] ? `: ${match[3].trim()}` : '';
    matches.push({
      index: match.index,
      title: `${prefix}${num}${subtitle}`.trim()
    });
  }

  const chapters: NovelChapter[] = [];

  if (matches.length >= 2) {
    // Chapters detected by headers!
    for (let i = 0; i < matches.length; i++) {
      const startIdx = matches[i].index;
      const endIdx = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
      const chapterBlock = normalized.substring(startIdx, endIdx).trim();

      // Split into paragraphs
      const paragraphs = chapterBlock
        .split(/\n{2,}/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 0);

      // Skip the first line if it's identical to the chapter header
      const content = paragraphs.filter((p, idx) => {
        if (idx === 0 && p.toLowerCase().includes(matches[i].title.toLowerCase())) {
          return false;
        }
        return true;
      });

      chapters.push({
        id: `chap-${i + 1}`,
        chapterNumber: i + 1,
        chapterTitle: matches[i].title,
        content: content.length > 0 ? content : [paragraphs[0] || 'Awal bab kisah ini...']
      });
    }
  } else {
    // No explicit chapter headers found: split by paragraph chunks (e.g. 6 paragraphs per chapter)
    const allParagraphs = normalized
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter((p) => p.length > 0);

    const chunkSize = 6;
    const numChunks = Math.max(1, Math.ceil(allParagraphs.length / chunkSize));

    for (let i = 0; i < numChunks; i++) {
      const chunkParas = allParagraphs.slice(i * chunkSize, (i + 1) * chunkSize);
      chapters.push({
        id: `chap-${i + 1}`,
        chapterNumber: i + 1,
        chapterTitle: i === 0 ? 'Bab 1: Permulaan Kisah' : `Bab ${i + 1}`,
        content: chunkParas.length > 0 ? chunkParas : ['Melanjutkan alur cerita bab ini...']
      });
    }
  }

  // Synopsis from first paragraphs
  const firstChapter = chapters[0];
  const synopsis = firstChapter.content.slice(0, 2).join(' ').slice(0, 320) + (normalized.length > 320 ? '...' : '');

  const excerpt: NovelExcerpt = {
    chapterTitle: firstChapter.chapterTitle,
    content: firstChapter.content.slice(0, 8)
  };

  return {
    chapters,
    excerpt,
    totalPages,
    totalChapters: chapters.length,
    synopsis
  };
}

/**
 * Extracts text from a PDF file using pdfjs-dist
 */
export async function extractTextFromPdf(file: File): Promise<{
  text: string;
  numPages: number;
  pagesText: string[];
}> {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pagesText: string[] = [];

  // Read pages up to a reasonable reading limit (e.g. first 120 pages for speed and responsiveness)
  const maxPagesToExtract = Math.min(numPages, 120);

  for (let pageNum = 1; pageNum <= maxPagesToExtract; pageNum++) {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .filter((str: string) => str.trim().length > 0);

      // Join items with intelligent spacing
      let pageText = '';
      let prevY: number | null = null;

      for (const item of textContent.items as any[]) {
        const text = item.str || '';
        const currentY = item.transform ? item.transform[5] : null;

        if (prevY !== null && currentY !== null && Math.abs(currentY - prevY) > 12) {
          pageText += '\n\n' + text;
        } else {
          pageText += (pageText.endsWith(' ') || text.startsWith(' ') ? '' : ' ') + text;
        }
        prevY = currentY;
      }

      pagesText.push(pageText.trim());
    } catch (err) {
      console.warn(`Error extracting text from page ${pageNum}:`, err);
      pagesText.push('');
    }
  }

  const fullText = pagesText.join('\n\n--- Halaman Baru ---\n\n');
  return {
    text: fullText,
    numPages,
    pagesText
  };
}

/**
 * Universal file parser for PDF, TXT, MD files
 */
export async function parseNovelFile(file: File): Promise<ParsedNovelData> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  const autoTitle = cleanTitleFromFilename(file.name);

  if (extension === 'pdf') {
    // PDF Document parsing
    try {
      const { text, numPages, pagesText } = await extractTextFromPdf(file);
      const pdfDataUrl = await readFileAsDataUrl(file);

      // Check if real text was successfully extracted
      const hasRealText = text.trim().length > 100;

      let chapters: NovelChapter[] = [];
      let excerpt: NovelExcerpt;
      let synopsis = '';

      if (hasRealText) {
        // Build chapters from pages or detected headings
        const parsed = parseTextToChapters(text, autoTitle);
        chapters = parsed.chapters;
        excerpt = parsed.excerpt;
        synopsis = parsed.synopsis;
      } else {
        // Scanned or image-based PDF: create structured chapter markers pointing to PDF pages
        const pagesPerChapter = Math.max(5, Math.ceil(numPages / 10));
        const totalChaps = Math.max(1, Math.ceil(numPages / pagesPerChapter));

        for (let c = 1; c <= totalChaps; c++) {
          const startP = (c - 1) * pagesPerChapter + 1;
          const endP = Math.min(numPages, c * pagesPerChapter);
          chapters.push({
            id: `chap-${c}`,
            chapterNumber: c,
            chapterTitle: `Bab ${c}: Bagian Halaman ${startP}–${endP}`,
            content: [
              `Dokumen PDF "${file.name}" terlampir dengan format tata letak asli (${numPages} halaman).`,
              `Anda dapat membaca seluruh halaman ${startP} sampai ${endP} dengan jelas menggunakan Mode Dokumen PDF bawaan.`,
              `Gunakan tombol "Buka PDF" di atas untuk navigasi visual halaman penuh.`
            ],
            pageStart: startP,
            pageEnd: endP
          });
        }

        excerpt = {
          chapterTitle: chapters[0].chapterTitle,
          content: chapters[0].content
        };
        synopsis = `Dokumen novel PDF "${file.name}" dengan total ${numPages} halaman.`;
      }

      return {
        title: autoTitle,
        totalPages: numPages,
        totalChapters: chapters.length,
        chapters,
        excerpt,
        pdfUrl: pdfDataUrl,
        pdfFileName: file.name,
        pdfFileSize: sizeInMb,
        sourceFileName: file.name,
        sourceFileType: 'pdf',
        rawSummary: synopsis
      };
    } catch (err: any) {
      console.error('Failed to parse PDF text:', err);
      const pdfDataUrl = await readFileAsDataUrl(file);

      const fallbackChapters: NovelChapter[] = [
        {
          id: 'chap-1',
          chapterNumber: 1,
          chapterTitle: `Bab 1: ${autoTitle}`,
          content: [
            `File PDF "${file.name}" berhasil dimuat ke perpustakaan.`,
            `Dokumen ini siap dibaca secara visual pada Mode PDF.`
          ]
        }
      ];

      return {
        title: autoTitle,
        totalPages: 100,
        totalChapters: 1,
        chapters: fallbackChapters,
        excerpt: {
          chapterTitle: fallbackChapters[0].chapterTitle,
          content: fallbackChapters[0].content
        },
        pdfUrl: pdfDataUrl,
        pdfFileName: file.name,
        pdfFileSize: sizeInMb,
        sourceFileName: file.name,
        sourceFileType: 'pdf'
      };
    }
  } else {
    // Text / Markdown files (.txt, .md, .epub, .doc)
    const rawText = await file.text();
    const parsed = parseTextToChapters(rawText, autoTitle);

    return {
      title: autoTitle,
      totalPages: parsed.totalPages,
      totalChapters: parsed.totalChapters,
      chapters: parsed.chapters,
      excerpt: parsed.excerpt,
      pdfFileName: file.name,
      pdfFileSize: sizeInMb,
      sourceFileName: file.name,
      sourceFileType: extension === 'md' ? 'md' : 'txt',
      rawSummary: parsed.synopsis
    };
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
