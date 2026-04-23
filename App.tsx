import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  Users, 
  BarChart, 
  Settings,
  Search,
  ChevronRight,
  Calendar,
  UserCheck,
  Trash2
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PreObservation from './components/PreObservation';
import ObservationForm from './components/ObservationForm';
import PostObservation from './components/PostObservation';
import ReportView from './components/ReportView';
import SettingsPage from './components/SettingsPage';
import { ObservationData } from './types';
import { cloudStorage } from './services/sheetsService';
import { TEACHERS, Teacher } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [observations, setObservations] = useState<ObservationData[]>([]);
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('app_teachers');
    return saved ? JSON.parse(saved) : TEACHERS;
  });
  
  const [principal, setPrincipal] = useState(() => {
    const saved = localStorage.getItem('app_principal');
    return saved ? JSON.parse(saved) : {
      name: 'IKHBARIYATI MARUNNISA, S.Pd, Gr , SPd',
      nip: '197806142006041009',
      role: 'Kepala Sekolah',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan'
    };
  });

  const [schoolName, setSchoolName] = useState(localStorage.getItem('app_school_name') || 'UPT SMPN 4 Mappedeceng');
  const [schoolAddress, setSchoolAddress] = useState(localStorage.getItem('app_school_address') || 'Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963');
  const [logoKabupaten, setLogoKabupaten] = useState(localStorage.getItem('app_logo_kabupaten') || '');
  const [logoSekolah, setLogoSekolah] = useState(localStorage.getItem('app_logo_sekolah') || '');
  const [pemerintah, setPemerintah] = useState(localStorage.getItem('app_pemerintah_name') || 'PEMERINTAH KABUPATEN LUWU UTARA');
  const [dinas, setDinas] = useState(localStorage.getItem('app_dinas_name') || 'DINAS PENDIDIKAN DAN KEBUDAYAAN');

  const refreshSettings = () => {
    setSchoolName(localStorage.getItem('app_school_name') || 'UPT SMPN 4 Mappedeceng');
    setSchoolAddress(localStorage.getItem('app_school_address') || 'Jl. Poros Desa, Kec. Mappedeceng, Kab. Luwu Utara, Sulawesi Selatan 92963');
    setLogoKabupaten(localStorage.getItem('app_logo_kabupaten') || '');
    setLogoSekolah(localStorage.getItem('app_logo_sekolah') || '');
    setPemerintah(localStorage.getItem('app_pemerintah_name') || 'PEMERINTAH KABUPATEN LUWU UTARA');
    setDinas(localStorage.getItem('app_dinas_name') || 'DINAS PENDIDIKAN DAN KEBUDAYAAN');
    
    const savedTeachers = localStorage.getItem('app_teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));

    const savedPrincipal = localStorage.getItem('app_principal');
    if (savedPrincipal) setPrincipal(JSON.parse(savedPrincipal));
  };

  const handleTeachersUpdate = (newList: Teacher[]) => {
    setTeachers(newList);
    localStorage.setItem('app_teachers', JSON.stringify(newList));
  };

  const handlePrincipalUpdate = (newPrincipal: typeof principal) => {
    setPrincipal(newPrincipal);
    localStorage.setItem('app_principal', JSON.stringify(newPrincipal));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await cloudStorage.fetchAll();
        setObservations(data);
      } catch (err) {
        console.error("Gagal memuat data awal:", err);
      }
    };
    loadInitialData();
  }, []);

  const updateObservations = async (newData: ObservationData) => {
    setObservations(prev => {
      // Cari data lama berdasarkan ID Guru
      const existingIndex = prev.findIndex(o => String(o.teacherId) === String(newData.teacherId));
      
      let mergedData: ObservationData;
      let newObservations: ObservationData[];

      if (existingIndex > -1) {
        // Lakukan MERGE: Ambil data lama, timpa dengan data baru
        // Namun, JANGAN timpa field Pra-Observasi jika data baru mengirim string kosong
        const oldData = prev[existingIndex];
        mergedData = {
          ...oldData,
          ...newData,
          // Proteksi field krusial agar tidak hilang
          developmentArea: newData.developmentArea || oldData.developmentArea || '',
          strategy: newData.strategy || oldData.strategy || '',
          supervisorNotes: newData.supervisorNotes || oldData.supervisorNotes || '',
          learningGoals: newData.learningGoals || oldData.learningGoals || '',
          date: newData.date || oldData.date || new Date().toISOString(),
          photoPre: newData.photoPre || oldData.photoPre,
          photoObs: newData.photoObs || oldData.photoObs,
          photoPost: newData.photoPost || oldData.photoPost,
          principalNip: principal.nip
        };
        newObservations = [...prev];
        newObservations[existingIndex] = mergedData;
      } else {
        // Data baru sama sekali
        mergedData = {
          ...newData,
          principalNip: principal.nip
        };
        newObservations = [...prev, mergedData];
      }

      // Simpan ke Cloud (Spreadsheet)
      cloudStorage.save(mergedData);
      return newObservations;
    });
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  const handleResetData = async () => {
    if (window.confirm("PERINGATAN: Ini akan menghapus SELURUH data laporan dan DATA GURU yang Anda tambahkan. Lanjutkan?")) {
      try {
        setObservations([]); // Bersihkan UI segera
        setTeachers(TEACHERS); // Kembalikan ke daftar guru default
        localStorage.removeItem('app_teachers'); // Hapus dari storage lokal
        localStorage.removeItem('app_observations');
        await cloudStorage.clearAll();
        alert("PEMBERSIHAN BERHASIL!\n\nSeluruh data laporan dan daftar guru telah dihapus.");
        setActiveTab('dashboard');
      } catch (err) {
        alert("Terjadi masalah saat membersihkan cloud. Data lokal tetap dihapus.");
      }
    }
  };

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard': return <Dashboard observations={observations} schoolName={schoolName} teachers={teachers} />;
        case 'pra': return <PreObservation onSave={updateObservations} principalNip={principal.nip} teachers={teachers} />;
        case 'observasi': return <ObservationForm observations={observations} onSave={updateObservations} teachers={teachers} />;
        case 'pasca': return <PostObservation observations={observations} onSave={updateObservations} teachers={teachers} />;
        case 'laporan': return <ReportView observations={observations} principalName={principal.name} principalNip={principal.nip} schoolName={schoolName} schoolAddress={schoolAddress} logoKabupaten={logoKabupaten} logoSekolah={logoSekolah} pemerintah={pemerintah} dinas={dinas} teachers={teachers} />;
        case 'pengaturan': return <SettingsPage onSave={refreshSettings} teachers={teachers} onTeachersUpdate={handleTeachersUpdate} principal={principal} onPrincipalUpdate={handlePrincipalUpdate} />;
        default: return <Dashboard observations={observations} teachers={teachers} />;
      }
    } catch (err) {
      console.error("Render Error:", err);
      return (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-red-600">Terjadi kesalahan saat memuat halaman.</h2>
          <button onClick={() => setActiveTab('dashboard')} className="mt-4 text-blue-600 underline">Kembali ke Dashboard</button>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-40 print:hidden flex flex-col shadow-sm">
        <div className="p-8 pb-4">
          <div className="flex items-center space-x-3 mb-1">
            {logoSekolah ? (
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1 flex items-center justify-center shadow-sm overflow-hidden">
                <img src={logoSekolah} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="bg-blue-600 p-2 rounded-xl">
                <ClipboardCheck className="text-white" size={24} />
              </div>
            )}
            <h1 className="text-xl font-black text-slate-900 tracking-tight">SUPERVISI</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-12">{schoolName}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          
          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alur Kerja</span>
          </div>
          <NavItem id="pra" icon={Calendar} label="1. Pra-Observasi" />
          <NavItem id="observasi" icon={ClipboardCheck} label="2. Pelaksanaan" />
          <NavItem id="pasca" icon={Users} label="3. Pasca & Coaching" />
          
          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokumentasi</span>
          </div>
          <NavItem id="laporan" icon={BarChart} label="Laporan Akhir" />
          
          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem</span>
          </div>
          <NavItem id="pengaturan" icon={Settings} label="Pengaturan" />
        </nav>

        {/* Identity & Supervisor Config */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <UserCheck size={14} className="text-blue-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supervisor</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={principal.name}
                  onChange={(e) => handlePrincipalUpdate({ ...principal, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 p-2 rounded-lg text-[11px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 ml-1">NIP Supervisor</label>
                <input 
                  type="text" 
                  value={principal.nip}
                  onChange={(e) => handlePrincipalUpdate({ ...principal, nip: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 p-2 rounded-lg text-[11px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleResetData}
            className="w-full flex flex-col items-center justify-center space-y-1 py-4 rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95 mt-4"
          >
            <div className="flex items-center space-x-2">
              <Trash2 size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.1em]">Kosongkan Aplikasi</span>
            </div>
            <span className="text-[8px] font-bold text-red-400">Hapus seluruh data laporan</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-72 min-w-0 print:ml-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 print:hidden">
          <div className="flex items-center bg-slate-100 px-4 py-2.5 rounded-2xl w-full max-w-md border border-slate-200">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari data guru..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{principal.name}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{principal.role}</p>
            </div>
            <img 
              src={principal.photo} 
              className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm bg-slate-200" 
              alt="Profile" 
            />
          </div>
        </header>

        <main className="p-10 w-full max-w-6xl mx-auto flex-1">
          {renderContent()}
        </main>

        <footer className="py-6 border-t border-slate-100 flex items-center justify-center print:hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"> Copyright and Created by Lapado 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default App;