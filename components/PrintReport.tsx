import React from 'react';
import { ObservationData } from '../types';
import { Teacher, OBSERVATION_INDICATORS } from '../constants';

interface Props {
  data: ObservationData;
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

const PrintReport: React.FC<Props> = ({ data, principalName, principalNip, schoolName, schoolAddress, logoKabupaten, logoSekolah, pemerintah, dinas, teachers }) => {
  const teacher = teachers.find(t => String(t.id) === String(data.teacherId));
  const displayTeacherName = data.teacherName || teacher?.name || 'Guru Mata Pelajaran';
  const displayTeacherNip = data.teacherNip || teacher?.nip || '...........................';
  const displayPrincipalNip = principalNip || data.principalNip || '...........................';
  
  const dateStr = data.date 
    ? new Date(data.date).toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '...........................';

  // Filter hanya indikator yang di-cek (checked: true)
  const observedIndicators = OBSERVATION_INDICATORS.filter(
    ind => data.indicators && data.indicators[ind.id]?.checked
  );

  return (
    <div className="bg-white p-10 text-black font-serif leading-normal text-xs max-w-[210mm] mx-auto min-h-[297mm]" style={{ color: 'black' }}>
      {/* KOP SURAT */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 flex items-center justify-between space-x-4">
        {logoKabupaten && (
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <img src={logoKabupaten} alt="Logo Kab" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        )}
        
        <div className="flex-1 text-center">
          <h1 className="text-sm font-bold uppercase tracking-tight leading-tight">{pemerintah}</h1>
          <h1 className="text-sm font-bold uppercase tracking-tight leading-tight">{dinas}</h1>
          <h2 className="text-lg font-black uppercase mt-1 leading-tight">{schoolName}</h2>
          <p className="text-[10px] italic mt-1 font-medium leading-tight">{schoolAddress}</p>
        </div>

        {logoSekolah && (
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <img src={logoSekolah} alt="Logo Sek" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>

      <div className="text-center mb-6">
        <h3 className="text-sm font-bold underline uppercase">LAPORAN HASIL SUPERVISI AKADEMIK</h3>
        <p className="text-xs font-bold">TAHUN PELAJARAN 2025/2026</p>
      </div>

      {/* IDENTITAS */}
      <div className="mb-6 border border-black p-4 rounded-md">
        <table className="w-full text-xs">
          <tbody>
            <tr><td className="w-32 py-1 font-bold">Nama Guru</td><td className="w-4">:</td><td className="font-bold">{displayTeacherName}</td></tr>
            <tr><td className="w-32 py-1 font-bold">NIP Guru</td><td className="w-4">:</td><td>{displayTeacherNip}</td></tr>
            <tr><td className="py-1 font-bold">Mata Pelajaran</td><td>:</td><td>{data.subject || teacher?.subject || '-'}</td></tr>
            <tr><td className="py-1 font-bold">Hari / Tanggal</td><td>:</td><td>{dateStr}</td></tr>
            <tr><td className="py-1 font-bold">Jam / Waktu</td><td>:</td><td>{data.conversationTime || '-'} WITA</td></tr>
            <tr><td className="py-1 font-bold">Supervisor</td><td>:</td><td>{principalName}</td></tr>
          </tbody>
        </table>
      </div>

      {/* PRA-OBSERVASI */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1.5 font-bold border-l-4 border-black mb-3 uppercase text-xs">I. CATATAN PRA-OBSERVASI</h4>
        <div className="pl-2 space-y-4">
          <div>
            <p className="font-bold underline text-xs mb-1">Tujuan Pembelajaran:</p>
            <p className="text-xs leading-relaxed">{data.learningGoals || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-xs mb-1">Area Pengembangan yang Hendak Dicapai:</p>
            <p className="text-xs leading-relaxed">{data.developmentArea || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-xs mb-1">Strategi / Metode yang Dipersiapkan:</p>
            <p className="text-xs leading-relaxed">{data.strategy || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-xs mb-1">Catatan Khusus Supervisor:</p>
            <p className="text-xs leading-relaxed italic">{data.supervisorNotes || '-'}</p>
          </div>
        </div>
      </div>

      {/* OBSERVASI TABLE */}
      <div className="mb-6">
        <h4 className="bg-gray-100 p-1.5 font-bold border-l-4 border-black mb-3 uppercase text-xs">II. OBSERVASI PEMBELAJARAN</h4>
        <table className="w-full border-collapse border border-black text-xs mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-black p-2 w-8 text-center">No</th>
              <th className="border border-black p-2 text-left">Aspek Pengamatan (Target Perilaku Terpilih)</th>
              <th className="border border-black p-2 w-20 text-center">Status</th>
              <th className="border border-black p-2 text-left">Catatan / Bukti Nyata</th>
            </tr>
          </thead>
          <tbody>
            {observedIndicators.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-black p-4 text-center italic">Tidak ada target perilaku spesifik yang terpilih untuk diobservasi.</td>
              </tr>
            ) : (
              observedIndicators.map((ind, idx) => (
                <tr key={ind.id}>
                  <td className="border border-black p-2 text-center">{idx + 1}</td>
                  <td className="border border-black p-2 font-bold">{ind.label}</td>
                  <td className="border border-black p-2 text-center font-bold">ADA</td>
                  <td className="border border-black p-2 italic text-[11px] leading-snug">
                    {data.indicators && data.indicators[ind.id]?.note ? data.indicators[ind.id].note : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data.additionalNotes && (
          <div className="pl-2 mt-2">
            <p className="font-bold underline text-xs mb-1">Catatan Tambahan Observasi:</p>
            <p className="text-xs leading-relaxed italic">{data.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* PASCA-OBSERVASI */}
      <div className="mb-10">
        <h4 className="bg-gray-100 p-1.5 font-bold border-l-4 border-black mb-3 uppercase text-xs">III. PASCA-OBSERVASI & TINDAK LANJUT</h4>
        <div className="space-y-5 pl-2">
          <div>
            <p className="font-bold underline text-xs mb-1">Refleksi Guru:</p>
            <p className="text-xs italic leading-relaxed">{data.reflection || '-'}</p>
          </div>
          <div>
            <p className="font-bold underline text-xs mb-1">Umpan Balik Supervisor:</p>
            <div className="text-[11px] border border-gray-300 p-4 bg-gray-50 whitespace-pre-wrap leading-relaxed text-justify">
              {data.coachingFeedback || '-'}
            </div>
          </div>
          <div>
            <p className="font-bold underline text-xs mb-1">Rencana Tindak Lanjut:</p>
            <p className="text-xs font-bold leading-relaxed">{data.rtl || '-'}</p>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div className="flex justify-between mt-16 px-10">
        <div className="text-center">
          <p className="mb-24">Guru Mata Pelajaran,</p>
          <p className="font-bold underline uppercase">{displayTeacherName}</p>
          <p className="text-xs">NIP. {displayTeacherNip}</p>
        </div>
        <div className="text-center">
          <p className="mb-24">Kepala Sekolah / Supervisor,</p>
          <p className="font-bold underline uppercase">{principalName}</p>
          <p className="text-xs">NIP. {displayPrincipalNip}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReport;