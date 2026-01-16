import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileQuestion, ClipboardList, Users, LogOut, 
  Menu, X, ChevronRight, Settings, BarChart3, Calendar
} from 'lucide-react';

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminUser');
    
    if (!token || !adminData) {
      navigate('/admin/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileQuestion, label: 'Questions', path: '/admin/questions' },
    { icon: Calendar, label: 'PYQ Papers', path: '/admin/pyqs' },
    { icon: ClipboardList, label: 'Tests', path: '/admin/tests' },
    { icon: Users, label: 'Users', path: '/admin/users' },
  ];

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {sidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          {sidebarOpen && (
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-white">{admin.name}</p>
              <p className="text-xs text-gray-400">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="min-h-screen p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
