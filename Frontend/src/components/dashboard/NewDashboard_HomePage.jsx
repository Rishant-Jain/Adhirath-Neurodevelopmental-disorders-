import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Video, Book, Brain, Star, ChevronRight, ChevronLeft, X, ClipboardCheck } from 'lucide-react';
import './NewDashboard_HomePage.css';
import { getPathwayContent } from '../../data/pathwayContent';
import { ProgressAPI } from '../../utils/progress';
import LockedContent from './LockedContent';
import { motion } from 'framer-motion';

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

// Default thumbnail for videos without valid thumbnails
const DEFAULT_THUMBNAIL = '/assets/default-video-thumbnail.jpg';

// Video Modal Component
const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={`${video.url}?autoplay=1`}
            title={video.title}
            className="w-full h-full rounded-t-lg"
            allowFullScreen
            allow="autoplay"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900">{video.title}</h3>
          <p className="text-gray-600 mt-1">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({ video, onComplete, isCompleted, isUpdating }) => {
  const [localUpdating, setLocalUpdating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const getYouTubeThumbnail = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      console.warn('Invalid YouTube URL:', url);
      return DEFAULT_THUMBNAIL;
    }
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  // Generate a unique video ID if not provided
  const videoId = video.id || extractVideoId(video.url);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent video modal from opening
    if (localUpdating || isUpdating || !videoId) return;
    
    setLocalUpdating(true);
    try {
      // Pass the video ID along with the video object
      const videoWithId = {
        ...video,
        id: videoId
      };
      await onComplete(videoWithId);
    } finally {
      setTimeout(() => {
        setLocalUpdating(false);
      }, 500);
    }
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  const isDisabled = localUpdating || isUpdating || !videoId;
  const showSpinner = localUpdating || isUpdating;

  return (
    <>
      <div className={`video-thumbnail-card ${showSpinner ? 'updating' : ''}`}>
        <div 
          className="thumbnail-wrapper cursor-pointer" 
          onClick={() => setShowVideo(true)}
        >
          <img 
            src={thumbnailError ? DEFAULT_THUMBNAIL : getYouTubeThumbnail(video.url)} 
          alt={video.title} 
          className="video-thumbnail"
            onError={handleThumbnailError}
        />
        <div className="video-duration">
          <Video className="w-3 h-3 text-white" />
        </div>
        {isCompleted && (
          <div className="completion-badge">
            <span>✓</span>
          </div>
        )}
          <div className="play-button-overlay">
            <Video className="w-12 h-12 text-white" />
          </div>
      </div>
      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>
        <button
            onClick={handleClick}
            className={`video-complete-btn ${isCompleted ? 'completed' : ''} ${showSpinner ? 'updating' : ''}`}
            disabled={isDisabled}
          >
            {showSpinner ? (
              <span className="loading-spinner"></span>
            ) : isCompleted ? (
              '✓ Done'
            ) : (
              'Mark Done'
            )}
        </button>
      </div>
    </div>
      {showVideo && (
        <VideoModal video={video} onClose={() => setShowVideo(false)} />
      )}
    </>
  );
};

