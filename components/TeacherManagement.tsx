import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Camera, Save, X, ChevronRight, UserCircle2 } from 'lucide-react';
import { Teacher } from '../constants';

interface Props {
  teachers: Teacher[];
  onUpdate: (teachers: Teacher[]) => void;
}

const TeacherManagement: React.FC<Props> = ({ teachers, onUpdate }) => {
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (!editingTeacher?.name || !editingTeacher?.subject) {
      alert("Nama dan Mata Pelajaran wajib diisi");
      return;
    }

    let newList: Teacher[];
    if (isAdding) {
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: editingTeacher.name || '',
        nip: editingTeacher.nip || '',
        subject: editingTeacher.subject || '',
        phase: editingTeacher.phase || 'D',
        photoUrl: editingTeacher.photoUrl
      };
      newList = [...teachers, newTeacher];
    } else {
      newList = teachers.map(t => t.id === editingTeacher.id ? (editingTeacher as Teacher) : t);
    }

    onUpdate(newList);
    setEditingTeacher(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus data guru ini?")) {
      onUpdate(teachers.filter(t => t.id !== id));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        alert("Ukuran foto terlalu besar. Maksimal 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTeacher(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <UserCircle2 className="text-blue-600" />
          <span>Manajemen Data Guru</span>
        </h3>
        <button 
          onClick={() => {
            setEditingTeacher({ name: '', nip: '', subject: '', phase: 'D' });
            setIsAdding(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Tambah Guru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map(teacher => (
          <div key={teacher.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-blue-300 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-slate-400" size={24} />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{teacher.name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{teacher.subject} • Pase {teacher.phase}</p>
                <p className="text-[10px] text-slate-400">NIP: {teacher.nip || '-'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setEditingTeacher(teacher);
                  setIsAdding(false);
                }}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Save size={16} />
              </button>
              <button 
                onClick={() => handleDelete(teacher.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTeacher && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingTeacher(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 flex flex-col space-y-6 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{isAdding ? 'Tambah Guru Baru' : 'Edit Data Guru'}</h3>
              <button onClick={() => setEditingTeacher(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                  {editingTeacher.photoUrl ? (
                    <img src={editingTeacher.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-slate-300" size={40} />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </label>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-slate-700">Foto Profil Guru</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">Gunakan format PNG/JPG transparan jika memungkinkan. Maksimal 200KB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Baharuddin, S.Pd."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">NIP (Opsional)</label>
                <input 
                  type="text" 
                  value={editingTeacher.nip}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, nip: e.target.value }))}
                  placeholder="197xxxx..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Mata Pelajaran</label>
                  <input 
                    type="text" 
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Contoh: Matematika"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Fase/Kelas</label>
                  <select 
                    value={editingTeacher.phase}
                    onChange={(e) => setEditingTeacher(prev => ({ ...prev, phase: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="A">Fase A (Kelas 1-2)</option>
                    <option value="B">Fase B (Kelas 3-4)</option>
                    <option value="C">Fase C (Kelas 5-6)</option>
                    <option value="D">Fase D (Kelas 7-9)</option>
                    <option value="E">Fase E (Kelas 10)</option>
                    <option value="F">Fase F (Kelas 11-12)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setEditingTeacher(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-wider text-[10px] hover:bg-blue-700 transition-all shadow-lg"
              >
                Simpan Data Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
