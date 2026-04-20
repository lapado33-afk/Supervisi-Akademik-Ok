
import React, { useState, useEffect } from 'react';
import { Info, ChevronRight, FileText, BookOpen, Clock, Target, CreditCard, Layers, Zap, StickyNote, Check, Plus, User } from 'lucide-react';
import { TEACHERS, FOCUS_OPTIONS } from '../constants';
import { ObservationData, SupervisionStatus } from '../types';

interface Props {
  onSave: (data: ObservationData) => void;
  principalNip: string;
  teachers: Teacher[];
}

const AREA_SUGGESTIONS = [
  "Pemanfaatan IT dalam pembelajaran (Canva/Quizizz/Wordwall)",
  "Penerapan Strategi Diferensiasi (Konten/Proses/Produk)",
  "Pengembangan Kompetensi Sosial Emosional (KSE) murid",
  "Peningkatan Keaktifan Murid melalui diskusi kelompok interaktif",
  "Penerapan Disiplin Positif dan Budaya Positif di kelas"
];

const STRATEGY_SUGGESTIONS = [
  "Model Problem Based Learning (PBL) dengan media interaktif",
  "Model Discovery Learning melalui metode Eksperimen mandiri",
  "Project Based Learning (PjBL) berbasis masalah lingkungan nyata",
  "Cooperative Learning metode Jigsaw untuk kolaborasi aktif",
  "Flipped Classroom dengan memanfaatkan materi belajar di PMM"
];

const NOTES_SUGGESTIONS = [
  "Fokus pada interaksi antara guru dan murid yang cenderung pasif",
  "Perhatikan manajemen waktu terutama saat transisi antar fase",
  "Amati penggunaan media ajar apakah benar-benar membantu pemahaman",
  "Pastikan umpan balik diberikan secara merata kepada seluruh kelompok",
  "Dokumentasikan variasi pertanyaan pemantik yang diajukan guru"
];

