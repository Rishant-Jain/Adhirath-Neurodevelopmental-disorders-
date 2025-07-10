import React, { useState, useEffect } from 'react';
import { ProgressAPI } from '../../utils/progress';
import './NewDashboard_ProgressPage.css'; // CSS for this page

const ProgressCircle = ({ percentage, label, subtext, circleColor }) => {
    const circumference = 2 * Math.PI * 45; // Assuming radius is 45
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-category-card">
            <div className="progress-circle-container">
                <svg className="progress-circle-svg" viewBox="0 0 100 100">
                    <circle className="progress-circle-bg" cx="50" cy="50" r="45" />
                    <circle
                        className="progress-circle-fg"
                        cx="50" cy="50" r="45"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ stroke: circleColor }}
                    />
                </svg>
                <div className="progress-circle-text">{percentage}%</div>
            </div>
            <h3 className="progress-category-label">{label}</h3>
            <p className="progress-category-subtext">{subtext}</p>
        </div>
    );
};

const NewDashboard_ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    level: '',
    xp: 0,
    totalXp: 0
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Load user info from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserInfo({
            level: user.level || 'Level 1',
            xp: user.xp || 0,
            totalXp: user.totalXp || 100
          });
        }

        // Load progress data
        const progressData = await ProgressAPI.getProgress();
        setProgress(progressData);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadProgress();

    // Subscribe to progress updates
    const unsubscribe = ProgressAPI.subscribe((updatedProgress) => {
      if (!updatedProgress) return;
      setProgress(updatedProgress);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  // Calculate today's activity count for each category
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayProgress = progress?.dailyProgress?.find(day => 
    day.date && new Date(day.date).getTime() === today.getTime()
  ) || { categories: { brainPower: 0, moveAndPlay: 0, socialSkills: 0 } };

  // Calculate category percentages
  const categoryPercentages = {
    brainPower: progress?.categoryProgress?.brainPower?.total ? 
      Math.round((progress.categoryProgress.brainPower.completed / progress.categoryProgress.brainPower.total) * 100) : 0,
    moveAndPlay: progress?.categoryProgress?.moveAndPlay?.total ? 
      Math.round((progress.categoryProgress.moveAndPlay.completed / progress.categoryProgress.moveAndPlay.total) * 100) : 0,
    socialSkills: progress?.categoryProgress?.socialSkills?.total ? 
      Math.round((progress.categoryProgress.socialSkills.completed / progress.categoryProgress.socialSkills.total) * 100) : 0
  };

  // Calculate total activities completed
  const totalActivitiesCompleted = 
    (progress?.categoryProgress?.brainPower?.completed || 0) +
    (progress?.categoryProgress?.moveAndPlay?.completed || 0) +
    (progress?.categoryProgress?.socialSkills?.completed || 0);

  return (
    <div className="new-dashboard-page new-dashboard-progress-page">
      <header className="new-dashboard-page-header">
        <span className="new-dashboard-header-icon progress-header-icon">🏆</span>
        <div>
          <h1 className="new-dashboard-page-title">My Amazing Progress!</h1>
          <p className="new-dashboard-page-subtitle">Look how much you've grown!</p>
        </div>
      </header>

      <section className="progress-summary-card">
        <h2 className="summary-card-title">🌟 {userInfo.level}!</h2>
        <p className="summary-card-subtitle">You're doing absolutely amazing!</p>
        <div className="summary-card-stats">
          <div className="summary-stat-item">
            <span>{progress?.overallProgress || 0}%</span>
            Overall Progress
          </div>
          <div className="summary-stat-icon">🎯</div>
          <div className="summary-stat-item">
            <span>{totalActivitiesCompleted}</span>
            Activities Completed
          </div>
        </div>
      </section>

      <section className="progress-categories-grid">
        <ProgressCircle 
          percentage={categoryPercentages.brainPower} 
          label="Brain Power" 
          subtext={`${todayProgress.categories.brainPower} completed today`} 
          circleColor="#22c55e" 
        />
        <ProgressCircle 
          percentage={categoryPercentages.moveAndPlay} 
          label="Move & Play" 
          subtext={`${todayProgress.categories.moveAndPlay} completed today`} 
          circleColor="#3b82f6" 
        />
        <ProgressCircle 
          percentage={categoryPercentages.socialSkills} 
          label="Social Skills" 
          subtext={`${todayProgress.categories.socialSkills} completed today`} 
          circleColor="#a855f7" 
        />
      </section>
    </div>
  );
};

export default NewDashboard_ProgressPage;