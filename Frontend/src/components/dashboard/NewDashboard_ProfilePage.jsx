import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressAPI } from '../../utils/progress';
import { getPathwayContent } from '../../data/pathwayContent';
import './NewDashboard_ProfilePage.css';

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url) => {
  if (!url) return null;
  try {
    const videoId = url.split('embed/')[1]?.split('?')[0];
    return videoId || null;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
};

// This is the StatCard component that was missing.
const StatCard = ({ icon, value, label, iconClass }) => (
  <div className="profile-stat-card">
    <div className={`profile-stat-icon ${iconClass}`}>{icon}</div>
    <div className="profile-stat-value">{value}</div>
    <div className="profile-stat-label">{label}</div>
  </div>
);

const NewDashboard_ProfilePage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const progressData = await ProgressAPI.getProgress();
        setProgress(progressData);
        
        // Load learning path data from user profile
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const userRecommendations = user.pathwayRecommendations || [];
          
          const pathItems = userRecommendations.map(rec => {
            const content = getPathwayContent(rec);
            const videos = content.content
              .filter(item => item.type === 'video')
              .map(video => ({
                ...video,
                id: video.videoId || extractVideoId(video.url),
                category: content.category || 'brainPower'
              }));
            const pathwayProgress = progressData?.pathwayProgress?.find(p => p.pathwayId === rec);
            return {
              pathwayId: rec,
              id: rec,
              title: rec,
              videos,
              progress: pathwayProgress?.progress || 0,
              category: content.category || 'brainPower'
            };
          });
          setLearningPath(pathItems);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to progress updates
    const unsubscribe = ProgressAPI.subscribe(async (updatedProgress) => {
      setProgress(updatedProgress);
      
      // Update learning path with new progress
      setLearningPath(prev => prev.map(pathway => {
        const pathwayProgress = updatedProgress?.pathwayProgress?.find(p => p.pathwayId === pathway.pathwayId);
        const completedVideos = new Set(
          updatedProgress?.videoProgress
            ?.filter(v => v.completed)
            .map(v => v.videoId)
        );
        
        return {
          ...pathway,
          progress: pathwayProgress?.progress || 0,
          videos: pathway.videos.map(video => ({
            ...video,
            completed: completedVideos.has(video.id)
          }))
        };
      }));
    });

    loadProfile();

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate today's activity count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayProgress = progress?.dailyProgress?.find(day => 
    day.date && new Date(day.date).getTime() === today.getTime()
  );
  const activitiesCompletedToday = todayProgress?.activitiesCompleted || 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Activities Completed Today</h3>
            <p>{activitiesCompletedToday}</p>
          </div>
          <div className="stat-card">
            <h3>Current Streak</h3>
            <p>{progress?.streakData?.currentStreak || 0} days</p>
          </div>
          <div className="stat-card">
            <h3>Overall Progress</h3>
            <p>{progress?.overallProgress || 0}%</p>
          </div>
        </div>
      </div>

      <div className="learning-paths-section">
        <h2>Your Learning Paths</h2>
        <div className="learning-paths-grid">
          {learningPath.map((pathway, index) => (
            <div key={index} className="pathway-card">
              <h3>{pathway.title}</h3>
              <div className="pathway-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${pathway.progress}%` }}
                  />
                </div>
                <span>{pathway.progress}% Complete</span>
              </div>
              <p>{pathway.videos.filter(v => v.completed).length} of {pathway.videos.length} activities completed</p>
            </div>
          ))}
        </div>
      </div>

      <div className="category-progress-section">
        <h2>Category Progress</h2>
        <div className="category-cards">
          <div className="category-card brain-power">
            <h3>Brain Power</h3>
            <p>{progress?.categoryProgress?.brainPower?.completed || 0} activities completed</p>
          </div>
          <div className="category-card move-play">
            <h3>Move & Play</h3>
            <p>{progress?.categoryProgress?.moveAndPlay?.completed || 0} activities completed</p>
          </div>
          <div className="category-card social-skills">
            <h3>Social Skills</h3>
            <p>{progress?.categoryProgress?.socialSkills?.completed || 0} activities completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard_ProfilePage;