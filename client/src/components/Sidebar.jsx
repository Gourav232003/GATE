import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  ClipboardList,
  BarChart3,
  FileText,
  GraduationCap,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/question-bank', icon: BookOpen, label: 'Question Bank' },
  { path: '/pyqs', icon: History, label: 'Previous Year Questions' },
  { path: '/mock-tests', icon: ClipboardList, label: 'Mock Tests' },
  { path: '/analytics', icon: BarChart3, label: 'Performance Analytics' },
  { path: '/notes', icon: FileText, label: 'Revision Notes' },
  { path: '/syllabus', icon: GraduationCap, label: 'Syllabus' },
];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GP</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">GATE Prep</h1>
              <p className="text-xs text-gray-500">Pro Edition</p>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">GP</span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-600 transition-colors"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm">GATE 2026</h3>
            <p className="text-xs text-primary-100 mt-1">
              Stay focused! Your preparation journey continues.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
