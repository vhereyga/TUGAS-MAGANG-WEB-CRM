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
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

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

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 transition-colors duration-200 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookMarked className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-tight">SkillSet</h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">LMS & CRM Platform</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="px-4 py-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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

      {/* Upgrade to Pro Banner matching screenshot */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800/90 dark:to-slate-800/50 border border-indigo-100/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 text-center">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Upgrade to <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Pro</strong> for more facilities
          </p>
          <button 
            onClick={() => alert('Fitur Upgrade Pro: Membuka akses storage Supabase 1TB, Unlimited Live Rooms, & Analytics AI!')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center justify-center gap-2 group shadow-md"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Decorative blur elements */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-200/40 dark:bg-indigo-900/30 rounded-full blur-xl pointer-events-none" />
      </div>
    </aside>
  );
};
