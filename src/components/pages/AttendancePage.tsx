import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import { 
  Filter, 
  Plus, 
  MoreHorizontal, 
  MoreVertical, 
  Check, 
  X, 
  Search, 
  UserPlus, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { 
    attendanceRecords, 
    updateAttendanceStatus, 
    addAttendanceRecord, 
    attendantsHistory, 
    courses,
    searchQuery,
    currentRole
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Regular' | 'Irregular'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form state for creating student/attendance
  const [newStudentName, setNewStudentName] = useState('');
  const [newCustomCode, setNewCustomCode] = useState('');
  const [newResponseRate, setNewResponseRate] = useState(0);
  const [newStatus, setNewStatus] = useState<'Regular' | 'Irregular'>('Irregular');

  // Filter records by search query and status filter
  const filteredRecords = attendanceRecords.filter((rec) => {
    const matchesSearch = rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.customCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || rec.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const rateNum = Number(newResponseRate) || 0;
    const statusVal = rateNum >= 75 ? 'Regular' : 'Irregular';
    const code = newCustomCode.trim() || `STU-0000${attendanceRecords.length + 10}`;

    addAttendanceRecord({
      studentId: `usr-${Date.now()}`,
      studentName: newStudentName.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      customCode: code,
      responseRate: rateNum,
      status: statusVal
    });

    setNewStudentName('');
    setNewCustomCode('');
    setNewResponseRate(0);
    setNewStatus('Irregular');
    setShowCreateModal(false);
  };

  // Dynamic Students Analytics Calculations
  const totalStudentsCount = attendanceRecords.length;
  const overallRate = totalStudentsCount > 0
    ? Number((attendanceRecords.reduce((sum, r) => sum + (Number(r.responseRate) || 0), 0) / totalStudentsCount).toFixed(2))
    : 0;

  const regularCount = attendanceRecords.filter(r => r.status === 'Regular').length;
  const irregularCount = attendanceRecords.filter(r => r.status === 'Irregular').length;
  const currentDayBadge = String(new Date().getDate()).padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Page Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Students</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar kehadiran & analitik performa siswa kelas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter: {selectedStatusFilter}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-30">
                {(['All', 'Regular', 'Irregular'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStatusFilter(st);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedStatusFilter === st
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {st === 'All' ? 'Semua Status' : st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Create Now Button matching screenshot (Purple Gradient) */}
          {(currentRole === 'admin' || currentRole === 'teacher') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn-purple shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Table + Right Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Attendance Table matching screenshot */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-5 w-10 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                    />
                  </th>
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Students ID</th>
                  <th className="py-4 px-5">Attendance</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredRecords.map((item) => {
                  const isIrregular = item.status === 'Irregular';
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-5 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                        />
                      </td>

                      {/* Name + Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatarUrl}
                            alt={item.studentName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                          />
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.studentName}
                          </span>
                        </div>
                      </td>

                      {/* Students ID */}
                      <td className="py-4 px-5 font-semibold text-slate-500 dark:text-slate-400">
                        {item.customCode}
                      </td>

                      {/* Attendance Progress Bar */}
                      <td className="py-4 px-5 w-44">
                        <div className="space-y-1">
                          {(() => {
                            const totalC = courses.length > 0 ? courses.length : 4;
                            const attendedC = Math.round((item.responseRate / 100) * totalC);
                            return (
                              <div className="flex items-center justify-between text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                                <span>{item.responseRate}% Kehadiran</span>
                                <span className="text-slate-400 font-normal">({attendedC}/{totalC} Course)</span>
                              </div>
                            );
                          })()}
                          <div className="w-full h-1.5 rounded-full bg-indigo-100 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${item.responseRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => {
                            if (currentRole === 'admin' || currentRole === 'teacher') {
                              updateAttendanceStatus(item.id, isIrregular ? 'Regular' : 'Irregular');
                            }
                          }}
                          title="Klik untuk mengubah status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isIrregular
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border border-red-200/50 dark:border-red-900/50'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50'
                          }`}
                        >
                          {!isIrregular && <Check className="w-3 h-3 stroke-[3]" />}
                          {isIrregular && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          <span>{item.status}</span>
                        </button>
                      </td>

                      {/* Action Menu */}
                      <td className="py-4 px-5 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Action Menu Dropdown */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-5 mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-30 text-left">
                            <button
                              onClick={() => {
                                updateAttendanceStatus(item.id, 'Regular');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Set Regular</span>
                            </button>
                            <button
                              onClick={() => {
                                updateAttendanceStatus(item.id, 'Irregular');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                            >
                              <X className="w-3.5 h-3.5 text-red-500" />
                              <span>Set Irregular</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/30 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Menampilkan {filteredRecords.length} siswa</span>
            <span>Total terdaftar: {attendanceRecords.length} Siswa</span>
          </div>
        </div>

        {/* Right Column: Attendants History + Students Analytics Cards matching screenshot */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Attendants History matching screenshot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                Attendants History
              </h2>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {attendantsHistory.length > 0 ? (
                attendantsHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {item.duration}
                        </p>
                      </div>
                    </div>

                    {/* Circular Ring Progress Indicator matching screenshot */}
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-slate-100 dark:text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          stroke={item.badgeColor || '#3b82f6'}
                          strokeWidth="3"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={2 * Math.PI * 15 * (1 - item.rate / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  Belum ada riwayat absensi.
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Students Analytics Donut Chart matching screenshot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                Students Analytics
              </h2>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Donut Chart Visual Container matching screenshot */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Donut Ring */}
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  {/* Dynamic Active Gradient Arc */}
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="url(#donutGradient)"
                    strokeWidth="16"
                    strokeDasharray={2 * Math.PI * 72}
                    strokeDashoffset={2 * Math.PI * 72 * (1 - Math.min(100, Math.max(0, overallRate)) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Text matching screenshot */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Overall
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                    {overallRate.toFixed(2)}%
                  </span>
                </div>

                {/* Bottom Right Day Badge matching screenshot */}
                <div className="absolute bottom-1 right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900 flex flex-col items-center leading-tight">
                  <span className="text-[8px] opacity-80 uppercase">Day</span>
                  <span>{currentDayBadge}</span>
                </div>
              </div>
            </div>

            {/* Breakdown metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60">
                <p className="text-[10px] text-slate-400 font-medium">Siswa Regular</p>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 text-xs">
                  {regularCount} Siswa ({totalStudentsCount > 0 ? Math.round((regularCount / totalStudentsCount) * 100) : 0}%)
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60">
                <p className="text-[10px] text-slate-400 font-medium">Siswa Irregular</p>
                <p className="font-extrabold text-red-500 dark:text-red-400 mt-0.5 text-xs">
                  {irregularCount} Siswa ({totalStudentsCount > 0 ? Math.round((irregularCount / totalStudentsCount) * 100) : 0}%)
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Create New Student / Attendance Entry */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Tambah Siswa & Kehadiran Baru</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Contoh: Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kode / ID Siswa</label>
                <input
                  type="text"
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Persentase Kehadiran (% Response): {newResponseRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newResponseRate}
                  onChange={(e) => setNewResponseRate(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Kehadiran</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'Regular' | 'Irregular')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Regular">Regular (Baik)</option>
                  <option value="Irregular">Irregular (Buruk)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold gradient-btn-purple shadow-md"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
