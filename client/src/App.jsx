import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import PracticeSession from './pages/PracticeSession';
import MockTests from './pages/MockTests';
import TakeTest from './pages/TakeTest';
import Analytics from './pages/Analytics';
import RevisionNotes from './pages/RevisionNotes';
import Syllabus from './pages/Syllabus';
import PYQs from './pages/PYQs';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminPYQs from './pages/admin/AdminPYQs';
import AdminTests from './pages/admin/AdminTests';
import AdminUsers from './pages/admin/AdminUsers';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading && !isAdminRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle admin routes separately
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/pyqs" element={<AdminPYQs />} />
        <Route path="/admin/tests" element={<AdminTests />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/practice/:subject/:topic" element={<PracticeSession />} />
            <Route path="/pyqs" element={<PYQs />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/test/:testId" element={<TakeTest />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notes" element={<RevisionNotes />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
