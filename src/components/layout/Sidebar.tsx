import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Users, 
  UserCheck, 
  BookOpen, 
  Video, 
  CheckSquare, 
  CreditCard, 
  Folder, 
  BarChart3,
  BookMarked,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, closeMobileMenu } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: UserCheck },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'live', label: 'Live Class', icon: Video },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'library', label: 'Library', icon: Folder },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out z-50 md:z-30 select-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <BookMarked className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-tight">SkillSet</h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">LMS & CRM Platform</p>
              </div>
            </div>

            {/* Mobile Close Drawer Button */}
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 md:hidden"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="px-4 py-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-100px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-r-full shadow-sm" />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

