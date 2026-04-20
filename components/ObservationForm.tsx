
import React, { useState, useEffect } from 'react';
import { Save, Camera, Check, CircleX, MousePointer2, ChevronDown, ListChecks, MessageSquareText, Plus } from 'lucide-react';
import { PERFORMANCE_RUBRICS, TEACHERS } from '../constants';
import { ObservationData, SupervisionStatus } from '../types';

// Mapping saran temuan spesifik berdasarkan ID Target Perilaku
const OBSERVATION_SUGGESTIONS: Record<string, string[]> = {
  // Keteraturan Suasana Kelas
  'ks_1': [
    "Guru menyapa murid dengan nama panggilannya secara hangat",
    "Guru menyampaikan harapan positif terhadap suasana belajar hari ini",
    "Aktivitas ice breaking singkat dilakukan di tengah jam rawan",
    "Guru memberikan senyuman and kontak mata saat berkeliling",
    "Guru menceritakan analogi positif sebelum memulai materi"
  ],
  'ks_2': [
    "Guru menjelaskan bahwa kelompok dibentuk untuk saling membantu",
    "Pembagian tugas (moderator, sekretaris) berjalan tertib",
    "Guru berkeliling memastikan setiap anggota kelompok bicara",
    "Murid yang biasanya menyendiri diajak bergabung ke grup",
    "Tujuan diskusi kelompok disampaikan dengan bahasa yang jelas"
  ],
  'ks_3': [
    "Poster kesepakatan kelas dipasang di tempat yang mudah terlihat",
    "Guru menunjuk ke poster kesepakatan saat kelas mulai gaduh",
    "Murid merefleksikan bahwa mereka telah menjaga ketenangan",
    "Kesepakatan kelas dibuat melalui pemungutan suara bersama",
    "Guru mengajak murid menilai efektivitas aturan di akhir sesi"
  ],
  // Instruksi Pembelajaran
  'ins_1': [
    "Guru menanyakan mengapa untuk menggali alasan jawaban murid",
    "Pertanyaan dikaitkan dengan pengalaman sehari-hari murid",
    "Murid aktif berebut menjawab pertanyaan pemantik",
    "Guru memberi waktu tunggu bagi murid berpikir",
    "Pertanyaan memancing murid membandingkan dua konsep berbeda"
  ],
  'ins_2': [
    "Setiap anggota kelompok memiliki peran ketua atau notulis",
    "Guru mendekati murid yang pasif and memberi dorongan",
    "Pembagian tugas dalam kelompok terlihat sangat adil",
    "Murid yang biasanya diam mulai berani bicara",
    "Seluruh murid terlibat dalam menyelesaikan LKPD"
  ],
  'ins_3': [
    "Guru berkeliling memastikan diskusi berjalan di setiap meja",
    "Interaksi antar murid menunjukkan sikap saling menghargai",
    "Terjadi debat argumen yang sehat antar kelompok",
    "Guru menggunakan teknik Think-Pair-Share dengan baik",
    "Kelompok dibentuk secara heterogen"
  ],
  // Disiplin Positif
  'dis_1': [
    "Guru mengajak murid meninjau kembali kesepakatan kelas",
    "Murid secara mandiri menyadari jika kelas mulai berisik",
    "Refleksi dinamika kelas dilakukan dengan santai and terbuka",
    "Guru mendengarkan keberatan murid tentang aturan tertentu",
    "Suasana kelas terlihat kondusif tanpa ada paksaan"
  ],
  'dis_2': [
    "Guru memberikan jempol saat murid merapikan buku",
    "Penguatan positif dilakukan secara spesifik pada perilaku",
    "Terdapat apresiasi kelompok terbaik di akhir sesi",
    "Guru menggunakan stiker sebagai penguatan positif",
    "Pujian diberikan secara tulus and merata ke semua murid"
  ],
  'dis_3': [
    "Guru melakukan segitiga restitusi pada murid yang terlambat",
    "Murid menawarkan solusi untuk memperbaiki kesalahannya",
    "Guru berbicara dengan nada rendah saat menangani konflik",
    "Fokus pada perbaikan perilaku bukan pada pemberian sanksi",
    "Murid merasa aman and tidak terpojok saat ditegur"
  ],
  // Umpan Balik
  'ub_1': [
    "Guru memberikan umpan balik yang sangat spesifik pada bagian esai murid",
    "Umpan balik dikaitkan langsung dengan tujuan pembelajaran hari ini",
    "Guru menggunakan pertanyaan pemantik untuk memancing ide perbaikan dari murid",
    "Guru menjelaskan kriteria keberhasilan dengan bahasa yang mudah dipahami",
    "Umpan balik diberikan secara konstruktif tanpa menjatuhkan mental murid"
  ],
  'ub_2': [
    "Guru memuji ketekunan murid dalam mencoba berbagai cara penyelesaian",
    "Umpan balik fokus pada progres usaha murid bukan sekadar jawaban benar",
    "Guru menjelaskan bagaimana usaha murid akan berdampak pada hasil akhir",
    "Murid diajak merefleksikan proses belajar yang telah mereka lalui",
    "Guru memberikan apresiasi pada murid yang berani mencoba meski salah"
  ],
  'ub_3': [
    "Guru membuka sesi tanya jawab khusus untuk membahas umpan balik",
    "Terjadi dialog dua arah yang aktif antara guru and murid",
    "Guru mendengarkan dengan seksama penjelasan murid tentang tugasnya",
    "Waktu diskusi umpan balik disediakan cukup di akhir pembelajaran",
    "Guru memberikan klarifikasi yang jelas atas pertanyaan murid"
  ],
  // Perhatian & Kepedulian
  'pk_1': [
    "Guru menatap mata and menyimak saat murid bercerita",
    "Terjadi kontak batin yang hangat antara guru and murid",
    "Guru bertanya kabar murid yang terlihat kurang bersemangat",
    "Pendapat murid dihargai sepenuhnya tanpa interupsi",
    "Guru menunjukkan ekspresi empati saat murid berbicara"
  ],
  'pk_2': [
    "Guru menyesuaikan penjelasan saat melihat murid bingung",
    "Pembelajaran dimodifikasi sesuai gaya belajar murid",
    "Guru hafal karakteristik unik masing-masing murid",
    "Instruksi diulang dengan cara berbeda agar mudah dipahami",
    "Guru memperhatikan kenyamanan posisi duduk murid"
  ],
  'pk_3': [
    "Guru memberikan tepuk tangan atas usaha kecil murid",
    "Minat guru pada karya murid terlihat sangat besar",
    "Dukungan moral diberikan saat murid gagal menjawab",
    "Guru mengapresiasi keberanian murid untuk maju ke depan",
    "Setiap progres kecil murid didokumentasikan guru"
  ]
};

