const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper function to migrate existing records
const migrateExistingRecords = async (progress) => {
  // Migrate video progress records
  progress.videoProgress = progress.videoProgress.map(video => ({
    ...video,
    category: video.category || 'brainPower' // Default to brainPower if no category
  }));

  // Migrate pathway progress records
  progress.pathwayProgress = progress.pathwayProgress.map(pathway => ({
    ...pathway,
    pathwayId: pathway.pathwayId || pathway.id || pathway.title, // Use pathwayId, id, or title
    category: pathway.category || 'brainPower', // Default to brainPower if no category
    totalActivities: pathway.totalActivities || 1 // Default to 1 if no totalActivities
  }));

  // Remove any duplicate pathway progress entries
  const seen = new Set();
  progress.pathwayProgress = progress.pathwayProgress.filter(pathway => {
    const duplicate = seen.has(pathway.pathwayId);
    seen.add(pathway.pathwayId);
    return !duplicate;
  });

  return progress;
};

// Get user's progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    } else {
      // Migrate existing records if needed
      progress = await migrateExistingRecords(progress);
      await progress.save();
    }

    // Calculate today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayProgress = progress.dailyProgress.find(entry => 
      entry.date && new Date(entry.date).getTime() === today.getTime()
    ) || {
      activitiesCompleted: 0,
      categories: {
        brainPower: 0,
        moveAndPlay: 0,
        socialSkills: 0
      }
    };

    // Calculate video completion stats
    const totalVideos = progress.videoProgress.length;
    const completedVideos = progress.videoProgress.filter(v => v.completed).length;
    const videoCompletionRate = totalVideos ? Math.round((completedVideos / totalVideos) * 100) : 0;

    // Calculate category progress percentages
    const categoryPercentages = {
      brainPower: progress.categoryProgress.brainPower.total ? 
        Math.round((progress.categoryProgress.brainPower.completed / progress.categoryProgress.brainPower.total) * 100) : 0,
      moveAndPlay: progress.categoryProgress.moveAndPlay.total ? 
        Math.round((progress.categoryProgress.moveAndPlay.completed / progress.categoryProgress.moveAndPlay.total) * 100) : 0,
      socialSkills: progress.categoryProgress.socialSkills.total ? 
        Math.round((progress.categoryProgress.socialSkills.completed / progress.categoryProgress.socialSkills.total) * 100) : 0
    };

    // Get achievement stats
    const earnedAchievements = progress.achievements.filter(a => a.earnedAt).length;
    const totalPoints = progress.achievements.reduce((sum, a) => sum + (a.earnedAt ? a.points : 0), 0);

    // Structure the response data
    const responseData = {
      success: true,
      progress: {
        videoProgress: progress.videoProgress,
        pathwayProgress: progress.pathwayProgress,
        dailyProgress: progress.dailyProgress,
        streakData: progress.streakData,
        achievements: progress.achievements,
        categoryProgress: progress.categoryProgress,
        overallProgress: progress.overallProgress,
        totalPoints: progress.totalPoints,
        stats: {
          todayProgress: {
            activitiesCompleted: todayProgress.activitiesCompleted,
            categories: todayProgress.categories
          },
          categoryPercentages,
          videoStats: {
            total: totalVideos,
            completed: completedVideos,
            completionRate: videoCompletionRate
          },
          achievements: {
            earned: earnedAchievements,
            totalPoints
          }
        }
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      message: 'Error fetching progress',
      error: error.message
    });
  }
});

// Update video progress
router.post('/video', auth, async (req, res) => {
  try {
    const { videoId, completed, watchedDuration, category } = req.body;
    console.log('Received video progress update:', { videoId, completed, watchedDuration, category });

    if (!videoId || !category) {
      console.log('Missing required fields:', { videoId, category });
      return res.status(400).json({
        message: 'Video ID and category are required'
      });
    }

    // Normalize video ID
    const normalizedVideoId = videoId.trim();

    let progress = await Progress.findOne({ userId: req.user.id });
    console.log('Found user progress:', progress ? 'yes' : 'no');
    
    if (!progress) {
      console.log('Creating new progress record for user');
      progress = await Progress.create({ userId: req.user.id });
    } else {
      console.log('Migrating existing records');
      progress = await migrateExistingRecords(progress);
    }

    // Update video progress
    const videoProgressIndex = progress.videoProgress.findIndex(v => v.videoId === normalizedVideoId);
    const wasAlreadyCompleted = videoProgressIndex > -1 && progress.videoProgress[videoProgressIndex].completed;
    console.log('Video progress status:', { videoProgressIndex, wasAlreadyCompleted });

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if this video was completed today
    const wasCompletedToday = videoProgressIndex > -1 && 
      progress.videoProgress[videoProgressIndex].lastWatched && 
      new Date(progress.videoProgress[videoProgressIndex].lastWatched).setHours(0, 0, 0, 0) === today.getTime();

    // Handle video progress update
    if (videoProgressIndex > -1) {
      console.log('Updating existing video progress');
      const existingProgress = progress.videoProgress[videoProgressIndex];
      progress.videoProgress[videoProgressIndex] = {
        videoId: normalizedVideoId,
        completed: completed,
        watchedDuration: Math.max(watchedDuration, existingProgress.watchedDuration || 0),
        lastWatched: new Date(),
        category
      };
    } else {
      console.log('Adding new video progress');
      progress.videoProgress.push({
        videoId: normalizedVideoId,
        completed: completed,
        watchedDuration,
        lastWatched: new Date(),
        category
      });
    }

    // Update category progress only if video state is changing
    if (completed !== wasAlreadyCompleted) {
      console.log('Updating category progress and streak');
      if (!wasCompletedToday) {
        // Only update daily progress if this is the first time completing today
        progress.updateDailyProgress(category);
      }
      progress.updateStreak();
    }

    // Calculate and set the overall progress
    progress.overallProgress = progress.calculateOverallProgress();
    
    // Save the updated progress
    console.log('Saving updated progress');
    await progress.save();

    // Update user XP if video was completed
    if (completed && !wasAlreadyCompleted) {
      console.log('Updating user XP');
      const user = await User.findById(req.user.id);
      user.xp += 10; // Award XP for completing a video
      
      if (user.xp >= user.totalXp) {
        const currentLevel = parseInt(user.level.split(' ')[1]);
        user.level = `Level ${currentLevel + 1}`;
        user.totalXp *= 1.5; // Increase XP requirement for next level
      }
      
      await user.save();
    }

    res.json({
      success: true,
      progress: progress.toObject()
    });
  } catch (error) {
    console.error('Update video progress error:', error);
    res.status(500).json({
      message: 'Error updating video progress',
      error: error.message
    });
  }
});

