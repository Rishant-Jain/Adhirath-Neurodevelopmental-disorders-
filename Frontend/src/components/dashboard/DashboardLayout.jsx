import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import NewDashboardSidebar from './NewDashboardSidebar';
import NewDashboard_HomePage from './NewDashboard_HomePage';
import NewDashboard_ProfilePage from './NewDashboard_ProfilePage';
import NewDashboard_LearningPathPage from './NewDashboard_LearningPathPage';
import NewDashboard_ProgressPage from './NewDashboard_ProgressPage';
import NewDashboard_AchievementsPage from './NewDashboard_AchievementsPage';
import UserProfileDropdown from './UserProfileDropdown';
import { Menu } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState({
    appName: "Adhirath",
    childName: '',
    level: 'Level 3 Explorer',
    xp: 750,
    totalXp: 1000,
    age: 8
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserInfo(prevInfo => ({
          ...prevInfo,
          childName: userData.name,
          level: userData.level || prevInfo.level,
          xp: userData.xp || prevInfo.xp,
          totalXp: userData.totalXp || prevInfo.totalXp,
          age: userData.age || prevInfo.age
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-layout-container">
      <NewDashboardSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userInfo={userInfo}
      />
      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <button
            className={`menu-button ${!isMobile ? 'hidden' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <UserProfileDropdown userInfo={userInfo} />
        </header>
        
        <div className="dashboard-content">
          <div className="dashboard-content-container">
            <Routes>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<NewDashboard_HomePage userInfo={userInfo} />} />
              <Route path="profile" element={<NewDashboard_ProfilePage userInfo={userInfo} />} />
              <Route path="learning-path" element={<NewDashboard_LearningPathPage userInfo={userInfo} />} />
              <Route path="my-progress" element={<NewDashboard_ProgressPage userInfo={userInfo} />} />
              <Route path="achievements" element={<NewDashboard_AchievementsPage userInfo={userInfo} />} />
              <Route path="*" element={
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
                  <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;