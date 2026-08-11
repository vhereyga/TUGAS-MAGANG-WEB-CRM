import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Play
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentRole, profiles, courses, liveClasses, invoices, attendanceRecords, setActiveTab } = useApp();

  const totalStudents = profiles.filter(p => p.role === 'student').length;
  const totalTeachers = profiles.filter(p => p.role === 'teacher').length;
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const overallAttendanceRate = attendanceRecords.length > 0
    ? Number((attendanceRecords.reduce((sum, r) => sum + (Number(r.responseRate) || 0), 0) / attendanceRecords.length).toFixed(1))
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-5 sm:p-8 overflow-hidden shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hak Akses Saat Ini: <strong className="uppercase">{currentRole}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di SkillSet Learning Management System
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            {currentRole === 'admin' && 'Kelola seluruh aktivitas akademik, guru, siswa, transaksi pembayaran, dan laporan analitik di satu dashboard terpadu.'}
            {currentRole === 'teacher' && 'Pantau jadwal mengajar hari ini, kelola silabus materi kelas, dan periksa tugas yang dikirimkan oleh siswa.'}
            {currentRole === 'student' && 'Akses kelas online Anda, selesaikan tugas tepat waktu, dan periksa statistik progres belajar Anda.'}
          </p>
          
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveTab(currentRole === 'student' ? 'courses' : 'attendance')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <span>{currentRole === 'student' ? 'Mulai Belajar' : 'Buka Manajemen Kehadiran'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 1. ADMIN DASHBOARD VIEW (SRS 3.1) */}
      {currentRole === 'admin' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Siswa Aktif</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalStudents} Siswa</h3>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +12.5% bulan ini
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Pengajar (Guru)</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalTeachers} Guru</h3>
                <span className="text-[10px] text-slate-400 font-medium">Instruktur Bersertifikat</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Pendapatan Masuk</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> Terverifikasi SPP
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Tingkat Kehadiran Global</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{overallAttendanceRate.toFixed(1)}%</h3>
                <span className={`text-[10px] font-semibold ${overallAttendanceRate >= 75 ? 'text-emerald-500' : overallAttendanceRate >= 60 ? 'text-blue-500' : 'text-amber-500'}`}>
                  {overallAttendanceRate >= 75 ? 'Sangat Baik' : overallAttendanceRate >= 60 ? 'Cukup Baik' : 'Perlu Perhatian'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Ringkasan Tagihan Terbaru</h2>
              <div className="space-y-3 text-xs">
                {invoices.slice(0, 4).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{inv.studentName}</p>
                      <p className="text-slate-400 text-[11px]">{inv.title} • {inv.invoiceCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 dark:text-white">Rp {inv.amount.toLocaleString('id-ID')}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Live Session Terjadwal</h2>
              <div className="space-y-3 text-xs">
                {liveClasses.map((lc) => (
                  <div key={lc.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{lc.courseTitle}</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {lc.platform}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">{lc.title}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {lc.scheduledTime} ({lc.durationMinutes} menit)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEACHER DASHBOARD VIEW (SRS 3.1) */}
      {currentRole === 'teacher' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Jadwal Mengajar Hari Ini
              </h2>
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">15:00 WIB - 16:30 WIB</span>
                  <span className="px-2.5 py-1 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Live Session
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Frontend Web Development dengan React & TypeScript
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modul 2: Custom Hooks & Data Fetching dengan Supabase
                </p>
                <button 
                  onClick={() => setActiveTab('live')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-btn shadow-md"
                >
                  Mulai Kelas Live Sekarang
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Tugas Siswa Perlu Dinilai
              </h2>
              <div className="space-y-3 text-xs">
                {profiles.filter(p => p.role === 'student').slice(0, 3).map((st) => (
                  <div key={st.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <img src={st.avatarUrl} alt={st.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{st.fullName}</p>
                        <p className="text-slate-400 text-[10px]">Tugas: CRM Attendance Component • Submitted</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Memuka penilai tugas untuk ${st.fullName}`)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 text-[11px]"
                    >
                      Beri Nilai
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Persentase Kehadiran Kelas</h2>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{overallAttendanceRate.toFixed(1)}%</span>
                <p className="text-xs text-slate-400">Rata-rata partisipasi siswa di kelas Anda</p>
                <button 
                  onClick={() => setActiveTab('attendance')}
                  className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  Buka Detail Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STUDENT DASHBOARD VIEW (SRS 3.1) */}
      {currentRole === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Live Class */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500 fill-current" />
                Kelas Yang Akan Datang (Upcoming Live Class)
              </h2>
              {liveClasses.slice(0, 1).map((lc) => (
                <div key={lc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">LIVE NOW</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{lc.title}</h3>
                    <p className="text-xs text-slate-400">{lc.teacherName} • {lc.scheduledTime}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('live')}
                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs shadow-md hover:bg-red-600 transition-colors shrink-0"
                  >
                    Gabung Sekarang
                  </button>
                </div>
              ))}
            </div>

            {/* Course Learning Progress */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Progres Belajar Kursus Anda
              </h2>
              <div className="space-y-4">
                {courses.map((crs) => (
                  <div key={crs.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">{crs.title}</span>
                      <span className="text-indigo-600">{crs.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${crs.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Assignment Deadlines */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Pengingat Tugas (Deadline)
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Build CRM Attendance Component</p>
                  <p className="text-amber-700 dark:text-amber-400 text-[11px]">Deadline: Besok, 23:59 WIB</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Wireframe Dashboard App</p>
                  <p className="text-slate-400 text-[11px]">Deadline: 12 Agustus 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
