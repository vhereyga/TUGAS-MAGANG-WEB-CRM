import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/auth/LoginPage';
import { AttendancePage } from './components/pages/AttendancePage';
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsTeachersPage } from './components/pages/StudentsTeachersPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { LiveClassPage } from './components/pages/LiveClassPage';
import { PaymentsPage } from './components/pages/PaymentsPage';
import { LibraryPage } from './components/pages/LibraryPage';
import { ReportsPage } from './components/pages/ReportsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardPage />;
      case 'students':
      case 'teachers':
        return <StudentsTeachersPage />;
      case 'courses':
        return <CoursesPage />;
      case 'live':
        return <LiveClassPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'payments':
        return <PaymentsPage />;
      case 'library':
        return <LibraryPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <AttendancePage />;
    }
  };

  return <MainLayout>{renderContent()}</MainLayout>;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