const PreObservation: React.FC<Props> = ({ onSave, principalNip, teachers }) => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [subject, setSubject] = useState('');
  const [obsDate, setObsDate] = useState('');
  const [convTime, setConvTime] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [developmentArea, setDevelopmentArea] = useState('');
  const [strategy, setStrategy] = useState('');
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (selectedTeacher === 'manual') {
      setTeacherName('');
      setSubject('');
      setTeacherNip('');
      setPhotoUrl('');
    } else {
      const teacher = teachers.find(t => t.id === selectedTeacher);
      if (teacher) {
        setTeacherName(teacher.name);
        setSubject(teacher.subject);
        setTeacherNip(teacher.nip || '');
        setPhotoUrl(teacher.photoUrl || '');
      }
    }
  }, [selectedTeacher]);

  const handleAppendArea = (text: string) => {
    setDevelopmentArea(prev => prev ? `${prev}. ${text}` : text);
  };

  const handleAppendStrategy = (text: string) => {
    setStrategy(prev => prev ? `${prev}. ${text}` : text);
  };

  const handleAppendNotes = (text: string) => {
    setSupervisorNotes(prev => prev ? `${prev}. ${text}` : text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedFocus || !learningGoals) {
      return alert('Mohon lengkapi minimal Nama Guru, Fokus, dan Tujuan Pembelajaran!');
    }

    const finalTeacherId = selectedTeacher === 'manual' ? `manual-${Date.now()}` : selectedTeacher;

    const data: ObservationData = {
      teacherId: finalTeacherId,
      teacherName: teacherName,
      teacherNip: teacherNip,
      principalNip: principalNip,
      date: obsDate || new Date().toISOString(),
      subject: subject,
      conversationTime: convTime,
      learningGoals: learningGoals,
      developmentArea: developmentArea,
      strategy: strategy,
      supervisorNotes: supervisorNotes,
      focusId: selectedFocus,
      indicators: {},
      reflection: '',
      coachingFeedback: '',
      rtl: '',
      status: SupervisionStatus.PLANNED
    };

    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Perencanaan Pra-Observasi</h2>
        <p className="text-slate-500 text-sm font-medium">Langkah awal pendampingan akademik berbasis pengembangan kompetensi.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start space-x-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white mt-1 shadow-md">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Panduan Pengisian</h4>
          <p className="text-xs text-blue-800 leading-relaxed mt-1 font-medium">
            Gunakan pilihan cepat di bawah kotak isian untuk mempercepat pendokumentasian kesepakatan. Anda tetap dapat memilih lebih dari satu saran (akumulatif).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <BookOpen size={14} className="mr-2 text-blue-600" /> Pilih / Input Guru
            </label>
            <div className="flex gap-4">
              <select 
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900"
              >
                <option value="">-- Pilih Guru --</option>
                <option value="manual" className="text-blue-600 font-bold">+ Input Manual (Guru Baru)</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {selectedTeacher === 'manual' ? (
                <div className="w-12 h-12 rounded-2xl border-2 border-white border-dashed bg-slate-100 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                  <User size={20} />
                </div>
              ) : photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Teacher" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-200 shadow-sm transition-all animate-in fade-in zoom-in shrink-0"
                />
              ) : null}
            </div>
            {(selectedTeacher || selectedTeacher === 'manual') && (
              <input 
                type="text" 
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Nama Lengkap Guru & Gelar"
                className="w-full bg-blue-50 border border-blue-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900 mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <CreditCard size={14} className="mr-2 text-blue-600" /> NIP Guru
            </label>
            <input 
              type="text" 
              value={teacherNip}
              onChange={(e) => setTeacherNip(e.target.value)}
              placeholder="Masukkan NIP..."
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mata Pelajaran"
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Tanggal Observasi</label>
            <input 
              type="date" 
              value={obsDate}
              onChange={(e) => setObsDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} className="mr-2 text-blue-600" /> Jam Pertemuan
            </label>
            <input 
              type="time" 
              value={convTime}
              onChange={(e) => setConvTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Target size={14} className="mr-2 text-blue-600" /> Tujuan Pembelajaran
            </label>
            <textarea 
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder="Contoh: Peserta didik mampu menganalisis struktur teks naratif melalui diskusi kelompok..."
              className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm font-bold text-slate-900 shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Layers size={14} className="mr-2 text-blue-600" /> 1. Area Pengembangan yang Hendak Dicapai
            </label>
            <textarea 
              value={developmentArea}
              onChange={(e) => setDevelopmentArea(e.target.value)}
              placeholder="Tuliskan area fokus pengembangan di sini..."
              className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm font-bold text-slate-900 shadow-inner"
            />
            <div className="flex flex-wrap gap-2">
              {AREA_SUGGESTIONS.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendArea(option)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                >
                  <Plus size={10} />
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Zap size={14} className="mr-2 text-blue-600" /> 2. Strategi / Metode yang Dipersiapkan
            </label>
            <textarea 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              placeholder="Tuliskan strategi atau model pembelajaran di sini..."
              className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm font-bold text-slate-900 shadow-inner"
            />
            <div className="flex flex-wrap gap-2">
              {STRATEGY_SUGGESTIONS.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendStrategy(option)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                >
                  <Plus size={10} />
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <StickyNote size={14} className="mr-2 text-blue-600" /> Catatan Khusus Supervisor
            </label>
            <textarea 
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              placeholder="Contoh: Berikan perhatian khusus pada murid di baris belakang selama diskusi..."
              className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm font-medium italic text-slate-600 shadow-inner"
            />
            <div className="flex flex-wrap gap-2">
              {NOTES_SUGGESTIONS.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendNotes(option)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                >
                  <Plus size={10} />
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilih Fokus Indikator Observasi</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOCUS_OPTIONS.map((focus) => (
              <button
                key={focus.id}
                type="button"
                onClick={() => setSelectedFocus(focus.id)}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 ${
                  selectedFocus === focus.id 
                    ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100 shadow-md' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <h5 className="font-black text-slate-900 mb-2 text-sm">{focus.title}</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{focus.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-10 border-t border-slate-100">
          <button 
            type="submit"
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95"
          >
            {isSaved ? (
              <><Check size={20} /> <span>Tersimpan di Cloud</span></>
            ) : (
              <><FileText size={20} /> <span>Simpan Perencanaan</span> <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreObservation;