interface Props {
  observations: ObservationData[];
  onSave: (data: ObservationData) => void;
  teachers: Teacher[];
}

const ObservationForm: React.FC<Props> = ({ observations, onSave, teachers }) => {
  const [teacherId, setTeacherId] = useState('');
  const [rubricId, setRubricId] = useState('keteraturan_suasana');
  const [indicators, setIndicators] = useState<{[key: string]: {checked: boolean, note: string}}>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const activeRubric = PERFORMANCE_RUBRICS.find(r => r.id === rubricId) || PERFORMANCE_RUBRICS[0];

  // Pembersihan akhir (hapus simbol dan normalisasi spasi) HANYA saat tombol Simpan ditekan
  const cleanTextFinal = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[\{\}\[\]\"\'\\<>|_^]/g, "") // Hapus simbol teknis
      .replace(/[*#~`]/g, "")               // Hapus simbol markdown
      .replace(/\s+/g, " ")                 // Normalisasi spasi ganda
      .trim();
  };

  // Sync data hanya saat GURU dipilih, agar tidak mengganggu saat sedang mengetik
  useEffect(() => {
    if (teacherId) {
      const existing = observations.find(o => String(o.teacherId) === String(teacherId));
      if (existing) {
        if (existing.indicators) setIndicators(existing.indicators);
        if (existing.additionalNotes) setAdditionalNotes(existing.additionalNotes);
        
        const firstKey = Object.keys(existing.indicators || {})[0];
        if (firstKey?.startsWith('ks_')) setRubricId('keteraturan_suasana');
        else if (firstKey?.startsWith('dis_')) setRubricId('disiplin');
        else if (firstKey?.startsWith('ins_')) setRubricId('instruksi');
        else if (firstKey?.startsWith('ub_')) setRubricId('umpan_balik');
        else if (firstKey?.startsWith('pk_')) setRubricId('perhatian_kepedulian');
      } else {
        setIndicators({});
        setAdditionalNotes('');
      }
    }
  }, [teacherId]); // Hapus 'observations' dari dependency untuk mencegah reset saat mengetik

  const toggleIndicator = (id: string) => {
    setIndicators(prev => ({
      ...prev,
      [id]: { 
        checked: !prev[id]?.checked, 
        note: prev[id]?.note || '' 
      }
    }));
  };

  const updateNote = (id: string, note: string) => {
    // Gunakan nilai MURNI dari textarea agar spasi bisa ditekan
    setIndicators(prev => ({
      ...prev,
      [id]: { 
        checked: prev[id]?.checked || false, 
        note: note 
      }
    }));
  };

  const appendSuggestion = (id: string, suggestion: string) => {
    const currentNote = indicators[id]?.note || '';
    const newNote = currentNote ? `${currentNote}. ${suggestion}` : suggestion;
    updateNote(id, newNote);
    if (!indicators[id]?.checked) {
      setIndicators(prev => ({
        ...prev,
        [id]: { ...prev[id], checked: true }
      }));
    }
  };

  const handleSave = () => {
    if (!teacherId) return alert('Pilih guru terlebih dahulu!');
    
    const currentObs = observations.find(o => String(o.teacherId) === String(teacherId));
    const teacherRef = teachers.find(t => String(t.id) === String(teacherId));

    // Bersihkan semua catatan di dalam indikator dengan pembersihan final saat penyimpanan
    const cleanedIndicators: any = {};
    Object.keys(indicators).forEach(key => {
      cleanedIndicators[key] = {
        checked: indicators[key].checked,
        note: cleanTextFinal(indicators[key].note)
      };
    });

    const data: ObservationData = {
      teacherId,
      teacherName: currentObs?.teacherName || teacherRef?.name || 'Guru',
      teacherNip: currentObs?.teacherNip || teacherRef?.nip || '',
      principalNip: currentObs?.principalNip || '',
      date: new Date().toISOString(),
      subject: currentObs?.subject || teacherRef?.subject || '',
      conversationTime: currentObs?.conversationTime || '',
      learningGoals: currentObs?.learningGoals || '',
      additionalNotes: cleanTextFinal(additionalNotes),
      focusId: rubricId,
      indicators: cleanedIndicators,
      reflection: '',
      coachingFeedback: '',
      rtl: '',
      status: SupervisionStatus.OBSERVED
    };

    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in duration-500 pb-12">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Pelaksanaan Observasi</h2>
          <p className="text-slate-500 text-sm font-medium">Isi instrumen berdasarkan rubrik kinerja target perilaku.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
             <select 
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 outline-none shadow-inner pr-10"
            >
              <option value="">-- Pilih Guru --</option>
              <optgroup label="Telah Direncanakan (Mata Pelajaran)">
                {observations
                  .filter(o => o.status === SupervisionStatus.PLANNED)
                  .map(o => <option key={o.teacherId} value={o.teacherId}>{o.teacherName} ({o.subject})</option>)
                }
              </optgroup>
              <optgroup label="Semua Guru (Mulai Dari Sini)">
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-72">
             <select 
              value={rubricId}
              onChange={(e) => setRubricId(e.target.value)}
              className="w-full appearance-none bg-blue-600 border border-blue-700 px-5 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-400 font-bold text-white outline-none shadow-lg pr-10"
            >
              {PERFORMANCE_RUBRICS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <ListChecks size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
          </div>
          
          <button className="bg-slate-100 p-3.5 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all shadow-sm">
            <Camera size={20} />
          </button>
        </div>
      </div>

      {!teacherId ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6">
          <div className="bg-blue-50 text-blue-500 p-10 rounded-full mb-6">
            <MousePointer2 size={64} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase">Pilih Guru & Indikator</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed font-medium">Pilih nama guru and indikator kinerja di atas untuk memunculkan instrumen pengamatan sesuai rubrik terbaru.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ListChecks size={120} />
            </div>
            <span className="bg-blue-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">Fokus Observasi</span>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{activeRubric.label}</h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed italic font-medium">{activeRubric.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {activeRubric.targets.map((target) => (
              <div key={target.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 ${indicators[target.id]?.checked ? 'border-blue-300 ring-4 ring-blue-50 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col xl:flex-row gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Perilaku</span>
                        <h4 className="font-black text-xl text-slate-900 leading-tight">{target.label}</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100/50">
                        <div className="flex items-center text-emerald-700 font-black text-[10px] mb-4 uppercase tracking-[0.2em]">
                          <Check size={14} className="mr-2" /> Perilaku Dianjurkan
                        </div>
                        <ul className="space-y-3">
                          {target.dianjurkan.map((item, idx) => (
                            <li key={idx} className="flex items-start text-[11px] text-emerald-900 font-medium leading-relaxed">
                              <span className="mr-2 text-emerald-500">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100/50">
                        <div className="flex items-center text-rose-700 font-black text-[10px] mb-4 uppercase tracking-[0.2em]">
                          <CircleX size={14} className="mr-2" /> Perilaku Dihindari
                        </div>
                        <ul className="space-y-3">
                          {target.dihindari.map((item, idx) => (
                            <li key={idx} className="flex items-start text-[11px] text-rose-900 font-medium leading-relaxed">
                              <span className="mr-2 text-rose-500">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => toggleIndicator(target.id)}
                        className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          indicators[target.id]?.checked 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {indicators[target.id]?.checked ? <><Check size={18} /> <span>Teramati</span></> : 'Belum Teramati'}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Catatan Temuan Lapangan:</label>
                      <textarea 
                        value={indicators[target.id]?.note || ''}
                        onChange={(e) => updateNote(target.id, e.target.value)}
                        placeholder="Ketik catatan di sini..."
                        className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner min-h-[160px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilihan Cepat (Klik untuk menambah):</p>
                      <div className="flex flex-wrap gap-2">
                        {(OBSERVATION_SUGGESTIONS[target.id] || []).map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => appendSuggestion(target.id, suggestion)}
                            className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 text-left"
                          >
                            <Plus size={10} className="shrink-0" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900">
              <MessageSquareText size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold">Catatan Tambahan Pelaksanaan</h3>
            </div>
            <textarea 
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Tambahkan catatan umum lainnya selama observasi berlangsung (opsional)..."
              className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner min-h-[120px]"
            />
          </div>

          <div className="flex justify-end pt-8">
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-14 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95"
            >
              {isSaved ? (
                <><Check size={20} /> <span>Data Tersimpan</span></>
              ) : (
                <><Save size={20} /> <span>Simpan Hasil Observasi</span></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;
