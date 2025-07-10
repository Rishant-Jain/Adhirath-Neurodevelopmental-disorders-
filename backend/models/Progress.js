const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoProgress: [{
    videoId: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    watchedDuration: {
      type: Number,
      default: 0
    },
    lastWatched: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      required: true,
      enum: ['brainPower', 'moveAndPlay', 'socialSkills']
    }
  }],
  pathwayProgress: [{
    pathwayId: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    activitiesCompleted: {
      type: Number,
      default: 0
    },
    totalActivities: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['brainPower', 'moveAndPlay', 'socialSkills']
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  dailyProgress: [{
    date: {
      type: Date,
      required: true
    },
    activitiesCompleted: {
      type: Number,
      default: 0
    },
    categories: {
      brainPower: { type: Number, default: 0 },
      moveAndPlay: { type: Number, default: 0 },
      socialSkills: { type: Number, default: 0 }
    }
  }],
  streakData: {
    currentStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date
    },
    highestStreak: {
      type: Number,
      default: 0
    }
  },
  achievements: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['learning', 'friends', 'creative', 'special']
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary']
    },
    points: {
      type: Number,
      required: true
    },
    progress: {
      current: Number,
      required: Number
    },
    earnedAt: Date,
    icon: String
  }],
  categoryProgress: {
    brainPower: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    moveAndPlay: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    socialSkills: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate overall progress
progressSchema.methods.calculateOverallProgress = function() {
  // Count videos by category
  const videoCounts = {
    brainPower: 0,
    moveAndPlay: 0,
    socialSkills: 0
  };

  this.videoProgress.forEach(video => {
    if (video.category) {
      videoCounts[video.category]++;
    }
  });

  // Count completed videos by category
  const completedCounts = {
    brainPower: 0,
    moveAndPlay: 0,
    socialSkills: 0
  };

  this.videoProgress.forEach(video => {
    if (video.category && video.completed) {
      completedCounts[video.category]++;
    }
  });

  // Calculate overall progress
  const totalActivities = Object.values(videoCounts).reduce((a, b) => a + b, 0);
  const completedActivities = Object.values(completedCounts).reduce((a, b) => a + b, 0);
  return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
};

// Pre-save middleware to ensure category totals are correct and video IDs are valid
progressSchema.pre('save', function(next) {
  try {
    // Validate and normalize video IDs
    this.videoProgress = this.videoProgress.map(video => {
      if (!video.videoId) {
        throw new Error('Video ID is required');
      }
      // Remove any whitespace and special characters
      video.videoId = video.videoId.trim();
      return video;
    });

    // Update category progress totals
    const categoryTotals = {
      brainPower: { completed: 0, total: 0 },
      moveAndPlay: { completed: 0, total: 0 },
      socialSkills: { completed: 0, total: 0 }
    };

    // Count videos by category
    this.videoProgress.forEach(video => {
      if (video.category) {
        categoryTotals[video.category].total++;
        if (video.completed) {
          categoryTotals[video.category].completed++;
        }
      }
    });

    // Update category progress
    this.categoryProgress = categoryTotals;

    // Update daily progress for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayProgress = this.dailyProgress.find(entry => 
      entry.date && entry.date.getTime() === today.getTime()
    );

    if (!todayProgress) {
      todayProgress = {
        date: today,
        activitiesCompleted: 0,
        categories: {
          brainPower: 0,
          moveAndPlay: 0,
          socialSkills: 0
        }
      };
      this.dailyProgress.push(todayProgress);
    }

    // Count today's completed activities
    const todayCompletedActivities = this.videoProgress.filter(video => {
      return video.completed && 
        video.lastWatched && 
        new Date(video.lastWatched).setHours(0, 0, 0, 0) === today.getTime();
    });

    // Update today's progress
    todayProgress.activitiesCompleted = todayCompletedActivities.length;
    todayProgress.categories = {
      brainPower: todayCompletedActivities.filter(v => v.category === 'brainPower').length,
      moveAndPlay: todayCompletedActivities.filter(v => v.category === 'moveAndPlay').length,
      socialSkills: todayCompletedActivities.filter(v => v.category === 'socialSkills').length
    };

    // Calculate and update overall progress
    this.overallProgress = this.calculateOverallProgress();

    next();
  } catch (error) {
    next(error);
  }
});

// Calculate streak
progressSchema.methods.updateStreak = function(activityDate) {
  try {
    const today = new Date();
    const lastActivity = this.streakData?.lastActivityDate;
    
    // Initialize streakData if it doesn't exist
    if (!this.streakData) {
      this.streakData = {
        currentStreak: 0,
        highestStreak: 0,
        lastActivityDate: null
      };
    }
    
    if (!lastActivity) {
      this.streakData.currentStreak = 1;
    } else {
      const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        // Next day, increment streak
        this.streakData.currentStreak = (this.streakData.currentStreak || 0) + 1;
      } else {
        // Streak broken
        this.streakData.currentStreak = 1;
      }
    }
    
    // Update highest streak if current is higher
    this.streakData.highestStreak = Math.max(
      this.streakData.highestStreak || 0,
      this.streakData.currentStreak || 0
    );
    
    this.streakData.lastActivityDate = today;
  } catch (error) {
    console.error('Error updating streak:', error);
    // Don't throw error, just log it
  }
};

// Update daily progress
progressSchema.methods.updateDailyProgress = function(category) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayProgress = this.dailyProgress.find(day => 
      day.date && day.date.getTime() === today.getTime()
    );

    if (!todayProgress) {
      todayProgress = {
        date: today,
        activitiesCompleted: 0,
        categories: {
          brainPower: 0,
          moveAndPlay: 0,
          socialSkills: 0
        }
      };
      this.dailyProgress.push(todayProgress);
    }

    // Increment activity count for the category
    if (category) {
      todayProgress.categories[category]++;
    }
    todayProgress.activitiesCompleted++;

  } catch (error) {
    console.error('Error updating daily progress:', error);
  }
};

module.exports = mongoose.model('Progress', progressSchema); 