import React from 'react'
import { Link2, Menu, X } from 'lucide-react';
import { useState } from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="text-blue-600 w-5 h-5" />
          <span className="font-medium text-gray-900">Koda Shortlink</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link to={"/login"} className="text-gray-700 font-medium px-4 py-2 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <button className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>

        <button
          className="sm:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 pb-4">
          <Link to={"/login"} className="text-gray-700 font-medium px-4 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
            Sign In
          </Link>
          <button className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar