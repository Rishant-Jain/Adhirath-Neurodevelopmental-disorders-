import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Event emitter for progress updates
const progressListeners = new Set();

// Configure axios instance for progress API
const progressApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
progressApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
progressApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ProgressAPI = {
  // Subscribe to progress updates
  subscribe: (callback) => {
    progressListeners.add(callback);
    return () => progressListeners.delete(callback);
  },

  // Notify all listeners of progress update
  notifyProgressUpdate: (progress) => {
    progressListeners.forEach(callback => callback(progress));
  },

  // Get user progress
  getProgress: async () => {
    try {
      const response = await progressApi.get('/api/progress');
      const progress = response.data.progress;
      
      // Notify listeners of fresh data
      ProgressAPI.notifyProgressUpdate(progress);
      return progress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // Update video progress
  updateVideoProgress: async (videoId, completed, watchedDuration, category) => {
    try {
      const response = await progressApi.post('/api/progress/video', {
        videoId,
        completed,
        watchedDuration,
        category
      });
      
      const progress = response.data.progress;
      
      // Notify all listeners of the update
      ProgressAPI.notifyProgressUpdate(progress);
      
      return progress;
    } catch (error) {
      console.error('Error updating video progress:', error);
      throw error;
    }
  },

  // Update pathway progress
  updatePathwayProgress: async (pathwayId, completed, progress, category, totalActivities) => {
    try {
      const response = await progressApi.post('/api/progress/pathway', {
        pathwayId,
        completed,
        progress,
        category,
        totalActivities
      });
      
      const updatedProgress = response.data.progress;
      
      // Notify all listeners of the update
      ProgressAPI.notifyProgressUpdate(updatedProgress);
      
      return updatedProgress;
    } catch (error) {
      console.error('Error updating pathway progress:', error);
      throw error;
    }
  },

  // Get completed videos for a pathway
  getCompletedVideos: async (pathwayId) => {
    try {
      const progress = await ProgressAPI.getProgress();
      return new Set(
        progress?.videoProgress
          ?.filter(v => v.completed)
          ?.map(v => v.videoId) || []
      );
    } catch (error) {
      console.error('Error getting completed videos:', error);
      return new Set();
    }
  },

  // Check if a video is completed
  isVideoCompleted: async (videoId) => {
    try {
      const progress = await ProgressAPI.getProgress();
      return progress?.videoProgress?.some(v => v.videoId === videoId && v.completed) || false;
    } catch (error) {
      console.error('Error checking video completion:', error);
      return false;
    }
  },

  async saveQuizResult(quizId, score, maxScore) {
    const response = await progressApi.post('/api/progress/quiz', {
      quizId,
      score,
      maxScore
    });
    const data = response.data;
    ProgressAPI.notifyProgressUpdate(data);
    return data.quizResults;
  },

  async updatePreferences(preferences) {
    const response = await progressApi.post('/api/progress/preferences', {
      preferences
    });
    const data = response.data;
    return data.preferences;
  },

  async addAchievement(name, description, icon) {
    const response = await progressApi.post('/api/progress/achievement', {
      name,
      description,
      icon
    });
    const data = response.data;
    ProgressAPI.notifyProgressUpdate(data);
    return data.achievements;
  }
}; 