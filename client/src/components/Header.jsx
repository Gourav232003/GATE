import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';

function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.branch || 'GATE Aspirant'}</p>
            </div>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <User size={16} />
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Settings size={16} />
                Settings
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
