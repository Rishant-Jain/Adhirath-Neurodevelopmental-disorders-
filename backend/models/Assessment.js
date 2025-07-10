const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'Communication',
        'Medical History',
        'Daily Living',
        'Learning Ability',
        'Learning Preferences',
        'Interests',
        'Social Preferences',
        'Demographics'
      ],
      required: true
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema); 