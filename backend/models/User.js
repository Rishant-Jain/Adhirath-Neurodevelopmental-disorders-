const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: 40
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false
  },
  profilePicture: {
    type: String
  },
  age: {
    type: Number,
    min: 0
  },
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic']
  },
  interests: [{
    type: String
  }],
  assessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  pathwayRecommendations: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    default: 'Level 1'
  },
  xp: {
    type: Number,
    default: 0
  },
  totalXp: {
    type: Number,
    default: 1000
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  },
  achievements: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    points: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['learning', 'social', 'creative', 'milestone']
    },
    progress: {
      current: {
        type: Number,
        default: 0
      },
      required: {
        type: Number,
        required: true
      }
    },
    earnedAt: Date,
    icon: String
  }],
  stats: {
    totalActivitiesCompleted: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
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
    favoriteActivity: {
      type: String,
      default: 'Not Set'
    }
  },
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = this.streak.lastActivityDate;
  
  if (!lastActivity) {
    this.streak.current = 1;
  } else {
    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Next day, increment streak
      this.streak.current += 1;
    } else {
      // Streak broken
      this.streak.current = 1;
    }
  }
  
  // Update longest streak if current is higher
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  this.streak.lastActivityDate = today;
};

// Update stats
userSchema.methods.updateStats = function(activityType, category) {
  this.stats.totalActivitiesCompleted += 1;
  
  if (category && this.stats.categoryProgress[category]) {
    this.stats.categoryProgress[category].completed += 1;
  }
  
  // Update favorite activity based on most completed category
  const categories = Object.keys(this.stats.categoryProgress);
  let maxCompleted = 0;
  let favoriteCategory = 'Not Set';
  
  categories.forEach(cat => {
    const completed = this.stats.categoryProgress[cat].completed;
    if (completed > maxCompleted) {
      maxCompleted = completed;
      favoriteCategory = cat;
    }
  });
  
  this.stats.favoriteActivity = favoriteCategory;
};

module.exports = mongoose.model('User', userSchema); 