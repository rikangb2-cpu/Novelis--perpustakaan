import { Novel } from '../types/novel';

export const GENRES = [
  'Semua',
  'Fantasi & Petualangan',
  'Fiksi Sejarah',
  'Realisme Magis',
  'Drama & Inspiratif',
  'Misteri & Thriller',
  'Romansa'
];

export const INITIAL_BOOKS: Novel[] = [
  {
    id: 'novel-1',
    title: 'Bumi',
    author: 'Tere Liye',
    genre: 'Fantasi & Petualangan',
    coverColor: 'from-emerald-800 via-teal-900 to-slate-950',
    coverPattern: 'stars',
    coverImageUrl: '/src/assets/images/cover_novel_bumi_1793874341998.jpg',
    totalPages: 440,
    currentPage: 286,
    totalChapters: 32,
    currentChapter: 21,
    synopsis: 'Namaku Raib, murid perempuan berumur 15 tahun. Aku sama seperti remaja biasa, kecuali satu hal: aku bisa menghilang. Petualangan ajaib dimulai saat tiang listrik sekolah roboh dan membuka gerbang menuju Klan Bulan.',
    isFavorite: true,
    status: 'reading',
    rating: 5,
    personalNotes: 'Karakter Raib, Seli, dan Ali sangat kompak. Penggambaran kota Klan Bulan sangat imajinatif!',
    lastReadDate: 'Hari ini, 10:15',
    addedDate: '12 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 21: Aula Perjamuan Bintang',
      content: [
        'Udara di aula itu terasa sejuk dan beraroma lavender segar. Langit-langitnya terbuat dari kristal gelap yang berpendar menyerupai rasi bintang yang perlahan berputar.',
        'Seli menyenggol lenganku perlahan. "Raib, lihat pakaian para penjaga itu. Serat kainnya menyala setiap kali mereka bergerak."',
        'Ali tampak tidak peduli dengan kemewahan tempat ini. Matanya terus menatap jam digital di pergelangan tangannya, mengamati frekuensi gelombang magnetik yang tidak wajar.',
        '"Jangan lengah," bisik Ali dengan nada serius yang jarang ia perlihatkan. "Tamparan angin dingin barusan bukan dari pendingin ruangan. Seseorang sedang mengawasi kita dari balik pilar perak itu."'
      ]
    },
    readingHistory: [
      {
        id: 'log-1-1',
        date: '5 Nov 2026',
        time: '10:15',
        pagesRead: 24,
        chapter: 21,
        note: 'Membaca adegan perjamuan di Klan Bulan.'
      },
      {
        id: 'log-1-2',
        date: '3 Nov 2026',
        time: '21:00',
        pagesRead: 40,
        chapter: 19,
        note: 'Pertarungan seru melawan pasukan bayangan.'
      }
    ]
  },
  {
    id: 'novel-2',
    title: 'Cantik Itu Luka',
    author: 'Eka Kurniawan',
    genre: 'Realisme Magis',
    coverColor: 'from-rose-900 via-amber-950 to-neutral-950',
    coverPattern: 'botanical',
    coverImageUrl: '/src/assets/images/cover_cantik_itu_luka_1793874342383.jpg',
    totalPages: 508,
    currentPage: 508,
    totalChapters: 21,
    currentChapter: 21,
    synopsis: 'Di satu sore akhir pekan bulan Maret, Dewi Ayu bangkit dari kuburnya setelah dua puluh satu tahun mati. Kebangkitannya membuka kembali tirai tragedi dan keajaiban kota Halimunda di masa kolonial hingga pascakemerdekaan.',
    isFavorite: true,
    status: 'completed',
    rating: 5,
    personalNotes: 'Mahakarya sastra Indonesia kontemporer. Bahasa dan satirnya tajam sekali.',
    lastReadDate: 'Kemarin, 19:40',
    addedDate: '15 Sep 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Kebangkitan Dewi Ayu',
      content: [
        'Sore itu kuburan tua di Halimunda bergeming. Daun-daun flamboyan berjatuhan menutupi nisan yang telah berlumut puluhan tahun.',
        'Tiba-tiba, tanah merah di bawah sebuah pohon tua terangkat perlahan. Dua puluh satu tahun setelah ia dimakamkan, Dewi Ayu menepis tanah dari helai rambut peraknya.',
        'Seorang penggembala kambing yang melintas terpaku di jalan setapak. Angin laut membawakan aroma kamboja dan melati yang manis, seolah kematian hanyalah tidur siang yang sedikit terlambat.'
      ]
    },
    readingHistory: [
      {
        id: 'log-2-1',
        date: '4 Nov 2026',
        time: '19:40',
        pagesRead: 35,
        chapter: 21,
        note: 'Menyelesaikan bab epilog. Luar biasa dramatis.'
      }
    ]
  },
  {
    id: 'novel-3',
    title: 'Gadis Kretek',
    author: 'Ratih Kumala',
    genre: 'Fiksi Sejarah',
    coverColor: 'from-amber-900 via-stone-900 to-black',
    coverPattern: 'classic',
    coverImageUrl: '/src/assets/images/cover_gadis_kretek_1793874343833.jpg',
    totalPages: 288,
    currentPage: 142,
    totalChapters: 18,
    currentChapter: 9,
    synopsis: 'Pencarian tiga bersaudara penerus Pabrik Kretek Djadjad Raja atas sosok perempuan misterius bernama Jeng Yah, nama yang terus diigaukan oleh sang ayah menjelang ajal.',
    isFavorite: false,
    status: 'reading',
    rating: 4,
    personalNotes: 'Sejarah industri tembakau lokal dipadukan dengan kisah cinta yang mengharukan.',
    lastReadDate: '2 hari lalu',
    addedDate: '20 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 9: Saus Cengkeh Istimewa',
      content: [
        'Ruang peracikan itu berpintu kayu jati tebal tanpa jendela lebar. Hanya cahaya lampu minyak yang menggantung di sudut ruangan.',
        'Jeng Yah mencelupkan jemarinya ke dalam mangkuk gerabah berisi racikan minyak mawar dan sari kayu manis. Aroma rempah yang pekat seketika menyeruak memenuhi ruangan.',
        '"Kretek yang baik," kata Jeng Yah pelan tanpa menoleh, "bukan hanya soal gurihnya tembakau, melainkan detak napas orang yang melintingnya."'
      ]
    },
    readingHistory: [
      {
        id: 'log-3-1',
        date: '2 Nov 2026',
        time: '16:10',
        pagesRead: 28,
        chapter: 9,
        note: 'Menelusuri masa lalu Jeng Yah di kota M.'
      }
    ]
  },
  {
    id: 'novel-4',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    genre: 'Drama & Inspiratif',
    coverColor: 'from-sky-900 via-indigo-950 to-slate-950',
    coverPattern: 'geometric',
    coverImageUrl: '/src/assets/images/cover_laskar_pelangi_1793874343853.jpg',
    totalPages: 529,
    currentPage: 529,
    totalChapters: 34,
    currentChapter: 34,
    synopsis: 'Kisah perjuangan sepuluh anak Belitong yang bersekolah di SD Muhammadiyah yang nyaris roboh. Semangat Bu Muslimah dan Pak Harfan mengajarkan arti keteguhan dan persahabatan sejati.',
    isFavorite: true,
    status: 'completed',
    rating: 5,
    personalNotes: 'Buku yang selalu berhasil membakar semangat belajar dan menghargai kesempatan hidup.',
    lastReadDate: '28 Okt 2026',
    addedDate: '10 Agu 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Sepuluh Murid Baru',
      content: [
        'Pagi itu, waktu masih sangat dini ketika kami duduk di bangku panjang berdinding papan reyot. Di luar, pohon filicium meneteskan embun terakhir.',
        'Pak Harfan berdiri di depan pintu dengan seragam safari abu-abu yang warnanya sudah pudar. Beliau menghitung murid yang masuk satu demi satu dengan harapan yang berdebar di dadanya.',
        'Sembilan anak. Kurang satu orang lagi agar sekolah ini tidak ditutup oleh pengawas. Dan di kejauhan jalan setapak, sesosok anak kurus berjalan terbungkuk memegang tangan ibunya.'
      ]
    },
    readingHistory: [
      {
        id: 'log-4-1',
        date: '28 Okt 2026',
        time: '20:15',
        pagesRead: 50,
        chapter: 34,
        note: 'Membaca ulang bagian kelulusan Laskar Pelangi.'
      }
    ]
  },
  {
    id: 'novel-5',
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    genre: 'Fiksi Sejarah',
    coverColor: 'from-blue-950 via-cyan-950 to-slate-950',
    coverPattern: 'minimalist',
    coverImageUrl: '/src/assets/images/cover_laut_bercerita_1793874343884.jpg',
    totalPages: 379,
    currentPage: 0,
    totalChapters: 24,
    currentChapter: 1,
    synopsis: 'Kisah Biru Laut dan kawan-kawan aktivis mahasiswa yang diculik dan disekap pada masa pergolakan politik 1998, serta suara getir keluarga yang setia menanti kepulangan yang tak pasti.',
    isFavorite: true,
    status: 'want_to_read',
    rating: 5,
    personalNotes: 'Buku rekomendasi wajib dari klub buku kampus. Segera dibaca akhir pekan ini.',
    lastReadDate: 'Belum dibaca',
    addedDate: '1 Nov 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Di Dasar Laut Biru',
      content: [
        'Matahari tidak menembus sampai ke kedalaman ini. Gelap di sini begitu pekat, begitu sunyi, hingga aku bisa mendengar detak jantungku sendiri yang semakin lambat.',
        'Kakiku diikat rantai besi yang berkarat. Di atas sana, ombak Selat Sunda barangkali sedang berbuih ditiup angin barat daya.',
        'Aku tidak ingin mati tanpa cerita. Jika tubuhku hancur menjadi garam dan pasir, biarlah kata-kataku ini yang berenang kembali ke daratan, mencari Asmara dan Bapak di rumah.'
      ]
    },
    readingHistory: []
  },
  {
    id: 'novel-6',
    title: 'Aroma Karsa',
    author: 'Dee Lestari',
    genre: 'Misteri & Thriller',
    coverColor: 'from-purple-950 via-violet-900 to-slate-950',
    coverPattern: 'botanical',
    coverImageUrl: '/src/assets/images/cover_aroma_karsa_1793874344656.jpg',
    totalPages: 710,
    currentPage: 85,
    totalChapters: 45,
    currentChapter: 6,
    synopsis: 'Jati Wesi, pemuda dari Bantar Gebang dengan indra penciuman luar biasa, terseret dalam perburuan bunga mitos Puspa Karsa yang konon mampu mengendalikan kehendak manusia.',
    isFavorite: false,
    status: 'reading',
    rating: 4,
    personalNotes: 'Eksplorasi aroma dan indra penciuman di buku ini sangat detail dan unik.',
    lastReadDate: 'Kemarin, 22:30',
    addedDate: '25 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 6: Lapisan Wangi Hujan',
      content: [
        'Bagi Jati, dunia tidak tersusun dari pemandangan, melainkan gelombang aroma yang bertingkat-tingkat.',
        'Ia memejamkan mata di emperan toko. Ia bisa membedakan bau aspal basah, jejak bensin terbakar, wangi bedak bayi dari jendela lantai dua, dan sekilas aroma kayu gaharu tua yang terbawa angin dari utara.',
        'Tetapi ada satu jejak wangi yang asing. Manis namun getir, seakan memanggilnya dari balik kabut ingatan yang telah lama terkubur.'
      ]
    },
    readingHistory: [
      {
        id: 'log-6-1',
        date: '4 Nov 2026',
        time: '22:30',
        pagesRead: 25,
        chapter: 6,
        note: 'Membaca kemampuan Jati mendeteksi aroma di pasar.'
      }
    ]
  }
];
