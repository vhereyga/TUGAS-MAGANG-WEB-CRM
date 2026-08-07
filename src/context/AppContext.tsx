import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  AttendanceRecord, 
  AttendantHistoryItem, 
  Course, 
  LiveClassSession, 
  Invoice, 
  LibraryItem, 
  NotificationItem,
  AssignmentSubmission
} from '../types';
import { 
  initialProfiles, 
  initialAttendanceRecords, 
  initialAttendantsHistory, 
  initialCourses, 
  initialLiveClasses, 
  initialInvoices, 
  initialLibraryItems, 
  initialNotifications,
  initialAssignmentSubmissions
} from '../data/mockData';

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
  updateCourseDeadline: (courseId: string, deadline: string) => void;
  
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
  // State profiles initialization with localStorage fallbacks
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('skillset_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillset_is_authenticated');
    return saved !== null ? saved === 'true' : true;
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

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('skillset_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [attendantsHistory] = useState<AttendantHistoryItem[]>(initialAttendantsHistory);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('skillset_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('skillset_submissions');
    return saved ? JSON.parse(saved) : initialAssignmentSubmissions;
  });

  const [liveClasses, setLiveClasses] = useState<LiveClassSession[]>(() => {
    const saved = localStorage.getItem('skillset_live');
    return saved ? JSON.parse(saved) : initialLiveClasses;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('skillset_invoices');
    if (saved) {
      try {
        const parsed: Invoice[] = JSON.parse(saved);
        return parsed.map(inv => {
          if (inv.title === 'SPP Bulan Agustus 2026') {
            return { ...inv, invoiceCode: 'INV-2026-0801' };
          }
          return inv;
        });
      } catch (e) {
        return initialInvoices;
      }
    }
    return initialInvoices;
  });

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('skillset_library');
    return saved ? JSON.parse(saved) : initialLibraryItems;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('skillset_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('skillset_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('skillset_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('skillset_submissions', JSON.stringify(assignmentSubmissions));
  }, [assignmentSubmissions]);

  useEffect(() => {
    localStorage.setItem('skillset_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Current active profile logic
  const currentUser: UserProfile = profiles.find(p => p.id === currentUserId) || 
    profiles.find(p => p.role === currentRole) || 
    profiles[0];

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

  // Handlers
  const addProfile = (newP: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const created: UserProfile = {
      ...newP,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProfiles(prev => [created, ...prev]);

    // If student, automatically add to attendance list
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
    }
  };

  const updateProfile = (id: string, data: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    setAttendanceRecords(prev => prev.filter(a => a.studentId !== id));
  };

  const updateAttendanceStatus = (id: string, status: 'Regular' | 'Irregular') => {
    setAttendanceRecords(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      lastUpdated: new Date().toISOString().split('T')[0]
    } : item));
  };

  const addAttendanceRecord = (rec: Omit<AttendanceRecord, 'id' | 'lastUpdated'>) => {
    const created: AttendanceRecord = {
      ...rec,
      id: `att-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setAttendanceRecords(prev => [created, ...prev]);
  };

  const addCourse = (c: Omit<Course, 'id'>) => {
    const created: Course = {
      ...c,
      id: `crs-${Date.now()}`
    };
    setCourses(prev => [created, ...prev]);
  };

  const updateCourseDeadline = (courseId: string, deadline: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, assignmentDeadline: deadline } : c));
  };

  const addAssignmentSubmission = (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const created: AssignmentSubmission = {
      ...sub,
      id: `subm-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    setAssignmentSubmissions(prev => [created, ...prev]);
  };

  const updateSubmissionStatus = (submissionId: string, status: 'accepted' | 'rejected') => {
    let targetStudentId = '';
    let targetStudentName = '';

    setAssignmentSubmissions(prevSubmissions => {
      const updatedSubmissions = prevSubmissions.map(sub => {
        if (sub.id === submissionId) {
          targetStudentId = sub.studentId;
          targetStudentName = sub.studentName;
          return { ...sub, status };
        }
        return sub;
      });

      if (targetStudentId || targetStudentName) {
        // Calculate number of distinct courses with accepted assignments for this student
        const studentAcceptedSubs = updatedSubmissions.filter(s => 
          (s.studentId === targetStudentId || s.studentName.toLowerCase() === targetStudentName.toLowerCase()) && 
          s.status === 'accepted'
        );
        const uniqueAcceptedCourses = new Set(studentAcceptedSubs.map(s => s.courseId)).size;
        const totalCourses = courses.length > 0 ? courses.length : 4;
        
        // 1 course = (100 / totalCourses)% (e.g. 4 courses = 25% each)
        const newPercentage = Math.min(100, Math.round((uniqueAcceptedCourses / totalCourses) * 100));
        const newBadge: 'Regular' | 'Irregular' = newPercentage >= 50 ? 'Regular' : 'Irregular';

        // Update attendanceRecords
        setAttendanceRecords(attPrev => attPrev.map(rec => {
          if (rec.studentId === targetStudentId || rec.studentName.toLowerCase() === targetStudentName.toLowerCase()) {
            return {
              ...rec,
              responseRate: newPercentage,
              status: newBadge,
              lastUpdated: new Date().toISOString().split('T')[0]
            };
          }
          return rec;
        }));

        // Update profiles
        setProfiles(profPrev => profPrev.map(p => {
          if (p.id === targetStudentId || p.fullName.toLowerCase() === targetStudentName.toLowerCase()) {
            return {
              ...p,
              attendanceRate: newPercentage,
              statusBadge: newBadge
            };
          }
          return p;
        }));
      }

      return updatedSubmissions;
    });
  };

  const gradeAssignmentSubmission = (submissionId: string, score: number) => {
    let targetStudentId = '';
    let targetStudentName = '';

    setAssignmentSubmissions(prevSubmissions => {
      const updatedSubmissions = prevSubmissions.map(sub => {
        if (sub.id === submissionId) {
          targetStudentId = sub.studentId;
          targetStudentName = sub.studentName;
          return { ...sub, score, status: 'accepted' as const };
        }
        return sub;
      });

      if (targetStudentId || targetStudentName) {
        // Calculate number of distinct courses with accepted assignments for this student
        const studentAcceptedSubs = updatedSubmissions.filter(s => 
          (s.studentId === targetStudentId || s.studentName.toLowerCase() === targetStudentName.toLowerCase()) && 
          s.status === 'accepted'
        );
        const uniqueAcceptedCourses = new Set(studentAcceptedSubs.map(s => s.courseId)).size;
        const totalCourses = courses.length > 0 ? courses.length : 4;
        
        // 1 course = 25% (if 4 courses total)
        const newPercentage = Math.min(100, Math.round((uniqueAcceptedCourses / totalCourses) * 100));
        const newBadge: 'Regular' | 'Irregular' = newPercentage >= 50 ? 'Regular' : 'Irregular';

        // Update attendanceRecords
        setAttendanceRecords(attPrev => attPrev.map(rec => {
          if (rec.studentId === targetStudentId || rec.studentName.toLowerCase() === targetStudentName.toLowerCase()) {
            return {
              ...rec,
              responseRate: newPercentage,
              status: newBadge,
              lastUpdated: new Date().toISOString().split('T')[0]
            };
          }
          return rec;
        }));

        // Update profiles
        setProfiles(profPrev => profPrev.map(p => {
          if (p.id === targetStudentId || p.fullName.toLowerCase() === targetStudentName.toLowerCase()) {
            return {
              ...p,
              attendanceRate: newPercentage,
              statusBadge: newBadge
            };
          }
          return p;
        }));
      }

      return updatedSubmissions;
    });
  };

  const addLiveClass = (session: Omit<LiveClassSession, 'id'>) => {
    const created: LiveClassSession = {
      ...session,
      id: `live-${Date.now()}`
    };
    setLiveClasses(prev => [created, ...prev]);
  };

  const toggleLiveStatus = (id: string, isLive?: boolean) => {
    setLiveClasses(prev => prev.map(s => {
      if (s.id === id) {
        const nextLive = isLive !== undefined ? isLive : !s.isLiveNow;
        return { ...s, isLiveNow: nextLive };
      }
      return s;
    }));
  };

  const deleteLiveClass = (id: string) => {
    setLiveClasses(prev => prev.filter(s => s.id !== id));
  };

  const addInvoice = (inv: Omit<Invoice, 'id' | 'createdAt'> & { invoiceCode?: string }) => {
    const created: Invoice = {
      ...inv,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      invoiceCode: inv.invoiceCode || `INV-2026-0${Math.floor(800 + Math.random() * 99)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [created, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status'], proofUrl?: string) => {
    setInvoices(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      proofUrl: proofUrl || item.proofUrl
    } : item));
  };

  const deleteInvoiceByCode = (code: string) => {
    setInvoices(prev => prev.filter(inv => inv.invoiceCode !== code && inv.title !== code));
  };

  const addLibraryItem = (item: Omit<LibraryItem, 'id' | 'addedDate'>) => {
    const created: LibraryItem = {
      ...item,
      id: `lib-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setLibraryItems(prev => [created, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
      updateCourseDeadline,
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