// Update pathway progress
router.post('/pathway', auth, async (req, res) => {
  try {
    const { pathwayId, completed, progress: pathwayProgress, category, totalActivities } = req.body;

    if (!pathwayId || !category || typeof totalActivities !== 'number') {
      return res.status(400).json({
        message: 'Pathway ID, category, and total activities are required'
      });
    }

    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    } else {
      // Migrate existing records if needed
      progress = await migrateExistingRecords(progress);
    }

    // Update pathway progress
    const pathwayIndex = progress.pathwayProgress.findIndex(p => 
      p.pathwayId === pathwayId || p.id === pathwayId || p.title === pathwayId
    );

    if (pathwayIndex > -1) {
      progress.pathwayProgress[pathwayIndex] = {
        ...progress.pathwayProgress[pathwayIndex],
        pathwayId, // Ensure pathwayId is set
        completed,
        progress: pathwayProgress,
        category,
        totalActivities,
        lastUpdated: new Date()
      };
    } else {
      progress.pathwayProgress.push({
        pathwayId,
        completed,
        progress: pathwayProgress,
        category,
        totalActivities,
        startedAt: new Date(),
        lastUpdated: new Date()
      });
    }

    // Update category totals if this is a new pathway
    if (pathwayIndex === -1) {
      if (category === 'brainPower') {
        progress.categoryProgress.brainPower.total += totalActivities;
      } else if (category === 'moveAndPlay') {
        progress.categoryProgress.moveAndPlay.total += totalActivities;
      } else if (category === 'socialSkills') {
        progress.categoryProgress.socialSkills.total += totalActivities;
      }
    }

    // Recalculate overall progress
    progress.calculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      progress: progress.toObject()
    });
  } catch (error) {
    console.error('Update pathway progress error:', error);
    res.status(500).json({
      message: 'Error updating pathway progress',
      error: error.message
    });
  }
});

// Save quiz result
router.post('/quiz', auth, async (req, res) => {
  try {
    const { quizId, score, maxScore } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    progress.quizResults.push({
      quizId,
      score,
      maxScore,
      completedAt: new Date()
    });

    // Update user XP based on quiz performance
    const user = await User.findById(req.user.id);
    const xpEarned = Math.round((score / maxScore) * 100); // Award XP based on performance
    user.xp += xpEarned;
    
    if (user.xp >= user.totalXp) {
      user.level = `Level ${parseInt(user.level.split(' ')[1]) + 1}`;
      user.totalXp *= 1.5; // Increase XP requirement for next level
    }
    
    await user.save();
    await progress.save();

    res.json({
      success: true,
      quizResults: progress.quizResults
    });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({
      message: 'Error saving quiz result',
      error: error.message
    });
  }
});

// Update user preferences
router.post('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.user.id);
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      message: 'Error updating preferences',
      error: error.message
    });
  }
});

// Update achievement progress
router.post('/achievement', auth, async (req, res) => {
  try {
    const { achievementId, progress: achievementProgress } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    const achievement = progress.achievements.find(a => a.id === achievementId);
    if (!achievement) {
      return res.status(404).json({
        message: 'Achievement not found'
      });
    }

    // Update achievement progress
    achievement.progress.current = achievementProgress;

    // Check if achievement is completed
    if (!achievement.earnedAt && achievement.progress.current >= achievement.progress.required) {
      achievement.earnedAt = new Date();
      progress.totalPoints += achievement.points;

      // Update user XP for earning achievement
      const user = await User.findById(req.user.id);
      user.xp += 100;
      if (user.xp >= user.totalXp) {
        const currentLevel = parseInt(user.level.split(' ')[1]);
        user.level = `Level ${currentLevel + 1}`;
        user.totalXp *= 1.5;
      }
      await user.save();
    }

    await progress.save();

    res.json({
      success: true,
      achievements: progress.achievements
    });
  } catch (error) {
    console.error('Update achievement progress error:', error);
    res.status(500).json({
      message: 'Error updating achievement progress',
      error: error.message
    });
  }
});

module.exports = router; 