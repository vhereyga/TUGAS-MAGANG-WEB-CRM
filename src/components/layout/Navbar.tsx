import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  Radio, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck, 
  GraduationCap, 
  User,
  Users,
  X,
  LogOut,
  UserPlus,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  BadgeCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    theme, 
    toggleTheme, 
    searchQuery, 
    setSearchQuery, 
    currentUser, 
    notifications, 
    markNotificationRead,
    setActiveTab,
    logout,
    addProfile,
    profiles
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal State for Admin Create Account
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newPhone, setNewPhone] = useState('');
  const [newClassStatus, setNewClassStatus] = useState('');
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert(null);
    setSuccessAlert(null);

    if (!newFullName.trim()) {
      setErrorAlert('Silakan masukkan nama lengkap pengguna.');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorAlert('Silakan masukkan alamat email yang valid.');
      return;
    }

    const defaultPass = newRole === 'admin' ? 'admin123' : newRole === 'teacher' ? 'teacher123' : 'student123';
    const finalPassword = newPassword.trim() || defaultPass;
    const defaultStatus = newRole === 'student' ? 'Frontend Web Development' : newRole === 'teacher' ? 'Senior Instructor' : 'Administrator Utama';

    const roleCount = profiles.filter(p => p.role === newRole).length + 1;
    const createdId = newRole === 'student' 
      ? `STU-0000${roleCount + 10}` 
      : newRole === 'teacher' 
      ? `TCH-0000${roleCount + 10}` 
      : `ADM-0000${roleCount + 10}`;

    addProfile({
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: finalPassword,
      role: newRole,
      phone: newPhone.trim() || '-',
      classStatus: newClassStatus.trim() || defaultStatus,
      status: 'active',
      avatarUrl: newRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : newRole === 'teacher'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      studentId: newRole === 'student' ? createdId : undefined,
      teacherId: newRole === 'teacher' ? createdId : undefined,
      attendanceRate: newRole === 'student' ? 0 : undefined,
      statusBadge: newRole === 'student' ? 'Irregular' : undefined
    });

    setSuccessAlert(`🎉 Akun ${newRole.toUpperCase()} atas nama "${newFullName}" berhasil dibuat! ID: ${createdId}`);

    setTimeout(() => {
      setShowCreateAccountModal(false);
      setSuccessAlert(null);
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setNewClassStatus('');
    }, 1600);
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
      {/* Left: Search Bar */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Indicator Pill */}
        <button 
          onClick={() => setActiveTab('live')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors animate-pulse-live cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <Radio className="w-3.5 h-3.5" />
          <span>Live</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Modal Popup */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifikasi ({unreadCount} Baru)</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Tutup
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors text-xs space-y-1 ${
                      n.isRead
                        ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                        : 'bg-indigo-50/70 dark:bg-indigo-950/50 text-slate-900 dark:text-slate-100 font-medium border-l-4 border-indigo-600'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.fullName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">
                  {currentRole}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </button>

          {/* User Profile Dropdown Menu */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              {/* User Details Header */}
              <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  Peran: {currentRole}
                </div>
              </div>

              {/* Admin-only Account Actions */}
              {currentRole === 'admin' && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Menu Kelola Pengguna:
                  </p>

                  {/* 1. Buat Akun Baru */}
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setShowCreateAccountModal(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all border border-indigo-200/70 dark:border-indigo-800/70 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserPlus className="w-4 h-4" />
                      <span>Buat Akun Baru</span>
                    </div>
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-extrabold">
                      + Add
                    </span>
                  </button>

                  {/* 2. Kelola Akun (Navigasi ke Manajemen User) */}
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setActiveTab('students');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/70 dark:border-slate-700/70"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Kelola Akun (Users)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}

              {/* Logout Option */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Ultra-Modern Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative space-y-6 my-auto max-h-[88vh] overflow-y-auto">
            
            {/* Background Blob Deco */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <UserPlus className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                      Buat Akun Pengguna
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
                      Admin Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Daftarkan akun Siswa, Guru, atau Admin baru ke sistem CRM
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateAccountModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alerts */}
            {errorAlert && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorAlert}</span>
              </div>
            )}

            {successAlert && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-150">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>{successAlert}</span>
              </div>
            )}

            {/* Account Creation Form */}
            <form onSubmit={handleCreateAccountSubmit} className="space-y-5 text-xs relative z-10">
              
              {/* Role Selector Cards */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  1. Pilih Peran Akun (Role):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'student' as UserRole, title: 'Siswa', desc: 'Peserta Kursus', icon: User, badgeColor: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' },
                    { id: 'teacher' as UserRole, title: 'Guru', desc: 'Pengajar Kelas', icon: GraduationCap, badgeColor: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' },
                    { id: 'admin' as UserRole, title: 'Admin', desc: 'Akses Penuh', icon: ShieldCheck, badgeColor: 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' }
                  ].map((r) => {
                    const RoleIcon = r.icon;
                    const isSelected = newRole === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setNewRole(r.id)}
                        className={`p-3 rounded-2xl font-bold flex flex-col items-center text-center gap-1.5 border transition-all ${
                          isSelected
                            ? r.badgeColor + ' ring-2 ring-indigo-500/40 shadow-md scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <RoleIcon className="w-5 h-5" />
                        <div>
                          <p className="text-xs font-bold leading-tight">{r.title}</p>
                          <p className="text-[10px] opacity-75 font-normal">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap Akun *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="contoh: Muhammad Rizky"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Alamat Email Login *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="contoh: rizky@skillset.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Acak Pass</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={newRole === 'admin' ? 'admin123' : newRole === 'teacher' ? 'teacher123' : 'student123'}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Class Status / Jabatan */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Kelas / Jabatan
                  </label>
                  <input
                    type="text"
                    value={newClassStatus}
                    onChange={(e) => setNewClassStatus(e.target.value)}
                    placeholder={
                      newRole === 'student'
                        ? 'Frontend Web Development'
                        : newRole === 'teacher'
                        ? 'Senior Instructor - AI & Web'
                        : 'Administrator Utama System'
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(false)}
                  className="px-5 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-white font-bold gradient-btn shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Akun Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};


