const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user data
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User does not exist'
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      pathwayRecommendations: user.pathwayRecommendations || [],
      level: user.level,
      xp: user.xp,
      totalXp: user.totalXp,
      achievements: user.achievements,
      preferences: user.preferences,
      lastActive: user.lastActive
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      message: 'Error fetching user data',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User does not exist'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'preferences', 'profilePicture'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        pathwayRecommendations: user.pathwayRecommendations || [],
        level: user.level,
        xp: user.xp,
        totalXp: user.totalXp,
        achievements: user.achievements,
        preferences: user.preferences,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
});

module.exports = router; 