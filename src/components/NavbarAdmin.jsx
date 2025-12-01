import React from 'react';
import { Link2, LayoutDashboard, Link as LinkIcon, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function NavbarAdmin() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { path: '/links', icon: <LinkIcon className="w-4 h-4" />, label: 'Links' },
    { path: '/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 h-14">

          <Link to="/dashboard" className="flex items-center gap-2">
            <Link2 className="text-blue-600 w-5 h-5" />
            <span className="font-normal text-gray-900 text-base">Koda Shortlink</span>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="text-sm font-normal">{item.label}</span>
              </Link>
            ))}
          </div>

          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-normal">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;