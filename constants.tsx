
import { ObservationFocus } from './types';

export interface Teacher {
  id: string;
  name: string;
  nip?: string;
  subject: string;
  phase: string;
  photoUrl?: string;
}

export interface PerformanceTarget {
  id: string;
  label: string;
  dianjurkan: string[];
  dihindari: string[];
}

export interface PerformanceRubric {
  id: string;
  label: string;
  description: string;
  targets: PerformanceTarget[];
}

export const PERFORMANCE_RUBRICS: PerformanceRubric[] = [
  {
    id: 'keteraturan_suasana',
    label: 'Keteraturan Suasana Kelas',
    description: 'Praktik pedagogis berupa pembuatan kesepakatan kelas yang direfleksikan agar lingkungan pembelajaran menjadi teratur dan minimal gangguan sehingga murid dapat melakukan pembelajaran mendalam.',
    targets: [
      {
        id: 'ks_1',
        label: 'Guru melakukan komunikasi positif untuk membangun suasana kelas yang kondusif',
        dianjurkan: [
          'Guru memanggil murid dengan menyebut namanya',
          'Guru menyampaikan harapan positif terhadap kelas',
          'Guru melakukan aktivitas yang mencairkan suasana kelas'
        ],
        dihindari: [
          'Guru memanggil murid dengan sebutan yang merendahkan',
          'Guru menceritakan keluhan atau persoalan sekolah',
          'Guru langsung mengajar tanpa mengkondisikan suasana kelas'
        ]
      },
      {
        id: 'ks_2',
        label: 'Guru melakukan strategi pengelompokkan untuk mengaktifkan keterlibatan murid',
        dianjurkan: [
          'Guru mengelompokkan murid dengan menyampaikan tujuannya pada murid',
          'Guru menyediakan beragam peran dalam kelompok agar semua anggota terlibat aktif',
          'Guru mengajak murid untuk berinteraksi dan berperan aktif dalam kelompok'
        ],
        dihindari: [
          'Guru membiarkan murid membentuk kelompok tanpa kriteria',
          'Guru mengelompokkan murid tanpa menjelaskan tujuannya',
          'Guru membiarkan murid mengatur sendiri kelompoknya'
        ]
      },
      {
        id: 'ks_3',
        label: 'Guru membuat dan mengingatkan aturan/kesepakatan kelas',
        dianjurkan: [
          'Guru membuat aturan/kesepakatan kelas yang disetujui semua murid dan ditempel di kelas',
          'Guru mengajak murid untuk mengingat aturan/kesepakatan kelas yang telah disepakati',
          'Guru mengajak murid menilai seberapa efektif pelaksanaan aturan/kesepakatan kelas'
        ],
        dihindari: [
          'Guru menetapkan aturan kelas tanpa mendiskusikan dengan murid',
          'Guru menyebutkan aturan/kesepakatan kelas hanya saat terjadi pelanggaran',
          'Guru melanggar aturan/kesepakatan kelas tanpa mengakuinya'
        ]
      }
    ]
  },
  {
    id: 'instruksi',
    label: 'Instruksi Pembelajaran',
    description: 'Penjelasan terstruktur yang memandu murid memahami, mengaplikasi dan merefleksikan pembelajaran sebagai implementasi pembelajaran mendalam.',
    targets: [
      {
        id: 'ins_1',
        label: 'Guru mengajukan pertanyaan yang menstimulasi proses diskusi dan berpikir kritis',
        dianjurkan: [
          'Guru mengajukan pertanyaan terbuka untuk memancing proses diskusi dan berpikir kritis',
          'Guru mengajukan pertanyaan yang mengaitkan konsep yang dipelajari dengan konsep sebelumnya',
          'Guru mengajukan yang meminta peserta didik membandingkan dua konsep yang berbeda'
        ],
        dihindari: [
          'Guru mengajukan pertanyaan hanya untuk menguji pemahaman peserta didik',
          'Guru mengajukan pertanyaan yang meminta peserta didik mengulang konsep yang disampaikan',
          'Guru menghakimi jawaban peserta didik sehingga membuat peserta didik yang lain ragu buat menjawab'
        ]
      },
      {
        id: 'ins_2',
        label: 'Guru memfasilitasi kegiatan pembelajaran yang memberi peran pada semua peserta didik',
        dianjurkan: [
          'Guru memotivasi semua peserta didik untuk berperan aktif dalam proses pembelajaran',
          'Guru menyediakan peran dalam kelompok untuk memastikan semua anggota mendapat peran',
          'Guru memberi dukungan dan kesempatan pada peserta didik yang pasif untuk berperan'
        ],
        dihindari: [
          'Guru membiarkan peserta didik membuat dan membagikan peran dalam kelompok',
          'Guru menyediakan peran yang terbatas sehingga peserta didik tertentu tidak mendapat peran',
          'Guru membiarkan sebagian peserta didik bersikap dominan dalam proses pembelajaran'
        ]
      },
      {
        id: 'ins_3',
        label: 'Guru memfasilitasi terjadinya diskusi kelompok yang interaktif, kritis dan inklusif',
        dianjurkan: [
          'Guru memotivasi peserta didik untuk menyampaikan pendapat secara terbuka',
          'Guru membentuk kelompok dengan beragam kemampuan dan minat',
          'Guru berkeliling kelas untuk memberikan bimbingan pada kelompok dalam berdiskusi'
        ],
        dihindari: [
          'Guru hanya duduk di depan dan membiarkan kelompok berdiskusi sendiri',
          'Guru membiarkan peserta didik membentuk kelompok sendiri sesuka hatinya',
          'Guru mengabaikan atau melarang perbedaan pendapat'
        ]
      }
    ]
  },
  {
    id: 'disiplin',
    label: 'Penerapan Disiplin Positif',
    description: 'Penerapan prinsip disiplin positif untuk mengelola perilaku dan kebiasaan kelas yang disepakati bersama agar kualitas lingkungan pembelajaran semakin meningkat.',
    targets: [
      {
        id: 'dis_1',
        label: 'Guru melakukan refleksi dinamika kelas untuk menerapkan kesepakatan kelas',
        dianjurkan: [
          'Guru mengajak peserta didik melakukan refleksi dinamika kelas secara terbuka',
          'Guru menunjukkan kesediaan mendengarkan pandangan peserta didik tentang dinamika kelas',
          'Guru bersikap adaptif dalam menyesuaikan pendekatan dalam menjalankan kedisiplinan'
        ],
        dihindari: [
          'Guru mengabaikan pendapat peserta didik tentang apa yang terjadi di kelas',
          'Guru bersikap defensive dalam menyikapi umpan balik dari peserta didik terkait kedisiplinan',
          'Guru menerapkan hukuman fisik terhadap peserta didik yang melakukan pelanggaran kedisiplinan'
        ]
      },
      {
        id: 'dis_2',
        label: 'Guru melakukan penguatan positif terhadap perilaku yang sesuai atau mendukung kesepakatan kelas',
        dianjurkan: [
          'Guru segera beri pengakuan terhadap perilaku peserta didik yang sesuai kesepakatan kelas',
          'Guru beri penguatan positif dengan berbagai cara yang beragam',
          'Guru mengakui suatu perilaku positif secara spesifik dan menjelaskan alasannya'
        ],
        dihindari: [
          'Guru tidak konsisten dalam memberikan penguatan positif, hanya pada peserta didik tertentu',
          'Guru mengabaikan perilaku positif karena terlalu fokus pada perilaku negatif atau hal lain',
          'Guru melakukan penguatan perilaku yang tidak bermanfaat bagi peserta didik dan kelas secara keseluruhan'
        ]
      },
      {
        id: 'dis_3',
        label: 'Guru melakukan restitusi untuk membantu peserta didik menyadari konsekuensi dan memperbaiki perilaku melanggarnya',
        dianjurkan: [
          'Guru dengan sabar membantu peserta didik menyadari konsekuensi dari perilaku melanggarnya',
          'Guru mendengarkan sudut pandang peserta didik terhadap perilaku melanggarnya',
          'Guru memberikan dukungan pada peserta didik dalam melakukan perbaikan perilakunya'
        ],
        dihindari: [
          'Guru langsung memberikan hukuman, bukan membangun upaya perbaikan perilaku',
          'Guru kehilangan kesabaran dalam membantu peserta didik menyadari konsekuensi perilakunya',
          'Guru meminta peserta didik untuk tenang tanpa melakukan restitusi terhadap perilaku melanggar'
        ]
      }
    ]
  },
  {
    id: 'umpan_balik',
    label: 'Umpan Balik Konstruktif',
    description: 'Praktik pedagogis berupa penyampaian kemajuan proses dan capaian murid sehingga murid dapat melakukan perbaikan cara belajar dalam pembelajaran mendalam.',
    targets: [
      {
        id: 'ub_1',
        label: 'Guru memberikan umpan balik spesifik & berorientasi tujuan',
        dianjurkan: [
          'Guru memberi umpan balik dengan menyebut spesifik bagian tugas yang dinilai bagus/buruk',
          'Guru menghubungkan umpan balik dengan tujuan pembelajaran yang hendak dicapai',
          'Guru menggunakan pertanyaan untuk membantu peserta didik memunculkan ide perbaikan'
        ],
        dihindari: [
          'Guru memberi umpan balik dengan kata-kata yang terlalu umum',
          'Guru memberi umpan balik negatif tanpa membantu peserta didik menemukan ide perbaikan',
          'Guru memberikan umpan balik dengan menggunakan bahasa yang terlalu sulit'
        ]
      },
      {
        id: 'ub_2',
        label: 'Guru memberikan umpan balik yang fokus pada proses atau usaha peserta didik',
        dianjurkan: [
          'Guru memberi umpan balik fokus pada usaha peserta didik sehingga lebih mungkin ada perbaikan',
          'Guru menjelaskan keterkaitan usaha dengan hasil yang mungkin dicapai',
          'Guru membantu peserta didik melakukan refleksi terhadap usaha yang telah dilakukannya'
        ],
        dihindari: [
          'Guru menyampaikan umpan balik yang hanya fokus pada hasil akhir',
          'Guru tidak menyediakan kesempatan pada peserta didik melakukan perbaikan',
          'Guru menggunakan pandangan subjektif dalam memberi umpan balik'
        ]
      },
      {
        id: 'ub_3',
        label: 'Guru menunjukkan kesediaan mendiskusikan umpan balik dengan peserta didik',
        dianjurkan: [
          'Guru membuka komunikasi untuk pertanyaan dan klarifikasi lebih lanjut',
          'Guru mendengarkan secara aktif tanggapan peserta didik terhadap umpan balik yang diterimanya',
          'Guru menyediakan waktu mendiskusikan umpan balik selama atau setelah kelas'
        ],
        dihindari: [
          'Guru menolak berdiskusi dengan peserta didik tentang umpan balik yang diberikan',
          'Guru mengabaikan pertanyaan atau kekhawatiran peserta didik',
          'Guru terburu-buru menjelaskan umpan balik sehingga tidak sempat berdiskusi'
        ]
      }
    ]
  },
  {
    id: 'perhatian_kepedulian',
    label: 'Perhatian dan Kepedulian',
    description: 'Praktik pedagogis berupa pemberian perhatian dan dukungan sesuai dengan kebutuhan belajar setiap murid agar semua murid siap melakukan pembelajaran mendalam.',
    targets: [
      {
        id: 'pk_1',
        label: 'Guru menunjukkan empati untuk mendapatkan pemahaman utuh tentang peserta didik',
        dianjurkan: [
          'Guru memberikan perhatian penuh ketika peserta didik berbicara',
          'Guru mengajukan pertanyaan lanjutan untuk mendapatkan pemahaman',
          'Guru menunjukkan pengertian terhadap sudut pandang peserta didik'
        ],
        dihindari: [
          'Guru mengabaikan pendapat atau perasaan peserta didik',
          'Guru memberikan penilaian negatif terhadap pendapat peserta didik',
          'Guru tidak memberikan kesempatan pada peserta didik menyampaikan pendapat'
        ]
      },
      {
        id: 'pk_2',
        label: 'Guru menunjukkan pemahaman terhadap kebutuhan, kondisi dan karakteristik peserta didik',
        dianjurkan: [
          'Guru melakukan pengamatan terhadap dinamika kelas untuk memahami peserta didik',
          'Guru melakukan interaksi positif yang menghargai keunikan peserta didik',
          'Guru meminta pendapat dan umpan balik dari peserta didik'
        ],
        dihindari: [
          'Guru bertindak berdasarkan asumsi tanpa menggali fakta terkait peserta didik',
          'Guru bersikap kaku dalam pembelajaran yang mengabaikan kebutuhan peserta didik',
          'Guru menghindari masukan atau umpan balik dari peserta didik'
        ]
      },
      {
        id: 'pk_3',
        label: 'Guru mengakui dan menghargai usaha yang ditunjukkan peserta didik',
        dianjurkan: [
          'Guru menunjukkan minat/keingintahuan terhadap aktivitas yang dilakukan murid',
          'Guru memberikan pujian terhadap usaha, bukan hasil akhir, yang ditunjukkan peserta didik',
          'Guru menyampaikan dukungan terhadap usaha peserta didik di depan kelas'
        ],
        dihindari: [
          'Guru meremehkan usaha-usaha yang dilakukan peserta didik',
          'Guru memberikan pujian yang terlalu umum atau berlebihan/bombastis',
          'Guru bersikap terlalu kritis terhadap usaha yang dilakukan peserta didik'
        ]
      }
    ]
  }
];

export const OBSERVATION_INDICATORS = PERFORMANCE_RUBRICS.flatMap(rubric => 
  rubric.targets.map(target => ({
    id: target.id,
    label: target.label
  }))
);

export const TEACHERS: Teacher[] = [];

export const FOCUS_OPTIONS: ObservationFocus[] = [
  { id: 'keteraturan_suasana', title: 'Keteraturan Suasana Kelas', description: 'Fokus pada pembangunan suasana kondusif and kesepakatan kelas yang reflektif.' },
  { id: 'instruksi', title: 'Instruksi Pembelajaran', description: 'Fokus pada penjelasan terstruktur and implementasi pembelajaran mendalam.' },
  { id: 'disiplin', title: 'Penerapan Disiplin Positif', description: 'Fokus pada pengelolaan perilaku melalui prinsip disiplin positif.' },
  { id: 'umpan_balik', title: 'Umpan Balik Konstruktif', description: 'Fokus pada pemberian umpan balik spesifik, berorientasi tujuan, and berbasis proses/usaha.' },
  { id: 'perhatian_kepedulian', title: 'Perhatian and Kepedulian', description: 'Fokus pada pemberian perhatian and dukungan sesuai kebutuhan belajar murid.' },
];
