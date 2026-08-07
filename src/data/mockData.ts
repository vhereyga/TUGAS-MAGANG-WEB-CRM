import { UserProfile, AttendanceRecord, AttendantHistoryItem, Course, LiveClassSession, Invoice, LibraryItem, AcademicReport, FinancialReport, NotificationItem, AssignmentSubmission } from '../types';

export const initialProfiles: UserProfile[] = [
  {
    id: 'usr-1',
    studentId: 'STU-000010',
    fullName: 'Jacob Jones',
    email: 'jacob.jones@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+62 812-3456-7890',
    classStatus: 'Frontend Web Development',
    attendanceRate: 40,
    statusBadge: 'Irregular',
    status: 'active',
    createdAt: '2026-01-15'
  },
  {
    id: 'usr-2',
    studentId: 'STU-000012',
    fullName: 'Jane Cooper',
    email: 'jane.cooper@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '+62 812-9876-5432',
    classStatus: 'UI/UX Design Masterclass',
    attendanceRate: 30,
    statusBadge: 'Irregular',
    status: 'active',
    createdAt: '2026-01-18'
  },
  {
    id: 'usr-3',
    studentId: 'STU-000014',
    fullName: 'Cody Fisher',
    email: 'cody.fisher@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+62 813-1122-3344',
    classStatus: 'Fullstack React & Node.js',
    attendanceRate: 80,
    statusBadge: 'Regular',
    status: 'active',
    createdAt: '2026-01-20'
  },
  {
    id: 'usr-4',
    studentId: 'STU-000016',
    fullName: 'Jenny Wilson',
    email: 'jenny.wilson@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    phone: '+62 813-5566-7788',
    classStatus: 'Data Science & AI Foundations',
    attendanceRate: 30,
    statusBadge: 'Irregular',
    status: 'active',
    createdAt: '2026-01-22'
  },
  {
    id: 'usr-5',
    studentId: 'STU-000024',
    fullName: 'Arlene McCoy',
    email: 'arlene.mccoy@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    phone: '+62 812-7788-9900',
    classStatus: 'Frontend Web Development',
    attendanceRate: 30,
    statusBadge: 'Regular',
    status: 'active',
    createdAt: '2026-01-25'
  },
  {
    id: 'usr-6',
    studentId: 'STU-000018',
    fullName: 'Jerome Bell',
    email: 'jerome.bell@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+62 815-3344-5566',
    classStatus: 'UI/UX Design Masterclass',
    attendanceRate: 60,
    statusBadge: 'Irregular',
    status: 'active',
    createdAt: '2026-01-28'
  },
  {
    id: 'usr-7',
    studentId: 'STU-000020',
    fullName: 'Albert Flores',
    email: 'albert.flores@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    phone: '+62 817-2233-4455',
    classStatus: 'Fullstack React & Node.js',
    attendanceRate: 40,
    statusBadge: 'Regular',
    status: 'active',
    createdAt: '2026-02-01'
  },
  {
    id: 'usr-8',
    studentId: 'STU-000022',
    fullName: 'Floyd Miles',
    email: 'floyd.miles@skillset.edu',
    password: 'student123',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    phone: '+62 818-6677-8899',
    classStatus: 'Mobile Development with Flutter',
    attendanceRate: 80,
    statusBadge: 'Irregular',
    status: 'active',
    createdAt: '2026-02-03'
  },
  {
    id: 'tch-1',
    teacherId: 'TCH-000001',
    fullName: 'Dr. Robert Fox',
    email: 'robert.fox@skillset.edu',
    password: 'teacher123',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    phone: '+62 811-1234-5678',
    classStatus: 'Senior Instructor - Web & AI',
    status: 'active',
    createdAt: '2025-10-10'
  },
  {
    id: 'adm-1',
    fullName: 'Administrator SkillSet',
    email: 'admin@skillset.edu',
    password: 'admin123',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+62 811-0000-9999',
    status: 'active',
    createdAt: '2025-01-01'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'usr-1',
    studentName: 'Jacob Jones',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000010',
    responseRate: 40,
    status: 'Irregular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-2',
    studentId: 'usr-2',
    studentName: 'Jane Cooper',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000012',
    responseRate: 30,
    status: 'Irregular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-3',
    studentId: 'usr-3',
    studentName: 'Cody Fisher',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000014',
    responseRate: 80,
    status: 'Regular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-4',
    studentId: 'usr-4',
    studentName: 'Jenny Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000016',
    responseRate: 30,
    status: 'Irregular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-5',
    studentId: 'usr-5',
    studentName: 'Arlene McCoy',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000024',
    responseRate: 30,
    status: 'Regular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-6',
    studentId: 'usr-6',
    studentName: 'Jerome Bell',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000018',
    responseRate: 60,
    status: 'Irregular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-7',
    studentId: 'usr-7',
    studentName: 'Albert Flores',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000020',
    responseRate: 40,
    status: 'Regular',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'att-8',
    studentId: 'usr-8',
    studentName: 'Floyd Miles',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    customCode: 'STU-000022',
    responseRate: 80,
    status: 'Irregular',
    lastUpdated: '2026-08-05'
  }
];

export const initialAttendantsHistory: AttendantHistoryItem[] = [
  {
    id: 'hist-1',
    name: 'Devon Lane',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    duration: '10 hr 30 min',
    rate: 60,
    badgeColor: '#3b82f6'
  },
  {
    id: 'hist-2',
    name: 'Eleanor Pena',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    duration: '11 hr 15 min',
    rate: 75,
    badgeColor: '#22c55e'
  },
  {
    id: 'hist-3',
    name: 'Guy Hawkins',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    duration: '12 hr 30 min',
    rate: 60,
    badgeColor: '#f59e0b'
  },
  {
    id: 'hist-4',
    name: 'Jenny Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    duration: '14 hr 15 min',
    rate: 90,
    badgeColor: '#3b82f6'
  },
  {
    id: 'hist-5',
    name: 'Jenny Wilson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    duration: '16 hr 30 min',
    rate: 60,
    badgeColor: '#ef4444'
  }
];

export const initialAssignmentSubmissions: AssignmentSubmission[] = [
  {
    id: 'subm-1',
    courseId: 'crs-1',
    courseTitle: 'Frontend Web Development dengan React & TypeScript',
    studentId: 'usr-1',
    studentName: 'Jacob Jones',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    fileName: 'JacobJones_Task1_CRM.pdf',
    notes: 'Sudah menyelesaikan semua modul dan integrasi state.',
    submittedAt: '2026-08-04 14:30',
    status: 'accepted',
    score: 90
  },
  {
    id: 'subm-2',
    courseId: 'crs-2',
    courseTitle: 'UI/UX Design Masterclass & Design Systems',
    studentId: 'usr-1',
    studentName: 'Jacob Jones',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    fileName: 'JacobJones_Figma_Prototype.fig',
    notes: 'Tautan Figma prototype dan sistem warna.',
    submittedAt: '2026-08-06 09:15',
    status: 'pending'
  },
  {
    id: 'subm-3',
    courseId: 'crs-1',
    courseTitle: 'Frontend Web Development dengan React & TypeScript',
    studentId: 'usr-2',
    studentName: 'Jane Cooper',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    fileName: 'JaneCooper_React_Task.zip',
    notes: 'Tugas frontend modul 1.',
    submittedAt: '2026-08-05 16:00',
    status: 'pending'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'crs-1',
    code: 'CS-101',
    title: 'Frontend Web Development dengan React & TypeScript',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Fox',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    description: 'Pelajari dasar pembuatan web modern dengan React.js, TypeScript, Tailwind CSS, dan pengintegrasian REST API.',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    enrolledStudentsCount: 42,
    assignmentsCount: 5,
    progressPercent: 65,
    assignmentTitle: 'Tugas 1: Implementasi Dashboard & Attendance CRM',
    assignmentDeadline: '2026-08-15',
    modules: [
      {
        id: 'mod-1',
        title: 'Modul 1: Pengenalan React & Component-Driven Design',
        description: 'Pemahaman JSX, Virtual DOM, dan state management dasar.',
        subMaterials: [
          { id: 'sub-1', title: 'Video: Apa itu React & Mengapa TypeScript?', type: 'video', durationMinutes: 15, completed: true },
          { id: 'sub-2', title: 'Panduan Ringkas State & Props', type: 'text', completed: true },
          { id: 'sub-3', title: 'Kuis Singkat Modul 1', type: 'quiz', completed: true }
        ]
      },
      {
        id: 'mod-2',
        title: 'Modul 2: Custom Hooks & Data Fetching',
        description: 'Mengolah asynchronous state dan koneksi database.',
        subMaterials: [
          { id: 'sub-4', title: 'Video: Integration with Supabase Client', type: 'video', durationMinutes: 25, completed: false },
          { id: 'sub-5', title: 'Tugas: Build CRM Attendance Page', type: 'text', completed: false }
        ]
      }
    ]
  },
  {
    id: 'crs-2',
    code: 'DES-202',
    title: 'UI/UX Design Masterclass & Design Systems',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Fox',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    description: 'Menguasai pembuatan Wireframe, Prototyping Figma, dan Design Systems standar industri.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    enrolledStudentsCount: 38,
    assignmentsCount: 4,
    progressPercent: 40,
    assignmentTitle: 'Tugas 2: Wireframe & Figma Interactive Prototype',
    assignmentDeadline: '2026-08-18',
    modules: [
      {
        id: 'mod-3',
        title: 'Modul 1: Wireframing & Responsive Layout Grid',
        description: 'Prinsip tata letak responsive desktop & mobile.',
        subMaterials: [
          { id: 'sub-6', title: 'Video: Grid System & Typography Hierarchy', type: 'video', durationMinutes: 20, completed: true }
        ]
      }
    ]
  },
  {
    id: 'crs-3',
    code: 'FS-303',
    title: 'Fullstack Node.js & Supabase Backend API',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Fox',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    description: 'Arsitektur REST API terintegrasi Supabase, JWT Authentication, dan Relational Database.',
    category: 'Backend Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    enrolledStudentsCount: 35,
    assignmentsCount: 3,
    progressPercent: 25,
    assignmentTitle: 'Tugas 3: Database Schema & Authentication API',
    assignmentDeadline: '2026-08-22',
    modules: [
      {
        id: 'mod-4',
        title: 'Modul 1: Express REST API & Database Middleware',
        description: 'Membuat controller dan middleware otentikasi JWT.',
        subMaterials: [
          { id: 'sub-7', title: 'Video: Auth Middleware Implementation', type: 'video', durationMinutes: 30, completed: false }
        ]
      }
    ]
  },
  {
    id: 'crs-4',
    code: 'MOB-404',
    title: 'Mobile App Development dengan Flutter',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Fox',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    description: 'Pembuatan aplikasi mobile cross-platform Android & iOS dengan Flutter & BLoC state management.',
    category: 'Mobile App',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    enrolledStudentsCount: 28,
    assignmentsCount: 2,
    progressPercent: 10,
    assignmentTitle: 'Tugas 4: Aplikasi Mobile UI & State Management',
    assignmentDeadline: '2026-08-28',
    modules: [
      {
        id: 'mod-5',
        title: 'Modul 1: Flutter Widgets & Layout System',
        description: 'Pengenalan StatelessWidget & StatefulWidget.',
        subMaterials: [
          { id: 'sub-8', title: 'Video: Basic Widget Trees in Flutter', type: 'video', durationMinutes: 18, completed: false }
        ]
      }
    ]
  }
];

export const initialLiveClasses: LiveClassSession[] = [
  {
    id: 'live-1',
    title: 'Sesi Sinkron: Interactive WebRTC Live Workshop',
    courseTitle: 'Frontend Web Development',
    teacherName: 'Dr. Robert Fox',
    scheduledTime: '15:00 WIB Hari Ini',
    durationMinutes: 90,
    platform: 'Custom WebRTC',
    link: 'https://meet.skillset.edu/room-101',
    isLiveNow: true,
    startsInMinutes: 10
  },
  {
    id: 'live-2',
    title: 'Mentoring & Feedback Portofolio UI/UX',
    courseTitle: 'UI/UX Design Masterclass',
    teacherName: 'Dr. Robert Fox',
    scheduledTime: 'Besok, 10:00 WIB',
    durationMinutes: 60,
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-defg-hij',
    isLiveNow: false,
    startsInMinutes: 1440
  }
];

export const initialInvoices: Invoice[] = [
  // SPP Bulan Agustus 2026
  {
    id: 'inv-1',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-1',
    studentName: 'Jacob Jones',
    studentEmail: 'jacob.jones@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'unpaid',
    createdAt: '2026-08-01'
  },
  {
    id: 'inv-1-2',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-2',
    studentName: 'Jane Cooper',
    studentEmail: 'jane.cooper@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'pending',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-08-01'
  },
  {
    id: 'inv-1-3',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-3',
    studentName: 'Cody Fisher',
    studentEmail: 'cody.fisher@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'paid',
    createdAt: '2026-08-01'
  },
  {
    id: 'inv-1-4',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-4',
    studentName: 'Jenny Wilson',
    studentEmail: 'jenny.wilson@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'overdue',
    createdAt: '2026-08-01'
  },
  {
    id: 'inv-1-5',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-5',
    studentName: 'Arlene McCoy',
    studentEmail: 'arlene.mccoy@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'paid',
    createdAt: '2026-08-01'
  },
  {
    id: 'inv-1-6',
    invoiceCode: 'INV-2026-0801',
    studentId: 'usr-6',
    studentName: 'Jerome Bell',
    studentEmail: 'jerome.bell@skillset.edu',
    title: 'SPP Bulan Agustus 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-08-15',
    status: 'unpaid',
    createdAt: '2026-08-01'
  },

  // Biaya Pendaftaran UI/UX Bootcamp
  {
    id: 'inv-2',
    invoiceCode: 'INV-2026-0802',
    studentId: 'usr-2',
    studentName: 'Jane Cooper',
    studentEmail: 'jane.cooper@skillset.edu',
    title: 'Biaya Pendaftaran UI/UX Bootcamp',
    category: 'Kursus',
    amount: 1250000,
    dueDate: '2026-08-10',
    status: 'pending',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-08-02'
  },
  {
    id: 'inv-2-2',
    invoiceCode: 'INV-2026-0802',
    studentId: 'usr-6',
    studentName: 'Jerome Bell',
    studentEmail: 'jerome.bell@skillset.edu',
    title: 'Biaya Pendaftaran UI/UX Bootcamp',
    category: 'Kursus',
    amount: 1250000,
    dueDate: '2026-08-10',
    status: 'unpaid',
    createdAt: '2026-08-02'
  },
  {
    id: 'inv-2-3',
    invoiceCode: 'INV-2026-0802',
    studentId: 'usr-7',
    studentName: 'Albert Flores',
    studentEmail: 'albert.flores@skillset.edu',
    title: 'Biaya Pendaftaran UI/UX Bootcamp',
    category: 'Kursus',
    amount: 1250000,
    dueDate: '2026-08-10',
    status: 'paid',
    createdAt: '2026-08-02'
  },

  // SPP Bulan Juli 2026
  {
    id: 'inv-3',
    invoiceCode: 'INV-2026-0705',
    studentId: 'usr-3',
    studentName: 'Cody Fisher',
    studentEmail: 'cody.fisher@skillset.edu',
    title: 'SPP Bulan Juli 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-07-15',
    status: 'paid',
    createdAt: '2026-07-01'
  },
  {
    id: 'inv-3-2',
    invoiceCode: 'INV-2026-0705',
    studentId: 'usr-1',
    studentName: 'Jacob Jones',
    studentEmail: 'jacob.jones@skillset.edu',
    title: 'SPP Bulan Juli 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-07-15',
    status: 'paid',
    createdAt: '2026-07-01'
  },
  {
    id: 'inv-3-3',
    invoiceCode: 'INV-2026-0705',
    studentId: 'usr-4',
    studentName: 'Jenny Wilson',
    studentEmail: 'jenny.wilson@skillset.edu',
    title: 'SPP Bulan Juli 2026',
    category: 'SPP',
    amount: 750000,
    dueDate: '2026-07-15',
    status: 'overdue',
    createdAt: '2026-07-01'
  },

  // Biaya Modul Sertifikasi Data Science
  {
    id: 'inv-4',
    invoiceCode: 'INV-2026-0610',
    studentId: 'usr-4',
    studentName: 'Jenny Wilson',
    studentEmail: 'jenny.wilson@skillset.edu',
    title: 'Biaya Modul Sertifikasi Data Science',
    category: 'Kursus',
    amount: 1500000,
    dueDate: '2026-06-30',
    status: 'overdue',
    createdAt: '2026-06-01'
  },
  {
    id: 'inv-4-2',
    invoiceCode: 'INV-2026-0610',
    studentId: 'usr-8',
    studentName: 'Floyd Miles',
    studentEmail: 'floyd.miles@skillset.edu',
    title: 'Biaya Modul Sertifikasi Data Science',
    category: 'Kursus',
    amount: 1500000,
    dueDate: '2026-06-30',
    status: 'paid',
    createdAt: '2026-06-01'
  }
];

export const initialLibraryItems: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'Panduan Komprehensif Modern React 18 & TypeScript',
    type: 'E-book',
    author: 'Tim Akademik SkillSet',
    category: 'Programming',
    fileSize: '4.2 MB',
    downloadUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',
    addedDate: '2026-01-10'
  },
  {
    id: 'lib-2',
    title: 'Jurnal Ilmiah: Implementasi AI dalam LMS Interaktif',
    type: 'Jurnal',
    author: 'Dr. Robert Fox',
    category: 'Education Tech',
    fileSize: '1.8 MB',
    downloadUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80',
    addedDate: '2026-02-01'
  },
  {
    id: 'lib-3',
    title: 'Video Workshop: Building High Performance Design Systems',
    type: 'Video',
    author: 'Studio Design SkillSet',
    category: 'UI/UX Design',
    fileSize: '185 MB',
    downloadUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80',
    addedDate: '2026-02-15'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Live Class Dimulai!',
    message: 'Kelas Frontend Web Development dengan Dr. Robert Fox akan dimulai dalam 10 menit.',
    time: '5 menit lalu',
    isRead: false,
    type: 'live'
  },
  {
    id: 'notif-2',
    title: 'Tugas Baru Diunggah',
    message: 'Pengajar Dr. Robert Fox mengunggah tugas "Build CRM Attendance Page" di modul 2.',
    time: '1 jam lalu',
    isRead: false,
    type: 'assignment'
  },
  {
    id: 'notif-3',
    title: 'Pengingat Pembayaran',
    message: 'Tagihan SPP Bulan Agustus 2026 telah diterbitkan.',
    time: '1 hari lalu',
    isRead: true,
    type: 'payment'
  }
];