const PathwaySection = ({ title, description, icon, videos, progress, completedVideos, onVideoComplete, isUpdating, pathwayId }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = React.useRef(null);
  const sectionRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  // Add scrollIntoView function
  const scrollIntoView = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pathway-section" ref={sectionRef} id={`pathway-${pathwayId}`}>
      <div className="pathway-header">
        <div className="pathway-icon-wrapper">
          {icon}
        </div>
        <div className="pathway-info">
          <h2 className="pathway-title">{title}</h2>
          <p className="pathway-description">{description}</p>
          <div className="pathway-progress">
            <div className="progress-text">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="video-scroll-container">
        {videos.length > 3 && (
          <button 
            className="scroll-button left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="videos-wrapper" ref={scrollRef}>
          {videos.map((video, index) => (
            <VideoCard
              key={index}
              video={video}
              isCompleted={completedVideos.has(video.id)}
              onComplete={() => onVideoComplete(video)}
              isUpdating={isUpdating}
            />
          ))}
        </div>

        {videos.length > 3 && (
          <button 
            className="scroll-button right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const NewDashboard_HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathwayRefs = useRef({});
  const [learningPath, setLearningPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(() => {
    // Initialize progress from localStorage if available
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.progress || null;
    }
    return null;
  });
  const [todayProgress, setTodayProgress] = useState({
    activitiesCompleted: 0,
    videosWatched: '0/0'
  });
  const [completedVideos, setCompletedVideos] = useState(() => {
    // Initialize completedVideos from localStorage if available
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return new Set(
        user.progress?.videoProgress
          ?.filter(v => v.completed)
          ?.map(v => v.videoId) || []
      );
    }
    return new Set();
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await ProgressAPI.getProgress();
        setProgress(progressData);
        
        // Set completed videos with null check
        const completed = new Set(
          progressData?.videoProgress
            ?.filter(v => v.completed)
            ?.map(v => v.videoId) || []
        );
        setCompletedVideos(completed);

        // Calculate today's progress
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayData = progressData?.stats?.todayProgress || {
          activitiesCompleted: 0,
          categories: {
            brainPower: 0,
            moveAndPlay: 0,
            socialSkills: 0
          }
        };

        // Calculate total videos watched today
        const totalVideos = progressData?.videoProgress?.length || 0;
        const completedVideos = progressData?.videoProgress?.filter(v => v.completed)?.length || 0;

        setTodayProgress({
          activitiesCompleted: todayData.activitiesCompleted,
          videosWatched: `${completedVideos}/${totalVideos}`
        });

        // Update learning path with fresh progress data
        if (progressData?.pathwayProgress) {
          setLearningPath(prev => prev.map(pathway => {
            const pathwayProgress = progressData.pathwayProgress.find(p => p.pathwayId === pathway.pathwayId);
            return {
              ...pathway,
              progress: pathwayProgress?.progress || pathway.progress || 0
            };
          }));
        }

        // Scroll to selected pathway if provided in location state
        const selectedPathway = location.state?.selectedPathway;
        if (selectedPathway) {
          setTimeout(() => {
            const element = document.getElementById(`pathway-${selectedPathway}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    const loadDashboard = async () => {
      setLoading(true);
      try {
        await fetchProgress();
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const userRecommendations = user.pathwayRecommendations || [];
          
          if (userRecommendations && userRecommendations.length > 0) {
            setHasAssessment(true);
            const pathItems = userRecommendations.map(rec => {
            const content = getPathwayContent(rec);
            const videos = content.content
              .filter(item => item.type === 'video')
              .map(video => ({
                ...video,
                  id: extractVideoId(video.url),
                  category: content.category || 'brainPower'
              }));
              const pathwayProgress = progress?.pathwayProgress?.find(p => p.pathwayId === rec);
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
          } else {
            setHasAssessment(false);
          }
        } else {
          setHasAssessment(false);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setHasAssessment(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadDashboard();

    // Subscribe to progress updates
    const unsubscribe = ProgressAPI.subscribe((updatedProgress) => {
      if (!updatedProgress) return; // Skip if no progress data
      
      setProgress(updatedProgress);
      
      // Update completed videos
      const completed = new Set(
        updatedProgress?.videoProgress
          ?.filter(v => v.completed)
          ?.map(v => v.videoId) || []
      );
      setCompletedVideos(completed);

      // Update learning path progress
      setLearningPath(prev => prev.map(pathway => {
        const pathwayProgress = updatedProgress?.pathwayProgress?.find(p => p.pathwayId === pathway.pathwayId);
        return {
          ...pathway,
          progress: pathwayProgress?.progress || pathway.progress || 0
        };
      }));
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [location.state]);

  const handleVideoComplete = async (video, currentPathway) => {
    // Extract video ID if not already present
    const videoId = video.id || extractVideoId(video.url);
    if (!videoId) {
      console.error('Could not extract video ID from:', video);
      return;
    }

    if (isUpdating) {
      console.log('Already processing an update, please wait...');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Updating video progress:', { video, currentPathway });
      // Get current completion state
      const isCurrentlyCompleted = completedVideos.has(videoId);
      
      // Update video progress
      const updatedProgress = await ProgressAPI.updateVideoProgress(
        videoId,
        !isCurrentlyCompleted, // Toggle the state
        0,
        currentPathway.category
      );

      // Update local state immediately
      const newCompletedVideos = new Set(completedVideos);
      if (!isCurrentlyCompleted) {
        newCompletedVideos.add(videoId);
      } else {
        newCompletedVideos.delete(videoId);
      }
      setCompletedVideos(newCompletedVideos);
      
      // Update pathway progress
      const pathway = learningPath.find(p => p.id === currentPathway.id);
      if (pathway) {
        const totalVideos = pathway.videos.length;
        const completedCount = pathway.videos.filter(v => {
          const vId = v.id || extractVideoId(v.url);
          return vId && newCompletedVideos.has(vId);
        }).length;
        const newProgress = Math.round((completedCount / totalVideos) * 100);

        // Update pathway progress on the server
      await ProgressAPI.updatePathwayProgress(
          pathway.id,
        newProgress === 100,
        newProgress,
          pathway.category,
        totalVideos
      );

        // Get fresh progress data from server
        const freshProgressData = await ProgressAPI.getProgress();
        
        // Update all states with fresh data
        setProgress(freshProgressData);
        
        // Update completed videos with fresh data
        const freshCompletedVideos = new Set(
          freshProgressData?.videoProgress
            ?.filter(v => v.completed)
            ?.map(v => v.videoId) || []
        );
        setCompletedVideos(freshCompletedVideos);

        // Update learning path with fresh data
        setLearningPath(prev => prev.map(p => {
          const pathwayProgress = freshProgressData?.pathwayProgress?.find(pp => pp.pathwayId === p.id);
          return {
        ...p,
            progress: pathwayProgress?.progress || p.progress || 0
          };
        }));

        // Update today's progress with fresh data
        const todayData = freshProgressData?.stats?.todayProgress || {
          activitiesCompleted: 0,
          categories: {
            brainPower: 0,
            moveAndPlay: 0,
            socialSkills: 0
          }
        };

        const totalVideosNew = freshProgressData?.videoProgress?.length || 0;
        const completedVideosNew = freshProgressData?.videoProgress?.filter(v => v.completed)?.length || 0;

        setTodayProgress({
          activitiesCompleted: todayData.activitiesCompleted,
          videosWatched: `${completedVideosNew}/${totalVideosNew}`
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert local state on error
      setCompletedVideos(new Set([...completedVideos]));
    } finally {
      setTimeout(() => {
      setIsUpdating(false);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your personalized dashboard...</p>
      </div>
    );
  }

  if (!hasAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        <div className="text-center max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Learning Journey!</h2>
            <p className="text-gray-600 mb-8">
              To get started, take our quick assessment. This will help us create a personalized learning pathway that's perfect for you!
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/questionnaire')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Take Assessment Now
          </motion.button>
        </div>
      </div>
    );
  }

  const achievementStats = progress?.stats?.achievements || {
    earned: 0,
    totalPoints: 0
  };

  return (
    <div className="new-dashboard-page new-dashboard-home-page">
      <header className="new-dashboard-page-header">
        <span className="new-dashboard-header-icon">🎯</span>
        <div>
          <h1 className="new-dashboard-page-title">Welcome Back!</h1>
          <p className="new-dashboard-page-subtitle">Continue your learning journey</p>
        </div>
      </header>

      <div className="goals-grid-container">
        <div className="goal-card">
          <div className="goal-card-icon-wrapper" style={{ background: '#f0fdf4' }}>
            <Brain className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="goal-card-content">
            <h3 className="goal-card-title">Today's Progress</h3>
            <div className="goal-progress-bar-bg">
              <div 
                className="goal-progress-bar-fill" 
                style={{ 
                  width: `${Math.min((todayProgress.activitiesCompleted / 5) * 100, 100)}%`,
                  background: 'linear-gradient(to right, #22c55e, #16a34a)'
                }}
              />
            </div>
            <p className="goal-card-progress-text">{todayProgress.activitiesCompleted} Activities Completed Today</p>
          </div>
        </div>

        <div className="goal-card">
          <div className="goal-card-icon-wrapper" style={{ background: '#eff6ff' }}>
            <Video className="w-6 h-6 text-blue-500" />
          </div>
          <div className="goal-card-content">
            <h3 className="goal-card-title">Learning Videos</h3>
            <div className="goal-progress-bar-bg">
              <div 
                className="goal-progress-bar-fill" 
                style={{ 
                  width: `${(progress?.videoStats?.completionRate || 0)}%`,
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)'
                }}
              />
            </div>
            <p className="goal-card-progress-text">{todayProgress.videosWatched} Videos Watched</p>
          </div>
          </div>
        </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        <button
          onClick={() => navigate('/dashboard/learning-path')}
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          View All
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      <div className="space-y-6">
        {learningPath.map((pathway, index) => {
          let icon;
          switch (pathway.category) {
            case 'brainPower':
              icon = <Brain className="w-6 h-6 text-purple-600" />;
              break;
            case 'moveAndPlay':
              icon = <Video className="w-6 h-6 text-blue-600" />;
              break;
            case 'socialSkills':
              icon = <Book className="w-6 h-6 text-green-600" />;
              break;
            default:
              icon = <Brain className="w-6 h-6 text-purple-600" />;
          }

          return (
          <PathwaySection
            key={index}
              pathwayId={pathway.pathwayId}
            title={pathway.title}
              description={pathway.description || "Continue your learning journey"}
              icon={icon}
            videos={pathway.videos}
            progress={pathway.progress}
            completedVideos={completedVideos}
            onVideoComplete={(video) => handleVideoComplete(video, pathway)}
            isUpdating={isUpdating}
          />
          );
        })}
      </div>

      {!learningPath.length && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No learning path available yet.</p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default NewDashboard_HomePage;