import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#000');
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (user) {
      setAvatarColor(getRandomColor());
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (id) => {
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(id), 100);
    }
  };

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#6F38C5', '#F67280'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout(() => navigate('/'));
  };

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Render Dashboard Top Navbar if logged in and on dashboard/profile routes
  if (isLoggedIn && isDashboardRoute) {
    return (
      <div className="fixed top-0 w-full z-50 bg-white border-b shadow-md px-6 py-4 mt-0 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search content or modules..."
          className="px-4 py-2 w-1/3 rounded-md border focus:outline-none"
        />
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
          <button
            onClick={handleAvatarClick}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
          >
              {user?.name?.[0]?.toUpperCase() || '👤'}
          </button>
          </div>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10"
            >
              <div className="p-4 border-b">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Link 
                to="/" 
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-home mr-2"></i> Home
              </Link>
              <Link 
                to="/dashboard/home" 
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
              </Link>
              <Link 
                to="/dashboard/learning-path" 
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-road mr-2"></i> My Learning Path
              </Link>
              <Link 
                to="/dashboard/profile" 
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-user mr-2"></i> My Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 border-t"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Default Homepage Navbar
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 px-10 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white'
      }`}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="text-2xl font-extrabold text-gray-900 cursor-pointer select-none"
        onClick={() => navigate('/learn-more')}
      >
        Adhirath
      </motion.div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-10 text-gray-700 font-semibold">
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleNavClick('home')} className="hover:text-blue-600">Home</motion.button>
        {isLoggedIn && (
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            onClick={() => navigate('/dashboard/home')} 
            className="hover:text-blue-600"
          >
            Dashboard
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleNavClick('LearningModules')} className="hover:text-blue-600">Modules</motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleNavClick('features')} className="hover:text-blue-600">Features</motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleNavClick('testimonials')} className="hover:text-blue-600">User Reviews</motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleNavClick('faq')} className="hover:text-blue-600">FAQ</motion.button>
      </div>

      {/* Login / Avatar Dropdown */}
      <div className="flex items-center space-x-4 relative">
        {!isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-600 transition duration-300"
            onClick={() => navigate('/login')}
          >
            Login
          </motion.button>
        ) : (
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            <button
              onClick={handleAvatarClick}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
                {user?.name?.[0]?.toUpperCase() || '👤'}
            </button>
            </div>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10"
              >
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Link 
                  to="/" 
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-home mr-2"></i> Home
                </Link>
                <Link 
                  to="/dashboard/home" 
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
                </Link>
                <Link 
                  to="/dashboard/learning-path" 
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-road mr-2"></i> My Learning Path
                </Link>
                <Link 
                  to="/dashboard/profile" 
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700" 
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-user mr-2"></i> My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 border-t"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;