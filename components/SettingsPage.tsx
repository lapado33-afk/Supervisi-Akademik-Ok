import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Key, 
  Database, 
  Save, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  BookOpen,
  X,
  UserCheck,
  Camera,
  User as UserIcon
} from 'lucide-react';

import TeacherManagement from './TeacherManagement';
import { Teacher } from '../constants';

interface SettingsProps {
  onSave: () => void;
  teachers: Teacher[];
  onTeachersUpdate: (teachers: Teacher[]) => void;
  principal: { name: string; nip: string; role: string; photo: string };
  onPrincipalUpdate: (principal: { name: string; nip: string; role: string; photo: string }) => void;
}

const APPS_SCRIPT_CODE = `/**
 * BACKEND API - SISTEM SUPERVISI AKADEMIK DIGITAL
 * Paste kode ini di Google Apps Script (script.google.com)
 */

// 1. BUAT SPREADSHEET BARU DI GOOGLE DRIVE ANDA
// 2. COPY ID SPREADSHEET (ADA DI URL SPREADSHEET)
// 3. PASTE ID NYA DI BAWAH INI:
const SPREADSHEET_ID = 'MASUKKAN_ID_SPREADSHEET_DISINI';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getObservations') return createJsonResponse(getObservationsFromCloud());
  if (action === 'clearAll') return createJsonResponse(clearAllObservations());
  return createJsonResponse({status: 'API Active', spreadsheetId: SPREADSHEET_ID});
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    return createJsonResponse(saveObservationToCloud(postData));
  } catch (err) {
    return createJsonResponse({success: false, error: err.toString()});
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getObservationsFromCloud() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    createSheetStructure(ss); 
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    const headers = data[0];
    return data.slice(1).map(row => {
      const obs = {};
      headers.forEach((header, index) => {
        const key = header || "column_" + index;
        if (key === 'indicators') {
          try { obs[key] = JSON.parse(row[index] || '{}'); } catch(e) { obs[key] = {}; }
        } else { obs[key] = row[index]; }
      });
      return obs;
    });
  } catch (e) { return []; }
}

function saveObservationToCloud(obsData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    createSheetStructure(ss);
    const data = sheet.getDataRange().getValues();
    const teacherId = obsData.teacherId;
    const rowIndex = data.findIndex(row => row[0] == teacherId);
    
    const rowData = [
      String(obsData.teacherId).trim(),
      String(obsData.teacherName || '').trim(),
      String(obsData.teacherNip || '').trim(),
      String(obsData.principalNip || '').trim(),
      obsData.date,
      obsData.subject,
      obsData.conversationTime,
      obsData.learningGoals || '',
      obsData.developmentArea || '',
      obsData.strategy || '',
      obsData.supervisorNotes || '',
      obsData.additionalNotes || '',
      obsData.focusId,
      JSON.stringify(obsData.indicators || {}),
      obsData.reflection || '',
      String(obsData.coachingFeedback || '').trim(),
      obsData.rtl || '',
      String(obsData.status || '').trim()
    ];

    if (rowIndex > -1) {
      sheet.getRange(rowIndex + 1, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function clearAllObservations() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi');
    if (sheet && sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function createSheetStructure(ss) {
  let sheet = ss.getSheetByName('Observasi');
  const headers = ['teacherId', 'teacherName', 'teacherNip', 'principalNip', 'date', 'subject', 'conversationTime', 'learningGoals', 'developmentArea', 'strategy', 'supervisorNotes', 'additionalNotes', 'focusId', 'indicators', 'reflection', 'coachingFeedback', 'rtl', 'status'];
  if (!sheet) sheet = ss.insertSheet('Observasi');
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f4f6');
  sheet.setFrozenRows(1);
  return sheet;
}
`;

