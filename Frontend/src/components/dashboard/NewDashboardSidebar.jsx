// src/components/NewDashboardSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, User, Award, ChartLine, LogOut, Layout } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import './NewDashboardSidebar.css';

const NewDashboardSidebar = ({ isOpen, toggleSidebar, userInfo }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navLinks = [
    { path: '/', icon: <Layout size={20} />, label: 'Home Page' },
    { path: '/dashboard/home', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/dashboard/learning-path', icon: <BookOpen size={20} />, label: 'Learning Path' },
    { path: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
    // { path: '/dashboard/my-progress', icon: <ChartLine size={20} />, label: 'Progress' },
    // { path: '/dashboard/achievements', icon: <Award size={20} />, label: 'Achievements' },
  ];

  const handleLinkClick = () => {
    // On mobile, clicking a link should also close the sidebar
    if (isOpen && window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  // Calculate progress percentage
  const xp = userInfo?.xp || 0;
  const totalXp = userInfo?.totalXp || 100;
  const progressPercentage = Math.min(Math.round((xp / totalXp) * 100), 100);

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* User Info Section */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {userInfo?.childName?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{userInfo?.childName || 'User'}</h2>
            <p className="text-sm text-gray-500">{userInfo?.level}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {xp} / {totalXp} XP
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 px-4 flex-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={() => logout(() => navigate('/'))}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 group"
        >
          <LogOut size={20} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default NewDashboardSidebar;