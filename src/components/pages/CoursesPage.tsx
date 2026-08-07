import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, SubMaterial, AssignmentSubmission } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Video, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  Upload, 
  ChevronRight, 
  ChevronDown, 
  X,
  Play,
  Layers,
  Calendar,
  Clock,
  CheckSquare,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  Edit2,
  Check,
  User,
  ExternalLink,
  Star
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { 
    courses, 
    addCourse, 
    updateCourseDeadline,
    assignmentSubmissions,
    addAssignmentSubmission,
    updateSubmissionStatus,
    gradeAssignmentSubmission,
    currentRole, 
    currentUser,
    searchQuery 
  } = useApp();

  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || null);
  const [activeCourseTab, setActiveCourseTab] = useState<'syllabus' | 'review'>('syllabus');
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-3': true
  });
  const [selectedSubMaterial, setSelectedSubMaterial] = useState<SubMaterial | null>(null);

  // Modals state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showUploadTaskModal, setShowUploadTaskModal] = useState(false);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmToGrade, setSelectedSubmToGrade] = useState<AssignmentSubmission | null>(null);
  const [inputScore, setInputScore] = useState<number>(90);

  // New Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Web Development');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDeadline, setNewCourseDeadline] = useState('2026-08-25');
  const [newCourseAssignmentTitle, setNewCourseAssignmentTitle] = useState('Tugas Praktikum Utama');

  // Submit Task Form State (Student)
  const [taskFileName, setTaskFileName] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [submitAlert, setSubmitAlert] = useState<string | null>(null);

  // Edit Deadline State (Teacher/Admin)
  const [editDeadlineDate, setEditDeadlineDate] = useState('');

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    addCourse({
      code: `CRS-${Math.floor(100 + Math.random() * 900)}`,
      title: newCourseTitle.trim(),
      teacherId: currentUser.id || 'tch-1',
      teacherName: currentUser.fullName || 'Dr. Robert Fox',
      teacherAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      description: newCourseDesc.trim() || 'Deskripsi materi silabus pembelajaran',
      category: newCourseCategory,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      enrolledStudentsCount: 12,
      assignmentsCount: 1,
      progressPercent: 0,
      assignmentTitle: newCourseAssignmentTitle || 'Tugas Praktikum Modul 1',
      assignmentDeadline: newCourseDeadline || '2026-08-25',
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Modul 1: Pengantar Dasar & Konsep Utama',
          description: 'Pengenalan silabus dan pengerjaan tugas dasar',
          subMaterials: [
            { id: `sub-${Date.now()}`, title: 'Video: Pendahuluan & Tutorial', type: 'video', durationMinutes: 15, completed: false },
            { id: `sub-${Date.now() + 1}`, title: 'Modul Teori & Dokumentasi PDF', type: 'text', completed: false }
          ]
        }
      ]
    });

    setShowAddCourseModal(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
  };

  const handleStudentSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFileName.trim() || !selectedCourse) return;

    addAssignmentSubmission({
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentAvatar: currentUser.avatarUrl,
      fileName: taskFileName.trim(),
      notes: taskNotes.trim() || 'File tugas telah diunggah tepat waktu.',
    });

    setSubmitAlert('Tugas berhasil diunggah! Menunggu pemeriksaan dan penilaian dari Guru/Admin.');
    setTimeout(() => {
      setShowUploadTaskModal(false);
      setSubmitAlert(null);
      setTaskFileName('');
      setTaskNotes('');
    }, 1500);
  };

  const handleSaveEditDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDeadlineDate || !selectedCourse) return;
    updateCourseDeadline(selectedCourse.id, editDeadlineDate);
    setShowEditDeadlineModal(false);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmToGrade) return;
    const finalScore = Math.min(100, Math.max(0, Number(inputScore) || 0));
    gradeAssignmentSubmission(selectedSubmToGrade.id, finalScore);
    setShowGradeModal(false);
    setSelectedSubmToGrade(null);
  };

  // Find submission for selected course by current logged in student
  const studentCourseSubmission = selectedCourse
    ? assignmentSubmissions.find(s => s.courseId === selectedCourse.id && (s.studentId === currentUser.id || s.studentName === currentUser.fullName))
    : null;

  // Filter submissions for current selected course (or all) for Teacher/Admin review
  const courseSubmissionsToReview = selectedCourse
    ? assignmentSubmissions.filter(s => s.courseId === selectedCourse.id)
    : assignmentSubmissions;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Courses & Assignment Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola Silabus, Deadline Tugas, Penilaian, dan Verifikasi Hasil Pengumpulan Siswa
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Section View Tabs */}
          <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveCourseTab('syllabus')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                activeCourseTab === 'syllabus'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Silabus & Materi</span>
            </button>
            <button
              onClick={() => setActiveCourseTab('review')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all relative ${
                activeCourseTab === 'review'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pemeriksaan & Penilaian ({assignmentSubmissions.filter(s => s.status === 'pending').length} Pending)</span>
            </button>
          </div>

          {(currentRole === 'admin' || currentRole === 'teacher') && (
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Kursus Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode View Switch: Syllabus vs Assignment Review */}
      {activeCourseTab === 'review' ? (
        /* Teacher / Admin Assignment Verification & Grading Panel */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Sistem Penilaian & Rata-rata Nilai Reports (A = 90+)
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Daftar Tugas Masuk Siswa ({courseSubmissionsToReview.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Beri nilai angka (0-100) dan ceklis (Accept) tugas siswa. Nilai seluruh tugas akan dirata-rata secara otomatis ke menu <strong>Reports</strong>.
              </p>
            </div>
          </div>

          {/* Submissions List Table */}
          {courseSubmissionsToReview.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-4 px-6">Siswa / Peserta</th>
                    <th className="py-4 px-6">Kursus & Judul Tugas</th>
                    <th className="py-4 px-6">File Lampiran</th>
                    <th className="py-4 px-6">Nilai Tugas</th>
                    <th className="py-4 px-6">Status Verifikasi</th>
                    <th className="py-4 px-6 text-right">Aksi Penilaian & Ceklis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {courseSubmissionsToReview.map((sub) => {
                    const isAccepted = sub.status === 'accepted';
                    const isRejected = sub.status === 'rejected';
                    const isTeacherOrAdmin = currentRole === 'admin' || currentRole === 'teacher';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Student Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={sub.studentAvatar}
                              alt={sub.studentName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{sub.studentName}</p>
                              <p className="text-[10px] text-slate-400">ID: {sub.studentId}</p>
                            </div>
                          </div>
                        </td>

                        {/* Course & Task Title */}
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{sub.courseTitle}</p>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">{sub.notes}</p>
                        </td>

                        {/* File Name */}
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{sub.fileName}</span>
                          </div>
                        </td>

                        {/* Nilai Tugas */}
                        <td className="py-4 px-6">
                          {sub.score !== undefined ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-200 dark:border-indigo-800 text-xs shadow-sm">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{sub.score} / 100 (Grade {sub.score >= 90 ? 'A' : sub.score >= 80 ? 'B' : sub.score >= 70 ? 'C' : 'D'})</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Belum Dinilai</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Accepted (+25% Attendance)</span>
                            </span>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800">
                              <X className="w-3.5 h-3.5 text-red-500" />
                              <span>Revisi / Ditolak</span>
                            </span>
                          )}

                          {!isAccepted && !isRejected && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Menunggu Penilaian</span>
                            </span>
                          )}
                        </td>

                        {/* Actions (Beri Nilai & Accept / Reject) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isTeacherOrAdmin && (
                              <button
                                onClick={() => {
                                  setSelectedSubmToGrade(sub);
                                  setInputScore(sub.score !== undefined ? sub.score : 90);
                                  setShowGradeModal(true);
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>{sub.score !== undefined ? 'Ubah Nilai' : '+ Beri Nilai'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                updateSubmissionStatus(sub.id, 'accepted');
                              }}
                              disabled={isAccepted}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                isAccepted
                                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-default'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-emerald-600/20'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>{isAccepted ? 'Sudah Di-Accept' : 'Ceklis Accept'}</span>
                            </button>

                            {!isAccepted && isTeacherOrAdmin && (
                              <button
                                onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                                title="Tolak / Minta Revisi"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Belum ada pengumpulan tugas dari siswa.</p>
            </div>
          )}
        </div>
      ) : (
        /* Standard Syllabus & Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Course Catalog List (Left) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white px-1">Daftar Kursus ({filteredCourses.length})</h2>
            
            <div className="space-y-3">
              {filteredCourses.map((crs) => {
                const isSelected = selectedCourse?.id === crs.id;
                return (
                  <div
                    key={crs.id}
                    onClick={() => setSelectedCourse(crs)}
                    className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={crs.thumbnail}
                        alt={crs.title}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {crs.category}
                          </span>
                          {/* Deadline Tag */}
                          {crs.assignmentDeadline && (
                            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{crs.assignmentDeadline}</span>
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
                          {crs.title}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {crs.modules.length} Modul • {crs.enrolledStudentsCount} Siswa
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Course Detail Viewer (Right) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedCourse ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
                
                {/* Course Detail Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                        {selectedCourse.code} • {selectedCourse.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                      {selectedCourse.description}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={selectedCourse.teacherAvatar}
                        alt={selectedCourse.teacherName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Pengajar: <strong>{selectedCourse.teacherName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Student Action / Upload Button */}
                  {currentRole === 'student' && (
                    <div className="space-y-2 text-right">
                      <button
                        onClick={() => setShowUploadTaskModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors shrink-0"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Kirim Tugas (Upload File)</span>
                      </button>

                      {studentCourseSubmission && (
                        <div className="text-[11px] font-bold">
                          {studentCourseSubmission.status === 'accepted' && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Tugas Diterima {studentCourseSubmission.score !== undefined ? `(Nilai: ${studentCourseSubmission.score})` : '(+25% Attendance)'}</span>
                            </span>
                          )}
                          {studentCourseSubmission.status === 'pending' && (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Menunggu Penilaian Guru</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Assignment & Deadline Card Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800/80 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                        Tugas & Deadline Pengumpulan
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedCourse.assignmentTitle || 'Tugas Praktikum Utama Silabus'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Batas Akhir (Deadline): <strong className="font-mono text-slate-900 dark:text-white">{selectedCourse.assignmentDeadline || '2026-08-25'}</strong></span>
                    </div>
                  </div>

                  {(currentRole === 'admin' || currentRole === 'teacher') && (
                    <button
                      onClick={() => {
                        setEditDeadlineDate(selectedCourse.assignmentDeadline || '2026-08-25');
                        setShowEditDeadlineModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Ubah Deadline</span>
                    </button>
                  )}
                </div>

                {/* Syllabus Hierarchy Tree */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Struktur Silabus Pembelajaran
                  </h3>

                  <div className="space-y-3">
                    {selectedCourse.modules.map((mod) => {
                      const isExpanded = expandedModules[mod.id] ?? true;
                      return (
                        <div 
                          key={mod.id}
                          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/40 dark:bg-slate-900/40"
                        >
                          {/* Module Header Toggle */}
                          <div
                            onClick={() => toggleModuleExpand(mod.id)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold text-xs flex items-center justify-center">
                                M
                              </span>
                              <div>
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                                  {mod.title}
                                </h4>
                                <p className="text-[11px] text-slate-400">{mod.description}</p>
                              </div>
                            </div>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          </div>

                          {/* Sub-Material List */}
                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                              {mod.subMaterials.map((sub) => (
                                <div
                                  key={sub.id}
                                  onClick={() => setSelectedSubMaterial(sub)}
                                  className={`p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                                    selectedSubMaterial?.id === sub.id
                                      ? 'bg-indigo-600 text-white font-bold'
                                      : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {sub.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                                    {sub.type === 'text' && <FileText className="w-4 h-4 text-blue-500" />}
                                    {sub.type === 'quiz' && <HelpCircle className="w-4 h-4 text-amber-500" />}
                                    <span>{sub.title}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {sub.durationMinutes && (
                                      <span className="text-[10px] opacity-75">{sub.durationMinutes} min</span>
                                    )}
                                    {sub.completed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Material Preview Drawer */}
                {selectedSubMaterial && (
                  <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Pratinjau Materi: {selectedSubMaterial.type}
                      </span>
                      <button onClick={() => setSelectedSubMaterial(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedSubMaterial.title}</h4>
                    
                    {selectedSubMaterial.type === 'video' && (
                      <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center text-white space-y-2 flex-col cursor-pointer hover:bg-slate-800 transition-colors">
                        <Play className="w-10 h-10 fill-current text-indigo-500" />
                        <span className="text-xs font-bold">Klik untuk Memutar Video Pembelajaran</span>
                      </div>
                    )}

                    {selectedSubMaterial.type === 'text' && (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <p>Berikut adalah ringkasan silabus dan materi yang harus dipelajari. Kerjakan tugas praktikum sebelum deadline agar persentase kehadiran Anda pada menu Attendance terhitung (+25% per course) dan nilai Anda masuk ke Laporan Akademik.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl">
                Pilih kursus dari daftar sebelah kiri
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: Create Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Buat Kursus Baru</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Judul Kursus / Materi *
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Masterclass React & Supabase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Kategori
                </label>
                <select
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Deadline Pengumpulan Tugas
                </label>
                <input
                  type="date"
                  value={newCourseDeadline}
                  onChange={(e) => setNewCourseDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Deskripsi Kursus
                </label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Ringkasan isi modul..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold gradient-btn">
                  Simpan Kursus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Upload Task */}
      {showUploadTaskModal && selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Pengumpulan Tugas Siswa</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{selectedCourse.title}</p>
              </div>
              <button onClick={() => setShowUploadTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitAlert && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{submitAlert}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmitTask} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-1">
                <p className="font-bold">Deadline: {selectedCourse.assignmentDeadline || '2026-08-25'}</p>
                <p className="text-[11px]">Setelah tugas di-accept dan diberi nilai oleh Guru/Admin, nilai Anda akan dihitung rata-rata ke menu Reports.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama File / Tautan Dokumentasi Tugas *
                </label>
                <input
                  type="text"
                  required
                  value={taskFileName}
                  onChange={(e) => setTaskFileName(e.target.value)}
                  placeholder="e.g. Task1_Frontend_CRM_React.pdf / https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Catatan untuk Pengajar (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Catatan pengerjaan atau tautan repositori..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold gradient-btn flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Kirimkan Tugas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Deadline (Teacher/Admin) */}
      {showEditDeadlineModal && selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Ubah Deadline Pengumpulan Tugas</h3>
              <button onClick={() => setShowEditDeadlineModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDeadline} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Tentukan Batas Akhir (Deadline) *
                </label>
                <input
                  type="date"
                  required
                  value={editDeadlineDate}
                  onChange={(e) => setEditDeadlineDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditDeadlineModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white font-bold gradient-btn">
                  Simpan Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Assignment (Admin/Teacher) */}
      {showGradeModal && selectedSubmToGrade && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Input Penilaian Tugas Siswa</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{selectedSubmToGrade.studentName} — {selectedSubmToGrade.courseTitle}</p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Nilai Angka Tugas (Skor 0 - 100) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={inputScore}
                    onChange={(e) => setInputScore(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-extrabold focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">/ 100</span>
                </div>
              </div>

              {/* Preset Score Quick Buttons */}
              <div>
                <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">Pilih Cepat Nilai Preset</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[100, 95, 90, 85, 80, 75].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputScore(preset)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        inputScore === preset
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Result Live Preview */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Kalkulasi Grade</span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Grade {inputScore >= 90 ? 'A' : inputScore >= 80 ? 'B+' : inputScore >= 70 ? 'B' : inputScore >= 60 ? 'C' : 'D'}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">Status Laporan</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    inputScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {inputScore >= 70 ? 'LULUS (PASS)' : 'REVISI (FAIL)'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                * Nilai ini akan dihitung rata-rata dengan seluruh tugas siswa dan disinkronkan secara otomatis ke kolom <strong>Nilai & Skor Akhir</strong> pada menu <strong>Reports</strong>.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowGradeModal(false)} className="px-4 py-2 text-slate-500 font-semibold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 text-white font-bold gradient-btn rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Simpan Nilai & Accept</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
