import React, { useState } from 'react';
import { Link2, Menu, X, LayoutDashboard, Link as LinkIcon, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducer/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
 const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { path: '/links', icon: <LinkIcon className="w-4 h-4" />, label: 'Links' },
    { path: '/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-5">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Link2 className="text-blue-600 w-5 h-5" />
                <span className="font-normal text-gray-900 text-base">Koda Shortlink</span>
              </Link>

              <div className="hidden sm:flex items-center gap-6">
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
            </div>

            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-normal">Logout</span>
            </button>

            <button
              className="sm:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="sm:hidden pb-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-normal">{item.label}</span>
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-normal">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }


  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="text-blue-600 w-5 h-5" />
          <span className="font-medium text-gray-900">Koda Shortlink</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>

        <button
          className="sm:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 pb-4">
          <Link 
            to="/login" 
            className="text-gray-700 font-medium px-4 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/login" 
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;