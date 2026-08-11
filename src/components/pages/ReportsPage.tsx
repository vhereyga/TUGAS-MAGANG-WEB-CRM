import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicReport, FinancialReport } from '../../types';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Users 
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { profiles, invoices, assignmentSubmissions, courses, currentRole } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'academic' | 'financial'>('academic');

  const isStudent = currentRole === 'student';
  const effectiveTab = isStudent ? 'academic' : activeReportTab;

  const totalCourses = courses.length > 0 ? courses.length : 4;

  // Academic Report Data calculated from total task scores divided by TOTAL COURSES (4)
  // Unsubmitted / un-graded tasks count as 0: (Task1 + Task2 + 0 + 0) / 4
  const academicReports: AcademicReport[] = profiles
    .filter(p => p.role === 'student')
    .map((st, idx) => {
      const studentSubmissions = assignmentSubmissions.filter(
        s => (s.studentId === st.id || s.studentName.toLowerCase() === st.fullName.toLowerCase()) && s.score !== undefined
      );

      let finalScore = 0;
      if (studentSubmissions.length > 0) {
        const totalScore = studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
        finalScore = Math.round(totalScore / totalCourses);
      } else {
        finalScore = 0;
      }

      let letterGrade = 'F';
      if (finalScore >= 90) letterGrade = 'A';
      else if (finalScore >= 80) letterGrade = 'B+';
      else if (finalScore >= 70) letterGrade = 'B';
      else if (finalScore >= 60) letterGrade = 'C';
      else if (finalScore >= 50) letterGrade = 'D';
      else letterGrade = finalScore === 0 ? '-' : 'F';

      const attRate = st.attendanceRate ?? 0;

      return {
        studentId: st.studentId || `STU-000${idx + 10}`,
        studentName: st.fullName,
        courseTitle: st.classStatus || 'Frontend Web Development',
        grade: letterGrade,
        score: finalScore,
        attendancePercent: attRate,
        status: finalScore >= 60 ? 'Pass' : finalScore > 0 ? 'Fail' : 'Belum Evaluasi'
      };
    });

  // Financial Stats
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  // CSV Export helper
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (effectiveTab === 'academic') {
      csvContent += "ID Siswa,Nama Siswa,Kursus,Nilai,Skor,Kehadiran %,Status\n";
      academicReports.forEach(row => {
        csvContent += `${row.studentId},"${row.studentName}","${row.courseTitle}",${row.grade},${row.score},${row.attendancePercent}%,${row.status}\n`;
      });
    } else {
      csvContent += "Periode,Total Ditagihkan,Total Terbayar,Total Pending,Total Tunggakan\n";
      csvContent += `Agustus 2026,${totalInvoiced},${totalCollected},${totalPending},${totalOverdue}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_${effectiveTab}_skillset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports ({isStudent ? 'Laporan Akademik Siswa' : 'Laporan Akademik & Finansial'})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isStudent 
              ? 'Laporan transkrip nilai & rekapitulasi performa akademik siswa'
              : 'Pembuatan laporan nilai/transkrip & finansial yang dapat diekspor ke PDF/Excel (CSV)'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV (Excel)</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs (Hidden for Students so they only see Academic Report) */}
      {!isStudent && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
          <button
            onClick={() => setActiveReportTab('academic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              effectiveTab === 'academic'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Laporan Akademik & Transkrip Nilai</span>
          </button>

          <button
            onClick={() => setActiveReportTab('financial')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              effectiveTab === 'financial'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Laporan Finansial & Pembayaran</span>
          </button>
        </div>
      )}

      {/* Printable Report View */}
      {effectiveTab === 'academic' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Transkrip & Rekapitulasi Nilai Siswa
              </h2>
              <p className="text-xs text-slate-400">
                Periode Semester Ganjil 2026 • Rumus: Total Skor Tugas ÷ Total {totalCourses} Course (Tugas belum dikumpulkan dihitung 0)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
              Status: Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">ID Siswa</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Program / Kursus</th>
                  <th className="py-3 px-4">Kehadiran</th>
                  <th className="py-3 px-4">Skor Akhir</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Status Kualifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {academicReports.map((row) => (
                  <tr key={row.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-500">{row.studentId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.studentName}</td>
                    <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400">{row.courseTitle}</td>
                    <td className="py-3 px-4">{row.attendancePercent}%</td>
                    <td className="py-3 px-4 font-extrabold">{row.score} / 100</td>
                    <td className="py-3 px-4 font-black text-indigo-600">{row.grade}</td>
                    <td className="py-3 px-4 text-right">
                      {row.status === 'Pass' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                          LULUS (PASS)
                        </span>
                      ) : row.status === 'Fail' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-bold text-[10px]">
                          TIDAK LULUS (FAIL)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                          BELUM EVALUASI
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Total Ditagihkan</p>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                Rp {totalInvoiced.toLocaleString('id-ID')}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Total Terbayar (Lunas)</p>
              <h3 className="text-lg font-extrabold text-emerald-600 mt-1">
                Rp {totalCollected.toLocaleString('id-ID')}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Total Pending / Menunggu</p>
              <h3 className="text-lg font-extrabold text-amber-500 mt-1">
                Rp {totalPending.toLocaleString('id-ID')}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Total Menunggak (Overdue)</p>
              <h3 className="text-lg font-extrabold text-red-500 mt-1">
                Rp {totalOverdue.toLocaleString('id-ID')}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Ringkasan Transaksi Pembayaran
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Invoice</th>
                    <th className="py-3 px-4">Siswa</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-4 font-bold">{inv.invoiceCode}</td>
                      <td className="py-3 px-4">{inv.studentName}</td>
                      <td className="py-3 px-4 font-bold">Rp {inv.amount.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 uppercase font-bold text-indigo-600">{inv.status}</td>
                      <td className="py-3 px-4 text-right text-slate-400">{inv.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
