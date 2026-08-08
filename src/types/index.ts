export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  studentId?: string; // e.g. STU-000010
  teacherId?: string; // e.g. TCH-000001
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  classStatus?: string; // e.g. 'Class 12-A', 'Computer Science'
  attendanceRate?: number; // percentage
  statusBadge?: 'Regular' | 'Irregular';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface AttendantHistoryItem {
  id: string;
  name: string;
  avatar: string;
  duration: string; // e.g. '10 hr 30 min'
  rate: number; // percentage e.g. 60
  badgeColor: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  avatarUrl: string;
  customCode: string; // STU-000010
  responseRate: number; // percentage
  status: 'Regular' | 'Irregular';
  lastUpdated: string;
}

export interface SubMaterial {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  contentUrl?: string;
  durationMinutes?: number;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  subMaterials: SubMaterial[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  description: string;
  category: string;
  thumbnail: string;
  enrolledStudentsCount: number;
  modules: CourseModule[];
  assignmentsCount: number;
  progressPercent?: number; // student perspective
  assignmentTitle?: string;
  assignmentDeadline?: string; // e.g. '2026-08-25'
}

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  fileName: string;
  fileUrl?: string;
  notes?: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  score?: number; // e.g. 90
}

export interface LiveClassSession {
  id: string;
  title: string;
  courseTitle: string;
  teacherName: string;
  scheduledTime: string;
  durationMinutes: number;
  platform: 'Zoom' | 'Google Meet' | 'Custom WebRTC';
  link: string;
  isLiveNow: boolean;
  startsInMinutes?: number;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  title: string; // e.g. 'SPP Bulan Agustus 2026'
  category: 'SPP' | 'Kursus' | 'Pendaftaran' | 'Lainnya';
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'pending' | 'paid' | 'overdue';
  proofUrl?: string;
  createdAt: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  type: 'E-book' | 'Jurnal' | 'Video';
  author: string;
  category: string;
  fileSize: string;
  downloadUrl: string;
  coverImage: string;
  addedDate: string;
}

export interface AcademicReport {
  studentId: string;
  studentName: string;
  courseTitle: string;
  grade: string;
  score: number;
  attendancePercent: number;
  status: 'Pass' | 'Fail' | 'Belum Evaluasi';
}

export interface FinancialReport {
  period: string;
  totalInvoiced: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'live' | 'assignment' | 'payment' | 'system';
}
