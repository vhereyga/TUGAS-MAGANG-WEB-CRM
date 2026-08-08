import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { 
  Users, 
  UserCheck, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Lock,
  ShieldAlert, 
  X, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const PasswordCell: React.FC<{ password?: string; role: UserRole }> = ({ password, role }) => {
  const [showPass, setShowPass] = useState(false);
  const displayPass = password || (role === 'admin' ? 'admin123' : role === 'teacher' ? 'teacher123' : 'student123');

  return (
    <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 w-fit text-[11px]">
      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
      <span>{showPass ? displayPass : '••••••••'}</span>
      <button
        onClick={() => setShowPass(!showPass)}
        className="ml-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title={showPass ? 'Sembunyikan Password' : 'Tampilkan Password'}
      >
        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export const StudentsTeachersPage: React.FC = () => {
  const { profiles, addProfile, updateProfile, deleteProfile, currentRole, searchQuery } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'student' | 'teacher'>('student');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [classStatus, setClassStatus] = useState('');

  const filteredUsers = profiles.filter((p) => {
    const matchesRole = p.role === activeSubTab;
    const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.studentId && p.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone || '');
    setClassStatus(user.classStatus || '');
    setShowAddModal(true);
  };

  const handleSubmitUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    if (editingUser) {
      updateProfile(editingUser.id, {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '-',
        classStatus: classStatus.trim()
      });
    } else {
      const roleCount = profiles.filter(p => p.role === activeSubTab).length + 1;
      const createdId = activeSubTab === 'student' 
        ? `STU-0000${roleCount + 10}` 
        : `TCH-0000${roleCount + 10}`;

      addProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: activeSubTab === 'student' ? 'student123' : 'teacher123',
        role: activeSubTab,
        phone: phone.trim() || '-',
        classStatus: classStatus.trim() || (activeSubTab === 'student' ? 'Frontend Web Development' : 'Senior Instructor'),
        status: 'active',
        avatarUrl: activeSubTab === 'teacher'
          ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        studentId: activeSubTab === 'student' ? createdId : undefined,
        teacherId: activeSubTab === 'teacher' ? createdId : undefined,
        attendanceRate: activeSubTab === 'student' ? 0 : undefined,
        statusBadge: activeSubTab === 'student' ? 'Irregular' : undefined
      });
    }

    setFullName('');
    setEmail('');
    setPhone('');
    setClassStatus('');
    setEditingUser(null);
    setShowAddModal(false);
  };

  const handleToggleSuspend = (user: UserProfile) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    updateProfile(user.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manajemen Pengguna ({activeSubTab === 'student' ? 'Siswa' : 'Guru / Pengajar'})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar lengkap pengguna sistem, kata sandi (password), dan status akun
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'student'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Siswa</span>
            </button>
            <button
              onClick={() => setActiveSubTab('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'teacher'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Guru / Pengajar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">ID Pengguna</th>
                <th className="py-4 px-6">Kontak Email</th>
                {currentRole === 'admin' && <th className="py-4 px-6">Password Akun</th>}
                <th className="py-4 px-6">Kelas / Jabatan</th>
                <th className="py-4 px-6">Status Akun</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* User info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {user.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400">Bergabung: {user.createdAt}</span>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="py-4 px-6 font-semibold text-slate-500">
                    {user.studentId || user.teacherId || 'ADM-001'}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                    {user.email}
                  </td>

                  {/* Password (Admin Only) */}
                  {currentRole === 'admin' && (
                    <td className="py-4 px-6">
                      <PasswordCell password={user.password} role={user.role} />
                    </td>
                  )}

                  {/* Class Status */}
                  <td className="py-4 px-6 font-medium text-indigo-600 dark:text-indigo-400">
                    {user.classStatus || '-'}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      user.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserDetail(user)}
                        title="Lihat Detail Profil"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {currentRole === 'admin' && (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            title="Edit Data User"
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(user)}
                            title={user.status === 'active' ? 'Suspend Akun' : 'Aktifkan Akun'}
                            className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus ${user.fullName}?`)) {
                                deleteProfile(user.id);
                              }
                            }}
                            title="Hapus User"
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingUser ? 'Edit Data Pengguna' : `Tambah ${activeSubTab === 'student' ? 'Siswa' : 'Guru'} Baru`}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUserForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Sarah Connor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@skillset.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Kelas / Program</label>
                <input
                  type="text"
                  value={classStatus}
                  onChange={(e) => setClassStatus(e.target.value)}
                  placeholder="Contoh: Frontend Web Development"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold gradient-btn">
                  {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Drawer / Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Profil Detail Pengguna</h3>
              <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <img
                src={selectedUserDetail.avatarUrl}
                alt={selectedUserDetail.fullName}
                className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-indigo-500/20 shadow-md"
              />
              <div>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{selectedUserDetail.fullName}</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{selectedUserDetail.role}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ID Pengguna:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedUserDetail.studentId || selectedUserDetail.teacherId || 'ADM-001'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUserDetail.email}</span>
              </div>
              {currentRole === 'admin' && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Password:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedUserDetail.password || (selectedUserDetail.role === 'admin' ? 'admin123' : selectedUserDetail.role === 'teacher' ? 'teacher123' : 'student123')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telepon:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUserDetail.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Program / Kelas:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedUserDetail.classStatus || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Terdaftar:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUserDetail.createdAt}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