const SettingsPage: React.FC<SettingsProps> = ({ onSave, teachers, onTeachersUpdate, principal, onPrincipalUpdate }) => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [pemerintah, setPemerintah] = useState('');
  const [dinas, setDinas] = useState('');
  const [logoKabupaten, setLogoKabupaten] = useState('');
  const [logoSekolah, setLogoSekolah] = useState('');
  const [personalApiKey, setPersonalApiKey] = useState('');
  const [scriptUrl, setScriptUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Load existing settings from localStorage
    setSchoolName(localStorage.getItem('app_school_name') || 'SMPN 1 Mappedeceng');
    setSchoolAddress(localStorage.getItem('app_school_address') || 'Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963');
    setPemerintah(localStorage.getItem('app_pemerintah_name') || 'PEMERINTAH KABUPATEN LUWU UTARA');
    setDinas(localStorage.getItem('app_dinas_name') || 'DINAS PENDIDIKAN DAN KEBUDAYAAN');
    setLogoKabupaten(localStorage.getItem('app_logo_kabupaten') || '');
    setLogoSekolah(localStorage.getItem('app_logo_sekolah') || '');
    setPersonalApiKey(localStorage.getItem('app_personal_api_key') || '');
    setScriptUrl(localStorage.getItem('app_web_app_url') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('app_school_name', schoolName);
    localStorage.setItem('app_school_address', schoolAddress);
    localStorage.setItem('app_pemerintah_name', pemerintah);
    localStorage.setItem('app_dinas_name', dinas);
    localStorage.setItem('app_logo_kabupaten', logoKabupaten);
    localStorage.setItem('app_logo_sekolah', logoSekolah);
    localStorage.setItem('app_personal_api_key', personalApiKey);
    localStorage.setItem('app_web_app_url', scriptUrl);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    onSave();
  };

  const copyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'kab' | 'sek') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'kab') setLogoKabupaten(base64String);
        else setLogoSekolah(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrincipalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onPrincipalUpdate({ ...principal, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTutorial(false)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl text-white">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Setup Database Pribadi</h3>
                  <p className="text-xs text-slate-500 font-medium">Langkah menghubungkan ke Google Drive Sekolah</p>
                </div>
              </div>
              <button onClick={() => setShowTutorial(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">1</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Buat Spreadsheet Baru</p>
                    <p className="text-xs text-slate-500 mt-1">Buka Google Sheets, buat file baru, lalu copy ID file tersebut dari URL (angka unik di antara /d/ dan /edit).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">2</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Copy Kode Backend</p>
                    <p className="text-xs text-slate-500 mt-1 mb-3">Klik tombol di bawah ini untuk menyalin kode Apps Script.</p>
                    <button 
                      onClick={copyScript}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all font-black uppercase tracking-widest text-[10px] ${
                        copiedCode ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedCode ? 'KODE TERSALIN!' : 'SALIN KODE APPS SCRIPT'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">3</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Deploy sebagai Web App</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Buka <b>Extensions {">"} Apps Script</b>, hapus kode lama, paste kode baru. Ganti <code>SPREADSHEET_ID</code> dengan ID Anda. Klik <b>Deploy {">"} New Deployment</b>. Pilih tipe <b>Web App</b>, Execute as <b>Me</b>, Who has access <b>Anyone</b>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">4</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Tempel Web App URL</p>
                    <p className="text-xs text-slate-500 mt-1">Copy URL hasil deploy tersebut dan tempelkan di kolom <b>Google Apps Script Web App URL</b> di halaman Pengaturan ini.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3">
                <CheckCircle2 className="text-blue-500" size={20} />
                <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-wider">
                  Selesai! Sekarang data Anda akan otomatis tersimpan di Spreadsheet pribadi milik sekolah Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-slate-500">Sesuaikan identitas sekolah dan integrasi data untuk penggunaan mandiri.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identitas Sekolah */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Identitas Sekolah</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Garis Kop 1 (Contoh: Kabupaten/Provinsi)</label>
              <input 
                type="text" 
                value={pemerintah}
                onChange={(e) => setPemerintah(e.target.value)}
                placeholder="PEMERINTAH KABUPATEN ..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Garis Kop 2 (Contoh: Dinas Pendidikan)</label>
              <input 
                type="text" 
                value={dinas}
                onChange={(e) => setDinas(e.target.value)}
                placeholder="DINAS PENDIDIKAN ..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Sekolah</label>
              <input 
                type="text" 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: UPT SMP Negeri 1 Mappedeceng"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Alamat Sekolah</label>
              <textarea 
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                placeholder="Jl. ..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none text-xs"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter text-[10px]">Logo Kabupaten (Kiri)</label>
                <div className="relative group flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-2 hover:border-blue-400 transition-all aspect-square bg-slate-50 overflow-hidden">
                  {logoKabupaten ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={logoKabupaten} alt="Logo Kab" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      <button onClick={() => setLogoKabupaten('')} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-1 w-full h-full">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                        <Save size={16} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'kab')} />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter text-[10px]">Logo Sekolah (Kanan)</label>
                <div className="relative group flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-2 hover:border-blue-400 transition-all aspect-square bg-slate-50 overflow-hidden">
                  {logoSekolah ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={logoSekolah} alt="Logo Sek" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      <button onClick={() => setLogoSekolah('')} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-1 w-full h-full">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                        <Save size={16} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'sek')} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Identitas Kepala Sekolah */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <UserCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Identitas Kepala Sekolah</h3>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
             <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 border-4 border-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                  {principal.photo ? (
                    <img src={principal.photo} alt="Kepala Sekolah" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="text-slate-300" size={40} />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePrincipalPhotoChange(e)} />
                </label>
              </div>
              <p className="text-[10px] text-slate-400 text-center font-medium max-w-[150px]">Foto ini akan muncul di sidebar dan laporan digital.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Lengkap & Gelar Kepala Sekolah</label>
              <input 
                type="text" 
                value={principal.name}
                onChange={(e) => onPrincipalUpdate({ ...principal, name: e.target.value })}
                placeholder="Contoh: Drs. H. Ahmad, M.Pd."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">NIP</label>
              <input 
                type="text" 
                value={principal.nip}
                onChange={(e) => onPrincipalUpdate({ ...principal, nip: e.target.value })}
                placeholder="Masukkan NIP..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600">
              <Key size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Konfigurasi AI (Gemini)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">API Key Pribadi (Opsional)</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={personalApiKey}
                  onChange={(e) => setPersonalApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 pl-11 rounded-2xl text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono text-sm"
                />
                <ShieldCheck className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Biarkan kosong untuk menggunakan kuota sistem. Isi jika Anda ingin menggunakan kuota pribadi dari Google AI Studio.
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Management */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <TeacherManagement teachers={teachers} onUpdate={onTeachersUpdate} />
        </div>

        {/* Database Integration */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Integrasi Database (Google Drive)</h3>
            </div>
            <button 
              onClick={() => setShowTutorial(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
            >
              <BookOpen size={14} />
              <span>Panduan Setup</span>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
            <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Untuk menyimpan data ke Google Sheets milik sekolah Anda sendiri, silakan Deploy <strong>Apps Script (Code.gs)</strong> sebagai Web App, lalu tempelkan URL-nya di bawah ini. Jika kosong, data hanya akan tersimpan di browser ini.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Google Apps Script Web App URL</label>
              <input 
                type="url" 
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 pb-10">
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
            isSaved 
              ? 'bg-green-600 text-white translate-y-1' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          <Save size={20} />
          <span>{isSaved ? 'Berhasil Disimpan' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
