import React, { useState, useRef } from 'react';
import { Download, Filter, X, FileText, Copy, Check, Share2 } from 'lucide-react';
import { ObservationData, SupervisionStatus } from '../types';
import { Teacher, OBSERVATION_INDICATORS } from '../constants';
import PrintReport from './PrintReport';

interface Props {
  observations: ObservationData[];
  principalName: string;
  principalNip: string;
  schoolName: string;
  schoolAddress: string;
  logoKabupaten: string;
  logoSekolah: string;
  pemerintah: string;
  dinas: string;
  teachers: Teacher[];
}

const ReportView: React.FC<Props> = ({ observations, principalName, principalNip, schoolName, schoolAddress, logoKabupaten, logoSekolah, pemerintah, dinas, teachers }) => {
  const [printData, setPrintData] = useState<ObservationData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAllCopied, setIsAllCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const exportToCSV = () => {
    if (observations.length === 0) return alert("Tidak ada data untuk diunduh.");
    const headers = ["Nama Guru", "NIP Guru", "Mata Pelajaran", "Tanggal", "Status", "Tujuan", "Area Pengembangan", "Strategi", "RTL"];
    const rows = observations.map(obs => {
      const teacher = teachers.find(t => String(t.id) === String(obs.teacherId));
      return [
        `"${obs.teacherName || teacher?.name || 'Guru'}"`,
        `"${obs.teacherNip || teacher?.nip || ''}"`,
        `"${obs.subject || teacher?.subject || ''}"`,
        `"${new Date(obs.date).toLocaleDateString('id-ID')}"`,
        `"${obs.status}"`,
        `"${(obs.learningGoals || '').replace(/"/g, '""')}"`,
        `"${(obs.developmentArea || '').replace(/"/g, '""')}"`,
        `"${(obs.strategy || '').replace(/"/g, '""')}"`,
        `"${(obs.rtl || '').replace(/"/g, '""')}"`
      ];
    });
    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Supervisi_SMPN1_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyAllToClipboard = () => {
    if (observations.length === 0) return alert("Tidak ada data untuk disalin.");
    
    const text = `
REKAPITULASI LAPORAN SUPERVISI AKADEMIK
${schoolName.toUpperCase()}
---------------------------------------
Total Laporan: ${observations.length}
Dicetak pada: ${new Date().toLocaleString('id-ID')}
Supervisor: ${principalName} (NIP: ${principalNip})

DAFTAR OBSERVASI:
${observations.map((obs, idx) => {
  return `${idx + 1}. ${obs.teacherName} (${obs.subject})
   - Tanggal: ${new Date(obs.date).toLocaleDateString('id-ID')}
   - Status: ${obs.status}
   - RTL: ${obs.rtl || '-'}`;
}).join('\n\n')}

---
Laporan digenerate secara otomatis melalui Sistem Supervisi Digital.
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setIsAllCopied(true);
      setTimeout(() => setIsAllCopied(false), 2000);
    });
  };

  const copyToClipboard = () => {
    if (!printData) return;
    
    const teacher = teachers.find(t => String(t.id) === String(printData.teacherId));
    const dateStr = new Date(printData.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Hanya ambil indikator yang checked
    const activeIndicators = OBSERVATION_INDICATORS.filter(ind => printData.indicators?.[ind.id]?.checked);

    const text = `
LAPORAN HASIL SUPERVISI AKADEMIK
-------------------------------
Nama Guru: ${printData.teacherName || teacher?.name}
NIP Guru: ${printData.teacherNip || teacher?.nip || '-'}
Mata Pelajaran: ${printData.subject}
Tanggal: ${dateStr}
Supervisor: ${principalName}

I. PRA-OBSERVASI
- Tujuan Pembelajaran: ${printData.learningGoals || '-'}
- Area Pengembangan: ${printData.developmentArea || '-'}
- Strategi / Metode: ${printData.strategy || '-'}
- Catatan Supervisor: ${printData.supervisorNotes || '-'}

II. HASIL OBSERVASI (Indikator Teramati)
${activeIndicators.length > 0 
  ? activeIndicators.map((ind, idx) => `${idx + 1}. ${ind.label}: [ADA] - Catatan: ${printData.indicators?.[ind.id]?.note || '-'}`).join('\n')
  : '- Tidak ada target perilaku terpilih yang teramati -'}

Catatan Tambahan Pelaksanaan: ${printData.additionalNotes || '-'}

III. PASCA-OBSERVASI
Refleksi Guru: ${printData.reflection || '-'}
Feedback Supervisor: ${printData.coachingFeedback || '-'}
Rencana Tindak Lanjut: ${printData.rtl || '-'}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const openPreview = (obs: ObservationData) => {
    setPrintData(obs);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPrintData(null);
  };

  const handlePrint = () => {
    if (!reportRef.current || !printData) return;
    const printSection = document.getElementById('print-section');
    if (!printSection) return;

    // Bersihkan kontainer cetak lama
    printSection.innerHTML = '';
    
    // Clone konten dari preview modal
    const contentClone = reportRef.current.cloneNode(true) as HTMLElement;
    printSection.appendChild(contentClone);

    // Berikan jeda 150ms agar browser merender DOM baru sebelum dialog print muncul
    setTimeout(() => {
      const originalTitle = document.title;
      const teacherName = printData.teacherName || 'Guru';
      document.title = `Laporan_Supervisi_${teacherName.replace(/\s+/g, '_')}`;
      
      window.print();
      
      document.title = originalTitle;
    }, 150);
  };

  return (
    <div className="space-y-8 animate-in duration-500 relative">
      {showPreview && printData && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 modal-backdrop" onClick={closePreview}></div>
          <div className="relative bg-white w-full max-w-5xl h-full max-h-[95vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center space-x-3">
                {printData && (
                  <img 
                    src={teachers.find(t => String(t.id) === String(printData.teacherId))?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${printData.teacherName}`}
                    className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm bg-slate-200 shrink-0"
                    alt="Teacher"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h3 className="font-bold text-slate-900">{printData?.teacherName || 'Preview Laporan'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 italic">Hasil Supervisi Akademik</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={copyToClipboard}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 shadow-lg active:scale-95 ${
                    isCopied ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{isCopied ? 'TERSALIN!' : 'SALIN TEKS'}</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-200 active:scale-95"
                >
                  <Download size={16} />
                  <span>UNDUH PDF</span>
                </button>
                <button 
                  onClick={closePreview}
                  className="bg-slate-100 text-slate-500 p-2.5 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-12 no-scrollbar">
              <div ref={reportRef} className="bg-white shadow-xl mx-auto border border-slate-100 p-0">
                <PrintReport 
                  data={printData} 
                  principalName={principalName} 
                  principalNip={principalNip} 
                  schoolName={schoolName}
                  schoolAddress={schoolAddress}
                  logoKabupaten={logoKabupaten}
                  logoSekolah={logoSekolah}
                  pemerintah={pemerintah}
                  dinas={dinas}
                  teachers={teachers}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan & Analisis</h2>
          <p className="text-slate-500 text-sm font-medium">Rekapitulasi dan dokumen hasil supervisi akademik.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={copyAllToClipboard}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              isAllCopied 
                ? 'bg-emerald-600 text-white shadow-emerald-100' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-slate-100'
            }`}
          >
            {isAllCopied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{isAllCopied ? 'Tersalin' : 'Bagikan Laporan'}</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <Download size={18} />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold">Arsip Dokumen Supervisi</h3>
          <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Filter size={14} className="mr-2" /> Klik BUKA untuk preview, salin, atau unduh
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Guru</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Terakhir</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 text-sm italic">Belum ada rekaman observasi.</td>
                </tr>
              ) : (
                observations.map((obs, i) => {
                  const teacher = teachers.find(t => String(t.id) === String(obs.teacherId));
                  return (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={teacher?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${obs.teacherName}`} 
                            alt={obs.teacherName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm bg-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{obs.teacherName}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{obs.subject} • {new Date(obs.date).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        obs.status === SupervisionStatus.FOLLOWED_UP 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {obs.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => openPreview(obs)}
                        className="inline-flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-blue-600 transition-all shadow-md active:scale-95"
                      >
                        <FileText size={14} />
                        <span>BUKA</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportView;