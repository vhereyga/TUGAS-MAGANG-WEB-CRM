import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  AttendanceRecord, 
  AttendantHistoryItem, 
  Course, 
  CourseModule,
  SubMaterial,
  LiveClassSession, 
  Invoice, 
  LibraryItem, 
  NotificationItem,
  AssignmentSubmission
} from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  isAuthenticated: boolean;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data models
  profiles: UserProfile[];
  addProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  updateProfile: (id: string, data: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => void;
  
  attendanceRecords: AttendanceRecord[];
  updateAttendanceStatus: (id: string, status: 'Regular' | 'Irregular') => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'lastUpdated'>) => void;
  
  attendantsHistory: AttendantHistoryItem[];
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (courseId: string, data: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  updateCourseDeadline: (courseId: string, deadline: string) => void;
  addModuleToCourse: (courseId: string, module: Omit<CourseModule, 'id'>) => void;
  updateCourseModule: (courseId: string, moduleId: string, data: Partial<CourseModule>) => void;
  deleteCourseModule: (courseId: string, moduleId: string) => void;
  addSubMaterialToModule: (courseId: string, moduleId: string, subMaterial: Omit<SubMaterial, 'id'>) => void;
  updateSubMaterial: (courseId: string, moduleId: string, subMaterialId: string, data: Partial<SubMaterial>) => void;
  deleteSubMaterial: (courseId: string, moduleId: string, subMaterialId: string) => void;
  
  assignmentSubmissions: AssignmentSubmission[];
  addAssignmentSubmission: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  updateSubmissionStatus: (submissionId: string, status: 'accepted' | 'rejected') => void;
  gradeAssignmentSubmission: (submissionId: string, score: number) => void;
  
  liveClasses: LiveClassSession[];
  addLiveClass: (session: Omit<LiveClassSession, 'id'>) => void;
  toggleLiveStatus: (id: string, isLive?: boolean) => void;
  deleteLiveClass: (id: string) => void;
  
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'> & { invoiceCode?: string }) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status'], proofUrl?: string) => void;
  deleteInvoiceByCode: (invoiceCode: string) => void;
  
  libraryItems: LibraryItem[];
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'addedDate'>) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendantsHistory, setAttendantsHistory] = useState<AttendantHistoryItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassSession[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillset_is_authenticated');
    return saved !== null ? saved === 'true' : false;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('skillset_current_user_id') || 'adm-1';
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('skillset_current_role');
    return (savedRole as UserRole) || 'admin';
  });

  const [activeTab, setActiveTab] = useState<string>('attendance');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dark / Light Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('skillset_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('skillset_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initial Data Fetching from Supabase Cloud DB
  useEffect(() => {
    const loadAllSupabaseData = async () => {
      try {
        // Fetch profiles
        const { data: pData } = await supabase.from('profiles').select('*');
        if (pData && pData.length > 0) {
          setProfiles(pData.map(p => ({
            id: p.id,
            studentId: p.student_id || undefined,
            teacherId: p.teacher_id || undefined,
            fullName: p.full_name,
            email: p.email,
            password: p.password || undefined,
            role: p.role as UserRole,
            avatarUrl: p.avatar_url || '',
            phone: p.phone || undefined,
            classStatus: p.class_status || undefined,
            attendanceRate: Number(p.attendance_rate || 0),
            statusBadge: p.status_badge as any,
            status: p.status as any,
            createdAt: p.created_at || ''
          })));
        }

        // Fetch attendanceRecords
        const { data: attData } = await supabase.from('attendance_records').select('*');
        if (attData && attData.length > 0) {
          setAttendanceRecords(attData.map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            avatarUrl: a.avatar_url || '',
            customCode: a.custom_code || '',
            responseRate: Number(a.response_rate || 0),
            status: a.status as any,
            lastUpdated: a.last_updated || ''
          })));
        }

        // Fetch attendantsHistory
        const { data: histData } = await supabase.from('attendants_history').select('*');
        if (histData && histData.length > 0) {
          setAttendantsHistory(histData.map(h => ({
            id: h.id,
            name: h.name,
            avatar: h.avatar || '',
            duration: h.duration || '',
            rate: Number(h.rate || 0),
            badgeColor: h.badge_color || '#3b82f6'
          })));
        }

        // Fetch courses
        const { data: cData } = await supabase.from('courses').select('*');
        if (cData && cData.length > 0) {
          setCourses(cData.map(c => ({
            id: c.id,
            code: c.code || '',
            title: c.title,
            teacherId: c.teacher_id || '',
            teacherName: c.teacher_name || '',
            teacherAvatar: c.teacher_avatar || '',
            description: c.description || '',
            category: c.category || '',
            thumbnail: c.thumbnail || '',
            enrolledStudentsCount: Number(c.enrolled_students_count || 0),
            assignmentsCount: Number(c.assignments_count || 0),
            progressPercent: Number(c.progress_percent || 0),
            assignmentTitle: c.assignment_title || undefined,
            assignmentDeadline: c.assignment_deadline || undefined,
            modules: []
          })));
        }

        // Fetch assignmentSubmissions
        const { data: subData } = await supabase.from('assignment_submissions').select('*');
        if (subData && subData.length > 0) {
          setAssignmentSubmissions(subData.map(s => ({
            id: s.id,
            courseId: s.course_id,
            courseTitle: s.course_title,
            studentId: s.student_id,
            studentName: s.student_name,
            studentAvatar: s.student_avatar || '',
            fileName: s.file_name || '',
            notes: s.notes || undefined,
            submittedAt: s.submitted_at || '',
            status: s.status as any,
            score: s.score ? Number(s.score) : undefined
          })));
        }

        // Fetch liveClasses
        const { data: liveData } = await supabase.from('live_classes').select('*');
        if (liveData && liveData.length > 0) {
          setLiveClasses(liveData.map(l => ({
            id: l.id,
            title: l.title,
            courseTitle: l.course_title || '',
            teacherName: l.teacher_name || '',
            scheduledTime: l.scheduled_time || '',
            durationMinutes: Number(l.duration_minutes || 60),
            platform: l.platform as any,
            link: l.link || '',
            isLiveNow: Boolean(l.is_live_now),
            startsInMinutes: Number(l.starts_in_minutes || 0)
          })));
        }

        // Fetch invoices
        const { data: invData } = await supabase.from('invoices').select('*');
        if (invData && invData.length > 0) {
          setInvoices(invData.map(i => ({
            id: i.id,
            invoiceCode: i.invoice_code || i.invoiceCode,
            studentId: i.student_id || i.studentId,
            studentName: i.student_name || i.studentName,
            studentEmail: i.student_email || i.studentEmail,
            title: i.title,
            category: i.category,
            amount: Number(i.amount),
            dueDate: i.due_date || i.dueDate,
            status: i.status,
            proofUrl: i.proof_url || i.proofUrl,
            createdAt: i.created_at || i.createdAt
          })));
        }

        // Fetch libraryItems
        const { data: libData } = await supabase.from('library_items').select('*');
        if (libData && libData.length > 0) {
          setLibraryItems(libData.map(l => ({
            id: l.id,
            title: l.title,
            type: l.type as any,
            author: l.author || '',
            category: l.category || '',
            fileSize: l.file_size || '',
            downloadUrl: l.download_url || '#',
            coverImage: l.cover_image || '',
            addedDate: l.added_date || ''
          })));
        }

        // Fetch notifications
        const { data: notifData } = await supabase.from('notifications').select('*');
        if (notifData && notifData.length > 0) {
          setNotifications(notifData.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message || '',
            time: n.time || '',
            isRead: Boolean(n.is_read),
            type: n.type as any
          })));
        }
      } catch (err) {
        console.error('Error loading Supabase data:', err);
      }
    };

    loadAllSupabaseData();
  }, []);

  // Default fallbacks for currentUser
  const defaultFallbackUser: UserProfile = {
    id: 'adm-1',
    fullName: 'Administrator SkillSet',
    email: 'admin@skillset.edu',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    createdAt: '2025-01-01'
  };

  const currentUser: UserProfile = profiles.find(p => p.id === currentUserId) || 
    profiles.find(p => p.role === currentRole) || 
    defaultFallbackUser;

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('skillset_current_role', role);
    const matchedProfile = profiles.find(p => p.role === role);
    if (matchedProfile) {
      setCurrentUserId(matchedProfile.id);
      localStorage.setItem('skillset_current_user_id', matchedProfile.id);
    }
  };

  const login = (email: string, password?: string): { success: boolean; message?: string } => {
    const targetEmail = email.trim().toLowerCase();
    const foundUser = profiles.find(p => p.email.toLowerCase() === targetEmail);

    if (!foundUser) {
      return { success: false, message: 'Email tidak terdaftar dalam sistem.' };
    }

    if (foundUser.status === 'suspended') {
      return { success: false, message: 'Akun Anda dinonaktifkan. Silakan hubungi Admin.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }

    setCurrentUserId(foundUser.id);
    setCurrentRoleState(foundUser.role);
    setIsAuthenticated(true);

    localStorage.setItem('skillset_current_user_id', foundUser.id);
    localStorage.setItem('skillset_current_role', foundUser.role);
    localStorage.setItem('skillset_is_authenticated', 'true');

    return { success: true };
  };

  const loginAsRole = (role: UserRole) => {
    const targetUser = profiles.find(p => p.role === role && p.status === 'active') || profiles.find(p => p.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setCurrentRoleState(targetUser.role);
      setIsAuthenticated(true);

      localStorage.setItem('skillset_current_user_id', targetUser.id);
      localStorage.setItem('skillset_current_role', targetUser.role);
      localStorage.setItem('skillset_is_authenticated', 'true');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('skillset_is_authenticated', 'false');
  };

  // Handlers with Supabase cloud DB persistence
  const addProfile = async (newP: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const created: UserProfile = {
      ...newP,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProfiles(prev => [created, ...prev]);

    try {
      await supabase.from('profiles').insert({
        id: created.id,
        student_id: created.studentId,
        teacher_id: created.teacherId,
        full_name: created.fullName,
        email: created.email,
        password: created.password,
        role: created.role,
        avatar_url: created.avatarUrl,
        phone: created.phone,
        class_status: created.classStatus,
        attendance_rate: created.attendanceRate,
        status_badge: created.statusBadge,
        status: created.status,
        created_at: created.createdAt
      });
    } catch (e) { console.error('Supabase profile add error:', e); }

    if (newP.role === 'student') {
      const newAtt: AttendanceRecord = {
        id: `att-${Date.now()}`,
        studentId: created.id,
        studentName: created.fullName,
        avatarUrl: created.avatarUrl,
        customCode: created.studentId || `STU-0000${Math.floor(10 + Math.random() * 90)}`,
        responseRate: created.attendanceRate || 0,
        status: created.statusBadge || 'Irregular',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setAttendanceRecords(prev => [newAtt, ...prev]);

      try {
        await supabase.from('attendance_records').insert({
          id: newAtt.id,
          student_id: newAtt.studentId,
          student_name: newAtt.studentName,
          avatar_url: newAtt.avatarUrl,
          custom_code: newAtt.customCode,
          response_rate: newAtt.responseRate,
          status: newAtt.status,
          last_updated: newAtt.lastUpdated
        });
      } catch (e) { console.error('Supabase attendance add error:', e); }
    }
  };

  const updateProfile = async (id: string, data: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    try {
      await supabase.from('profiles').update(data).eq('id', id);
    } catch (e) { console.error('Supabase update profile error:', e); }
  };

  const deleteProfile = async (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    setAttendanceRecords(prev => prev.filter(a => a.studentId !== id));
    try {
      await supabase.from('profiles').delete().eq('id', id);
      await supabase.from('attendance_records').delete().eq('student_id', id);
    } catch (e) { console.error('Supabase delete profile error:', e); }
  };

  const updateAttendanceStatus = async (id: string, status: 'Regular' | 'Irregular') => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      lastUpdated: today
    } : item));
    try {
      await supabase.from('attendance_records').update({ status, last_updated: today }).eq('id', id);
    } catch (e) { console.error('Supabase attendance update error:', e); }
  };

  const addAttendanceRecord = async (rec: Omit<AttendanceRecord, 'id' | 'lastUpdated'>) => {
    const created: AttendanceRecord = {
      ...rec,
      id: `att-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setAttendanceRecords(prev => [created, ...prev]);
    try {
      await supabase.from('attendance_records').insert({
        id: created.id,
        student_id: created.studentId,
        student_name: created.studentName,
        avatar_url: created.avatarUrl,
        custom_code: created.customCode,
        response_rate: created.responseRate,
        status: created.status,
        last_updated: created.lastUpdated
      });
    } catch (e) { console.error('Supabase attendance record error:', e); }
  };

  const addCourse = async (c: Omit<Course, 'id'>) => {
    const created: Course = {
      ...c,
      id: `crs-${Date.now()}`
    };
    setCourses(prev => [created, ...prev]);
    try {
      await supabase.from('courses').insert({
        id: created.id,
        code: created.code,
        title: created.title,
        teacher_id: created.teacherId,
        teacher_name: created.teacherName,
        teacher_avatar: created.teacherAvatar,
        description: created.description,
        category: created.category,
        thumbnail: created.thumbnail,
        enrolled_students_count: created.enrolledStudentsCount,
        assignments_count: created.assignmentsCount,
        progress_percent: created.progressPercent,
        assignment_title: created.assignmentTitle,
        assignment_deadline: created.assignmentDeadline
      });
    } catch (e) { console.error('Supabase add course error:', e); }
  };

  const updateCourseDeadline = async (courseId: string, deadline: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, assignmentDeadline: deadline } : c));
    try {
      await supabase.from('courses').update({ assignment_deadline: deadline }).eq('id', courseId);
    } catch (e) { console.error('Supabase course deadline error:', e); }
  };

  const updateCourse = async (courseId: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data } : c));
    try {
      const dbUpdates: any = {};
      if (data.title !== undefined) dbUpdates.title = data.title;
      if (data.code !== undefined) dbUpdates.code = data.code;
      if (data.description !== undefined) dbUpdates.description = data.description;
      if (data.category !== undefined) dbUpdates.category = data.category;
      if (data.thumbnail !== undefined) dbUpdates.thumbnail = data.thumbnail;
      if (data.assignmentTitle !== undefined) dbUpdates.assignment_title = data.assignmentTitle;
      if (data.assignmentDeadline !== undefined) dbUpdates.assignment_deadline = data.assignmentDeadline;

      if (Object.keys(dbUpdates).length > 0) {
        await supabase.from('courses').update(dbUpdates).eq('id', courseId);
      }
    } catch (e) { console.error('Supabase update course error:', e); }
  };

  const deleteCourse = async (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    try {
      await supabase.from('courses').delete().eq('id', courseId);
    } catch (e) { console.error('Supabase delete course error:', e); }
  };

  const addModuleToCourse = async (courseId: string, module: Omit<CourseModule, 'id'>) => {
    const newMod: CourseModule = {
      ...module,
      id: `mod-${Date.now()}`
    };
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: [...(c.modules || []), newMod]
        };
      }
      return c;
    }));
  };

  const updateCourseModule = async (courseId: string, moduleId: string, data: Partial<CourseModule>) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).map(m => m.id === moduleId ? { ...m, ...data } : m)
        };
      }
      return c;
    }));
  };

  const deleteCourseModule = async (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).filter(m => m.id !== moduleId)
        };
      }
      return c;
    }));
  };

  const addSubMaterialToModule = async (courseId: string, moduleId: string, sub: Omit<SubMaterial, 'id'>) => {
    const newSub: SubMaterial = {
      ...sub,
      id: `sub-${Date.now()}`
    };
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                subMaterials: [...(m.subMaterials || []), newSub]
              };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const updateSubMaterial = async (courseId: string, moduleId: string, subId: string, data: Partial<SubMaterial>) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                subMaterials: (m.subMaterials || []).map(s => s.id === subId ? { ...s, ...data } : s)
              };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const deleteSubMaterial = async (courseId: string, moduleId: string, subId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                subMaterials: (m.subMaterials || []).filter(s => s.id !== subId)
              };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const addSystemNotification = async (notif: Omit<NotificationItem, 'id' | 'isRead'>) => {
    const created: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isRead: false
    };
    setNotifications(prev => [created, ...prev]);
    try {
      await supabase.from('notifications').insert({
        id: created.id,
        title: created.title,
        message: created.message,
        time: created.time,
        is_read: false,
        type: created.type
      });
    } catch (e) { console.error('Supabase notification insert error:', e); }
  };

  const addAssignmentSubmission = async (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const created: AssignmentSubmission = {
      ...sub,
      id: `subm-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    setAssignmentSubmissions(prev => [created, ...prev]);
    try {
      await supabase.from('assignment_submissions').insert({
        id: created.id,
        course_id: created.courseId,
        course_title: created.courseTitle,
        student_id: created.studentId,
        student_name: created.studentName,
        student_avatar: created.studentAvatar,
        file_name: created.fileName,
        notes: created.notes,
        submitted_at: created.submittedAt,
        status: created.status
      });
    } catch (e) { console.error('Supabase submission add error:', e); }

    // Trigger notification for Teacher/Guru role
    addSystemNotification({
      title: 'Tugas Baru Dikirimkan',
      message: `${created.studentName} mengunggah tugas "${created.fileName}" untuk kursus "${created.courseTitle}".`,
      time: 'Baru saja',
      type: 'assignment'
    });
  };

  const handleAssignmentAccepted = async (sub: AssignmentSubmission) => {
    const nowFormatted = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Find student attendance record if exists
    const existingAtt = attendanceRecords.find(
      a => a.studentId === sub.studentId || a.studentName.toLowerCase() === sub.studentName.toLowerCase()
    );

    let newRate = 75;
    if (existingAtt) {
      newRate = Math.min(100, Math.max(50, Number(existingAtt.responseRate || 0) + 15));
    }

    const badgeColor = newRate >= 75 ? '#22c55e' : newRate >= 60 ? '#3b82f6' : newRate >= 50 ? '#f59e0b' : '#ef4444';

    const newHistItem: AttendantHistoryItem = {
      id: `hist-${Date.now()}`,
      name: sub.studentName,
      avatar: sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      duration: `Sudah absen pada ${nowFormatted}`,
      rate: newRate,
      badgeColor: badgeColor
    };

    setAttendantsHistory(prev => [newHistItem, ...prev]);

    try {
      await supabase.from('attendants_history').insert({
        id: newHistItem.id,
        name: newHistItem.name,
        avatar: newHistItem.avatar,
        duration: newHistItem.duration,
        rate: newHistItem.rate,
        badge_color: newHistItem.badgeColor
      });
    } catch (e) {
      console.error('Supabase insert attendants_history error:', e);
    }

    // Also update student attendance record
    const today = new Date().toISOString().split('T')[0];
    if (existingAtt) {
      setAttendanceRecords(prev => prev.map(a => a.id === existingAtt.id ? {
        ...a,
        responseRate: newRate,
        status: 'Regular',
        lastUpdated: today
      } : a));
      try {
        await supabase.from('attendance_records').update({
          response_rate: newRate,
          status: 'Regular',
          last_updated: today
        }).eq('id', existingAtt.id);
      } catch (e) {
        console.error('Supabase update attendance_record error:', e);
      }
    } else {
      const newAttRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        studentId: sub.studentId,
        studentName: sub.studentName,
        avatarUrl: sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        customCode: `STU-0000${Math.floor(10 + Math.random() * 90)}`,
        responseRate: newRate,
        status: 'Regular',
        lastUpdated: today
      };
      setAttendanceRecords(prev => [newAttRecord, ...prev]);
      try {
        await supabase.from('attendance_records').insert({
          id: newAttRecord.id,
          student_id: newAttRecord.studentId,
          student_name: newAttRecord.studentName,
          avatar_url: newAttRecord.avatarUrl,
          custom_code: newAttRecord.customCode,
          response_rate: newAttRecord.responseRate,
          status: newAttRecord.status,
          last_updated: newAttRecord.lastUpdated
        });
      } catch (e) {
        console.error('Supabase insert attendance_record error:', e);
      }
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'accepted' | 'rejected') => {
    const targetSub = assignmentSubmissions.find(s => s.id === submissionId);
    setAssignmentSubmissions(prev => prev.map(sub => sub.id === submissionId ? { ...sub, status } : sub));
    try {
      await supabase.from('assignment_submissions').update({ status }).eq('id', submissionId);
    } catch (e) { console.error('Supabase submission status error:', e); }

    if (status === 'accepted' && targetSub) {
      handleAssignmentAccepted(targetSub);
    }
  };

  const gradeAssignmentSubmission = async (submissionId: string, score: number) => {
    const targetSub = assignmentSubmissions.find(s => s.id === submissionId);
    setAssignmentSubmissions(prev => prev.map(sub => sub.id === submissionId ? { ...sub, score, status: 'accepted' as const } : sub));
    try {
      await supabase.from('assignment_submissions').update({ score, status: 'accepted' }).eq('id', submissionId);
    } catch (e) { console.error('Supabase submission grade error:', e); }

    if (targetSub) {
      handleAssignmentAccepted(targetSub);
    }
  };

  const addLiveClass = async (session: Omit<LiveClassSession, 'id'>) => {
    const created: LiveClassSession = {
      ...session,
      id: `live-${Date.now()}`
    };
    setLiveClasses(prev => [created, ...prev]);
    try {
      await supabase.from('live_classes').insert({
        id: created.id,
        title: created.title,
        course_title: created.courseTitle,
        teacher_name: created.teacherName,
        scheduled_time: created.scheduledTime,
        duration_minutes: created.durationMinutes,
        platform: created.platform,
        link: created.link,
        is_live_now: created.isLiveNow,
        starts_in_minutes: created.startsInMinutes
      });
    } catch (e) { console.error('Supabase live class add error:', e); }

    if (created.isLiveNow) {
      addSystemNotification({
        title: 'Kelas Live Dimulai!',
        message: `Sesi Live "${created.title}" (${created.courseTitle}) sedang berlangsung sekarang. Mari bergabung!`,
        time: 'Baru saja',
        type: 'live'
      });
    }
  };

  const toggleLiveStatus = async (id: string, isLive?: boolean) => {
    let nextLive = false;
    const targetSession = liveClasses.find(s => s.id === id);
    setLiveClasses(prev => prev.map(s => {
      if (s.id === id) {
        nextLive = isLive !== undefined ? isLive : !s.isLiveNow;
        return { ...s, isLiveNow: nextLive };
      }
      return s;
    }));
    try {
      await supabase.from('live_classes').update({ is_live_now: nextLive }).eq('id', id);
    } catch (e) { console.error('Supabase toggle live error:', e); }

    if (nextLive && targetSession) {
      addSystemNotification({
        title: 'Kelas Live Dimulai!',
        message: `Sesi Live "${targetSession.title}" (${targetSession.courseTitle}) sedang berlangsung sekarang. Mari bergabung!`,
        time: 'Baru saja',
        type: 'live'
      });
    }
  };

  const deleteLiveClass = async (id: string) => {
    setLiveClasses(prev => prev.filter(s => s.id !== id));
    try {
      await supabase.from('live_classes').delete().eq('id', id);
    } catch (e) { console.error('Supabase delete live error:', e); }
  };

  const addInvoice = async (inv: Omit<Invoice, 'id' | 'createdAt'> & { invoiceCode?: string }) => {
    const created: Invoice = {
      ...inv,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      invoiceCode: inv.invoiceCode || `INV-2026-0${Math.floor(800 + Math.random() * 99)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [created, ...prev]);

    try {
      await supabase.from('invoices').insert({
        id: created.id,
        invoice_code: created.invoiceCode,
        student_id: created.studentId,
        student_name: created.studentName,
        student_email: created.studentEmail,
        title: created.title,
        category: created.category,
        amount: created.amount,
        due_date: created.dueDate,
        status: created.status,
        proof_url: created.proofUrl,
        created_at: created.createdAt
      });
    } catch (err) {
      console.error('Supabase error inserting invoice:', err);
    }

    if (created.status === 'overdue') {
      addSystemNotification({
        title: 'Tagihan Menunggak (Overdue)',
        message: `Tagihan "${created.title}" (${created.invoiceCode}) untuk ${created.studentName} telah melewati batas waktu pembayaran.`,
        time: 'Baru saja',
        type: 'payment'
      });
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status'], proofUrl?: string) => {
    const targetInv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      proofUrl: proofUrl || item.proofUrl
    } : item));

    try {
      await supabase.from('invoices').update({
        status,
        proof_url: proofUrl
      }).eq('id', id);
    } catch (err) {
      console.error('Supabase error updating invoice:', err);
    }

    if (status === 'overdue' && targetInv) {
      addSystemNotification({
        title: 'Tagihan Menunggak (Overdue)',
        message: `Tagihan "${targetInv.title}" (${targetInv.invoiceCode}) untuk ${targetInv.studentName} telah melewati batas waktu pembayaran.`,
        time: 'Baru saja',
        type: 'payment'
      });
    }
  };

  const deleteInvoiceByCode = async (code: string) => {
    setInvoices(prev => prev.filter(inv => inv.invoiceCode !== code && inv.title !== code));

    try {
      await supabase.from('invoices').delete().or(`invoice_code.eq.${code},title.eq.${code}`);
    } catch (err) {
      console.error('Supabase error deleting invoice:', err);
    }
  };

  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'addedDate'>) => {
    const created: LibraryItem = {
      ...item,
      id: `lib-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setLibraryItems(prev => [created, ...prev]);
    try {
      await supabase.from('library_items').insert({
        id: created.id,
        title: created.title,
        type: created.type,
        author: created.author,
        category: created.category,
        file_size: created.fileSize,
        download_url: created.downloadUrl,
        cover_image: created.coverImage,
        added_date: created.addedDate
      });
    } catch (e) { console.error('Supabase add library error:', e); }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (e) { console.error('Supabase notification mark error:', e); }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      currentRole,
      setCurrentRole,
      currentUser,
      login,
      loginAsRole,
      logout,
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      profiles,
      addProfile,
      updateProfile,
      deleteProfile,
      attendanceRecords,
      updateAttendanceStatus,
      addAttendanceRecord,
      attendantsHistory,
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
      updateCourseDeadline,
      addModuleToCourse,
      updateCourseModule,
      deleteCourseModule,
      addSubMaterialToModule,
      updateSubMaterial,
      deleteSubMaterial,
      assignmentSubmissions,
      addAssignmentSubmission,
      updateSubmissionStatus,
      gradeAssignmentSubmission,
      liveClasses,
      addLiveClass,
      toggleLiveStatus,
      deleteLiveClass,
      invoices,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoiceByCode,
      libraryItems,
      addLibraryItem,
      notifications,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
