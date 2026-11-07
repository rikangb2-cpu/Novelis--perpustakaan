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
    currentChapter: 1,
    synopsis: 'Namaku Raib, murid perempuan berumur 15 tahun. Aku sama seperti remaja biasa, kecuali satu hal: aku bisa menghilang. Petualangan ajaib dimulai saat tiang listrik sekolah roboh dan membuka gerbang menuju Klan Bulan.',
    isFavorite: true,
    status: 'reading',
    rating: 5,
    personalNotes: 'Karakter Raib, Seli, dan Ali sangat kompak. Penggambaran kota Klan Bulan sangat imajinatif!',
    lastReadDate: 'Hari ini, 10:15',
    addedDate: '12 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Menghilang di Balik Jemari',
      content: [
        'Namaku Raib. Umurku lima belas tahun, duduk di kelas sepuluh. Aku sama seperti remaja biasa pada umumnya: menyukai hujan, kesal jika PR matematika menumpuk, dan punya dua ekor kucing bernama Si Putih dan Si Hitam.',
        'Tetapi sejak usiaku dua tahun, ada rahasia besar yang kusimpan rapat-rapat bahkan dari Mama dan Papa: aku bisa menghilang. Cukup dengan menutup wajahku dengan kedua telapak tangan, tubuhku akan lenyap tak terlihat oleh siapa pun.',
        'Hari ini, di ruang kelas yang bising, aku tanpa sengaja menutup wajah saat guru sejarah menoleh ke arahku. Dan saat itulah petualangan dunia paralel itu dimulai.'
      ]
    },
    chapters: [
      {
        id: 'chap-1-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Menghilang di Balik Jemari',
        content: [
          'Namaku Raib. Umurku lima belas tahun, duduk di kelas sepuluh. Aku sama seperti remaja biasa pada umumnya: menyukai hujan, kesal jika PR matematika menumpuk, dan punya dua ekor kucing bernama Si Putih dan Si Hitam.',
          'Tetapi sejak usiaku dua tahun, ada rahasia besar yang kusimpan rapat-rapat bahkan dari Mama dan Papa: aku bisa menghilang. Cukup dengan menutup wajahku dengan kedua telapak tangan, tubuhku akan lenyap tak terlihat oleh siapa pun.',
          'Hari ini, di ruang kelas yang bising, aku tanpa sengaja menutup wajah saat guru sejarah menoleh ke arahku. Dan saat itulah petualangan dunia paralel itu dimulai.'
        ]
      },
      {
        id: 'chap-1-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Tiang Listrik yang Berderak',
        content: [
          'Hujan deras mengguyur lapangan sekolah ketika bel pulang berbunyi. Aku dan Seli berteduh di teras laboratorium fisika, menunggu jemputan yang belum kunjung tiba.',
          'Tiba-tiba terdengar suara dentuman keras bagai petir menyambar di siang bolong. Tiang listrik beton di pojok lapangan berguncang hebat, mengeluarkan percikan api biru kehijauan yang menyilaukan mata.',
          'Tiang itu tumbang mengarah tepat ke arah kami! Sebelum aku sempat berteriak, sebuah lubang cahaya keperakan berputar di udara, menelan tiang listrik tersebut tanpa meninggalkan sebutir debu pun.'
        ]
      },
      {
        id: 'chap-1-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Gerbang Menuju Klan Bulan',
        content: [
          'Ali berdiri di samping kami sambil mengusap dagunya. Matanya berkilat penuh rasa ingin tahu yang berbahaya. "Itu tadi bukan fenomena alam biasa, Raib. Itu lubang cacing spasial."',
          'Sebelum kami sempat berdebat, bayangan sosok tinggi jangkung berjubah hitam pekat muncul dari udara kosong. Tangannya terangkat, mengarahkan kekuatan tak kasat mata ke arah kami.',
          '"Selamat datang ke dunia yang sebenarnya, Putri Klan Bulan," bisik suara parau itu dingin.'
        ]
      },
      {
        id: 'chap-1-4',
        chapterNumber: 4,
        chapterTitle: 'Bab 4: Aula Perjamuan Kristal Bintang',
        content: [
          'Udara di aula itu terasa sejuk dan beraroma lavender segar. Langit-langitnya terbuat dari kristal gelap yang berpendar menyerupai rasi bintang yang perlahan berputar.',
          'Seli menyenggol lenganku perlahan. "Raib, lihat pakaian para penjaga itu. Serat kainnya menyala setiap kali mereka bergerak."',
          'Ali tampak tidak peduli dengan kemewahan tempat ini. Matanya terus menatap jam digital di pergelangan tangannya, mengamati frekuensi gelombang magnetik yang tidak wajar.',
          '"Jangan lengah," bisik Ali dengan nada serius. "Seseorang sedang mengawasi kita dari balik pilar perak itu."'
        ]
      }
    ],
    readingHistory: [
      {
        id: 'log-1-1',
        date: '5 Nov 2026',
        time: '10:15',
        pagesRead: 24,
        chapter: 1,
        note: 'Membaca awal kisah Raib dan Klan Bulan.'
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
    currentPage: 250,
    totalChapters: 21,
    currentChapter: 1,
    synopsis: 'Di satu sore akhir pekan bulan Maret, Dewi Ayu bangkit dari kuburnya setelah dua puluh satu tahun mati. Kebangkitannya membuka kembali tirai tragedi dan keajaiban kota Halimunda di masa kolonial hingga pascakemerdekaan.',
    isFavorite: true,
    status: 'reading',
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
    chapters: [
      {
        id: 'chap-2-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Kebangkitan Dewi Ayu',
        content: [
          'Sore itu kuburan tua di Halimunda bergeming. Daun-daun flamboyan berjatuhan menutupi nisan yang telah berlumut puluhan tahun.',
          'Tiba-tiba, tanah merah di bawah sebuah pohon tua terangkat perlahan. Dua puluh satu tahun setelah ia dimakamkan, Dewi Ayu menepis tanah dari helai rambut peraknya.',
          'Seorang penggembala kambing yang melintas terpaku di jalan setapak. Angin laut membawakan aroma kamboja dan melati yang manis, seolah kematian hanyalah tidur siang yang sedikit terlambat.'
        ]
      },
      {
        id: 'chap-2-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Kota Halimunda dan Angin Asin',
        content: [
          'Kota Halimunda adalah kota kecil di pesisir selatan yang dipenuhi kabar angin dan takhayul yang hidup berdampingan dengan kenyataan.',
          'Di kota inilah Dewi Ayu melahirkan empat orang anak perempuan. Tiga di antaranya begitu rupawan hingga setiap lelaki yang memandangnya bisa kehilangan akal sehat.',
          'Namun anak keempatnya, yang dinamai Si Cantik, lahir dengan wajah yang begitu kontras dengan namanya, sebagai kutukan atas kecantikan yang membawa derita berkepanjangan.'
        ]
      },
      {
        id: 'chap-2-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Rumah Tua di Ujung Dermaga',
        content: [
          'Rumah peninggalan Belanda itu masih berdiri kokoh menghadap laut lepas. Cat putihnya telah mengelupas, digantikan lumut hijau tua dan jaring laba-laba.',
          'Ketika Dewi Ayu melangkah masuk melewati beranda kayu, jam lonceng tua yang telah mati selama dua dekade mendadak berdenting dua belas kali.',
          'Masa lalu tidak pernah benar-benar terkubur di Halimunda. Ia hanya menunggu saat yang tepat untuk mengetuk pintu depan kembali.'
        ]
      }
    ],
    readingHistory: [
      {
        id: 'log-2-1',
        date: '4 Nov 2026',
        time: '19:40',
        pagesRead: 35,
        chapter: 1,
        note: 'Membaca bab pembuka Cantik Itu Luka.'
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
    currentChapter: 1,
    synopsis: 'Pencarian tiga bersaudara penerus Pabrik Kretek Djadjad Raja atas sosok perempuan misterius bernama Jeng Yah, nama yang terus diigaukan oleh sang ayah menjelang ajal.',
    isFavorite: false,
    status: 'reading',
    rating: 4,
    personalNotes: 'Sejarah industri tembakau lokal dipadukan dengan kisah cinta yang mengharukan.',
    lastReadDate: '2 hari lalu',
    addedDate: '20 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Igauan Menjelang Senja',
      content: [
        'Kamar tidur itu beraroma minyak kayu putih dan tembakau tua. Di ranjang besi kuno, Romo Soeraja terbaring lemah dengan selang oksigen yang berdesis pelan.',
        'Napasnya tersengal-sengal. Tiga anaknya, Tegar, Karim, dan Lebas, mengelilingi tempat tidur dengan cemas.',
        'Alih-alih memanggil nama sang istri, bibir kering Romo Soeraja hanya mengulang satu nama dengan lirih: "Jeng Yah... Jeng Yah..."'
      ]
    },
    chapters: [
      {
        id: 'chap-3-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Igauan Menjelang Senja',
        content: [
          'Kamar tidur itu beraroma minyak kayu putih dan tembakau tua. Di ranjang besi kuno, Romo Soeraja terbaring lemah dengan selang oksigen yang berdesis pelan.',
          'Napasnya tersengal-sengal. Tiga anaknya, Tegar, Karim, dan Lebas, mengelilingi tempat tidur dengan cemas.',
          'Alih-alih memanggil nama sang istri, bibir kering Romo Soeraja hanya mengulang satu nama dengan lirih: "Jeng Yah... Jeng Yah..."'
        ]
      },
      {
        id: 'chap-3-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Menuju Kota M',
        content: [
          'Mobil sedan tua melaju menembus kabut perkebunan tembakau di Jawa Tengah. Lebas menatap jendela, memikirkan siapa sebenarnya perempuan yang dicari ayahnya.',
          'Bagi mereka bertiga, nama Jeng Yah seperti kunci rahasia yang terkunci di dalam brankas masa lalu keluarga industri kretek terbesar di kota itu.',
          '"Kita harus menemukan Jeng Yah sebelum ajal menjemput Romo," tegas Tegar sambil mencengkeram kemudi.'
        ]
      },
      {
        id: 'chap-3-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Saus Cengkeh Istimewa',
        content: [
          'Ruang peracikan itu berpintu kayu jati tebal tanpa jendela lebar. Hanya cahaya lampu minyak yang menggantung di sudut ruangan.',
          'Jeng Yah mencelupkan jemarinya ke dalam mangkuk gerabah berisi racikan minyak mawar dan sari kayu manis. Aroma rempah yang pekat seketika menyeruak memenuhi ruangan.',
          '"Kretek yang baik," kata Jeng Yah pelan tanpa menoleh, "bukan hanya soal gurihnya tembakau, melainkan detak napas orang yang melintingnya."'
        ]
      }
    ],
    readingHistory: [
      {
        id: 'log-3-1',
        date: '2 Nov 2026',
        time: '16:10',
        pagesRead: 28,
        chapter: 1,
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
    currentPage: 210,
    totalChapters: 34,
    currentChapter: 1,
    synopsis: 'Kisah perjuangan sepuluh anak Belitong yang bersekolah di SD Muhammadiyah yang nyaris roboh. Semangat Bu Muslimah dan Pak Harfan mengajarkan arti keteguhan dan persahabatan sejati.',
    isFavorite: true,
    status: 'reading',
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
    chapters: [
      {
        id: 'chap-4-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Sepuluh Murid Baru',
        content: [
          'Pagi itu, waktu masih sangat dini ketika kami duduk di bangku panjang berdinding papan reyot. Di luar, pohon filicium meneteskan embun terakhir.',
          'Pak Harfan berdiri di depan pintu dengan seragam safari abu-abu yang warnanya sudah pudar. Beliau menghitung murid yang masuk satu demi satu dengan harapan yang berdebar di dadanya.',
          'Sembilan anak. Kurang satu orang lagi agar sekolah ini tidak ditutup oleh pengawas. Dan di kejauhan jalan setapak, sesosok anak kurus berjalan terbungkuk memegang tangan ibunya.'
        ]
      },
      {
        id: 'chap-4-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Harun si Penyelamat',
        content: [
          'Anak lelaki itu bernama Harun. Usianya sudah lima belas tahun, namun senyum tulusnya selalu polos seperti bocah berusia lima tahun.',
          'Ibunya mengusap kepala Harun sambil memandang Bu Muslimah dengan mata berkaca-kaca. "Bu Guru, tolong terima anak saya. Dia ingin sekali bersekolah."',
          'Dengan masuknya Harun, jumlah kami genap sepuluh orang. SD Muhammadiyah Gantong selamat dari penutupan. Kami resmi menjadi murid Laskar Pelangi!'
        ]
      },
      {
        id: 'chap-4-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Pohon Filicium dan Pelangi Pertama',
        content: [
          'Pohon filicium tua di depan kelas kami menjadi saksi bisu mimpi-mimpi yang kami gantungkan setinggi langit.',
          'Di sanalah Lintang menceritakan rumus fisika sederhana tentang kenapa warna pelangi selalu melengkung indah setelah badai reda.',
          'Kami miskin harta, tetapi di bawah atap seng yang bocor itu, kekayaan ilmu dan ketulusan hati kami tak tertandingi oleh siapa pun.'
        ]
      }
    ],
    readingHistory: [
      {
        id: 'log-4-1',
        date: '28 Okt 2026',
        time: '20:15',
        pagesRead: 50,
        chapter: 1,
        note: 'Membaca awal kisah sepuluh anak Laskar Pelangi.'
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
    chapters: [
      {
        id: 'chap-5-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Di Dasar Laut Biru',
        content: [
          'Matahari tidak menembus sampai ke kedalaman ini. Gelap di sini begitu pekat, begitu sunyi, hingga aku bisa mendengar detak jantungku sendiri yang semakin lambat.',
          'Kakiku diikat rantai besi yang berkarat. Di atas sana, ombak Selat Sunda barangkali sedang berbuih ditiup angin barat daya.',
          'Aku tidak ingin mati tanpa cerita. Jika tubuhku hancur menjadi garam dan pasir, biarlah kata-kataku ini yang berenang kembali ke daratan, mencari Asmara dan Bapak di rumah.'
        ]
      },
      {
        id: 'chap-5-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Rumah Seyegan yang Hangat',
        content: [
          'Yogyakarta tahun 1993. Rumah kontrakan di Seyegan itu selalu berbau kopi tubruk, tembakau lintingan, dan kertas stensil yang baru dicetak.',
          'Sunu sedang memasak tengkleng kambing di dapur belakang, sementara Daniel berdebat seru dengan Kinan mengenai diktat filsafat politik.',
          'Kami muda, penuh semangat, dan percaya bahwa kata-kata yang kami ketik di mesin tik antik itu kelak mampu meruntuhkan tirani.'
        ]
      },
      {
        id: 'chap-5-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Jamuan Makan Malam Tanpa Piring Keempat',
        content: [
          'Setiap hari Minggu sore di Jakarta, Ibu selalu menata empat piring di meja makan keluarga kami.',
          'Satu untuk Bapak, satu untuk Ibu, satu untuk Asmara, dan satu piring kosong di kursi yang selalu dibiarkan tak tersentuh.',
          '"Laut pasti pulang," kata Ibu lirih setiap kali menuangkan nasi hangat ke piring kosong itu.'
        ]
      }
    ],
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
    currentChapter: 1,
    synopsis: 'Jati Wesi, pemuda dari Bantar Gebang dengan indra penciuman luar biasa, terseret dalam perburuan bunga mitos Puspa Karsa yang konon mampu mengendalikan kehendak manusia.',
    isFavorite: false,
    status: 'reading',
    rating: 4,
    personalNotes: 'Eksplorasi aroma dan indra penciuman di buku ini sangat detail dan unik.',
    lastReadDate: 'Kemarin, 22:30',
    addedDate: '25 Okt 2026',
    excerpt: {
      chapterTitle: 'Bab 1: Hidung Pencium Segala Bau',
      content: [
        'Bagi Jati, dunia tidak tersusun dari pemandangan, melainkan gelombang aroma yang bertingkat-tingkat.',
        'Ia memejamkan mata di emperan toko. Ia bisa membedakan bau aspal basah, jejak bensin terbakar, wangi bedak bayi dari jendela lantai dua, dan sekilas aroma kayu gaharu tua yang terbawa angin dari utara.',
        'Tetapi ada satu jejak wangi yang asing. Manis namun getir, seakan memanggilnya dari balik kabut ingatan yang telah lama terkubur.'
      ]
    },
    chapters: [
      {
        id: 'chap-6-1',
        chapterNumber: 1,
        chapterTitle: 'Bab 1: Hidung Pencium Segala Bau',
        content: [
          'Bagi Jati, dunia tidak tersusun dari pemandangan, melainkan gelombang aroma yang bertingkat-tingkat.',
          'Ia memejamkan mata di emperan toko. Ia bisa membedakan bau aspal basah, jejak bensin terbakar, wangi bedak bayi dari jendela lantai dua, dan sekilas aroma kayu gaharu tua yang terbawa angin dari utara.',
          'Tetapi ada satu jejak wangi yang asing. Manis namun getir, seakan memanggilnya dari balik kabut ingatan yang telah lama terkubur.'
        ]
      },
      {
        id: 'chap-6-2',
        chapterNumber: 2,
        chapterTitle: 'Bab 2: Laboratorium Kemara',
        content: [
          'Rania berdiri di depan deretan botol kristal di laboratorium parfum milik keluarganya.',
          'Sebagai hidung utama perusahaan parfum terbesar di tanah air, Rania terbiasa membedakan ribuan formula wewangian dari seluruh penjuru bumi.',
          'Namun ketika sebuah botol kaca antik tanpa label diantarkan ke mejanya, aroma yang keluar membuat jantungnya berdegup kencang: itu aroma Puspa Karsa.'
        ]
      },
      {
        id: 'chap-6-3',
        chapterNumber: 3,
        chapterTitle: 'Bab 3: Jejak Menuju Gunung Lawu',
        content: [
          'Kisah legenda Jawa kuno itu menyebutkan bahwa Puspa Karsa hanya mekar sekali dalam satu abad di lereng tersembunyi Gunung Lawu.',
          'Siapa pun yang mencium sarinya akan tunduk tanpa perlawanan pada kehendak sang pemilik aroma.',
          'Jati dan Rania, dua orang dari dunia yang bertolak belakang, dipertemukan oleh satu takdir aroma yang tak terelakkan.'
        ]
      }
    ],
    readingHistory: [
      {
        id: 'log-6-1',
        date: '4 Nov 2026',
        time: '22:30',
        pagesRead: 25,
        chapter: 1,
        note: 'Membaca kemampuan Jati mendeteksi aroma.'
      }
    ]
  }
];
