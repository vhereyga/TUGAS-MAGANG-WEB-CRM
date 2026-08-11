import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  BookMarked, 
  ShieldCheck, 
  GraduationCap, 
  User, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  Info,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Gagal masuk. Silakan periksa kembali data Anda.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setLoadingRole(role);
    setTimeout(() => {
      loginAsRole(role);
      setLoadingRole(null);
    }, 400);
  };

  const demoAccounts = [
    {
      role: 'admin' as UserRole,
      title: 'Administrator',
      subtitle: 'Akses Penuh System & CRM',
      email: 'admin@skillset.edu',
      password: 'admin123',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    },
    {
      role: 'teacher' as UserRole,
      title: 'Guru / Pengajar',
      subtitle: 'Kelola Kelas, Absensi & Materi',
      email: 'robert.fox@skillset.edu',
      password: 'teacher123',
      icon: GraduationCap,
      color: 'from-blue-600 to-cyan-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    {
      role: 'student' as UserRole,
      title: 'Siswa / Peserta',
      subtitle: 'Lihat Modul, Jadwal & Tagihan',
      email: 'jacob.jones@skillset.edu',
      password: 'student123',
      icon: User,
      color: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-6 sm:px-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <BookMarked className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white leading-tight">
              SkillSet <span className="text-indigo-600 dark:text-indigo-400">LMS</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Platform Management CRM & Pembelajaran</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
          title="Ganti Mode Tampilan"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Form & Login Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-6">
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Selamat Datang Kembali
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Masukkan alamat email dan password akun Anda untuk masuk ke sistem.
                </p>
              </div>

              {/* Admin-Only Account Creation Disclaimer Alert */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3.5 text-xs sm:text-sm">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-100">
                    Kebijakan Pendaftaran Akun:
                  </p>
                  <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-xs">
                    Pembuatan akun baru <strong>hanya dapat dilakukan oleh Admin</strong> lembaga. Jika Anda belum memiliki akun, silakan hubungi Administrator sekolah.
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: admin@skillset.edu"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Password Akun
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2"
                >
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Quick Demo Login Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Uji Coba Langsung
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  Pilih Akun Demo (Quick Login)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Klik salah satu peran di bawah ini untuk masuk secara otomatis tanpa mengetik kredensial.
                </p>
              </div>

              <div className="space-y-3">
                {demoAccounts.map((item) => {
                  const Icon = item.icon;
                  const isLoading = loadingRole === item.role;
                  return (
                    <div
                      key={item.role}
                      onClick={() => handleQuickLogin(item.role)}
                      className={`p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-all duration-200 group hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden ${
                        isLoading ? 'opacity-70 pointer-events-none' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                          {isLoading ? 'Masuk...' : 'Masuk →'}
                        </span>
                      </div>

                      {/* Credentials Tooltip Bar */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        <span className="truncate">Email: <strong className="text-slate-700 dark:text-slate-300">{item.email}</strong></span>
                        <span>Pass: <strong className="text-slate-700 dark:text-slate-300">{item.password}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sistem CRM terhubung dengan database simulasi sekolah</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        © 2026 SkillSet LMS & CRM Platform — Dikembangkan untuk Pengelolaan Pembelajaran Terpadu.
      </footer>
    </div>
  );
};
