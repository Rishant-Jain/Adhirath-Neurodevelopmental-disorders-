import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, BookOpen } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';

// All CSS styles are now embedded within the component file.
const styles = `
.user-profile-dropdown-container {
  position: relative;
  z-index: 1010; /* Higher than hamburger to ensure dropdown is on top */
}

.user-profile-button {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.user-profile-button:hover {
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.user-profile-avatar {
  font-size: 1.5em;
  line-height: 1;
}

.user-profile-button-name {
  font-weight: 600;
  color: #374151;
  font-size: 0.95em;
}

.user-profile-caret {
  font-size: 0.6em;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.user-profile-button[aria-expanded="true"] .user-profile-caret {
    transform: rotate(180deg);
}

/* Dropdown Menu */
.user-profile-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 220px;
  padding: 8px;
  animation: dropdown-fade-in 0.2s ease-out;
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-user-info {
  padding: 8px 12px;
  margin-bottom: 4px;
}

.dropdown-user-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.05em;
}

.dropdown-user-level {
  font-size: 0.85em;
  color: #6b7280;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  font-size: 0.95em;
  color: #374151;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
}
.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.logout-button {
  color: #ef4444;
  font-weight: 500;
}
.logout-button:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}
`;

const UserProfileDropdown = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(() => navigate('/'));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold">
              {userInfo.childName ? userInfo.childName[0].toUpperCase() : 'U'}
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-gray-700">
              {userInfo.childName || 'User'}
            </div>
            <div className="text-xs text-gray-500">{userInfo.level}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
            <button 
              onClick={() => {
                navigate('/dashboard/profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button 
              onClick={() => {
                navigate('/dashboard/learning-path');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Path
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfileDropdown;