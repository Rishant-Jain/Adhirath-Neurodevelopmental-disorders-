const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Submit a new assessment
router.post('/submit', auth, async (req, res) => {
  try {
    const { questions, pathwayRecommendations } = req.body;
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: 'Invalid assessment data',
        error: 'Questions array is required'
      });
    }

    if (!pathwayRecommendations || !Array.isArray(pathwayRecommendations)) {
      return res.status(400).json({
        message: 'Invalid assessment data',
        error: 'Pathway recommendations are required'
      });
    }

    // Calculate total score (you can modify this based on your scoring logic)
    const totalScore = questions.length;

    const assessment = new Assessment({
      userId: req.user.id, // This comes from the auth middleware
      questions: questions,
      totalScore: totalScore
    });

    await assessment.save();

    // Update user's pathway recommendations
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User does not exist'
      });
    }

    // Update user's pathway recommendations and assessment reference
    user.pathwayRecommendations = pathwayRecommendations;
    user.assessments.push(assessment._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      assessment: {
        id: assessment._id,
        totalScore: assessment.totalScore,
        completedAt: assessment.completedAt,
        pathwayRecommendations: pathwayRecommendations
      }
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      message: 'Error submitting assessment',
      error: error.message
    });
  }
});

// Get user's assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id })
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      assessments: assessments
    });

  } catch (error) {
    console.error('Assessment history error:', error);
    res.status(500).json({
      message: 'Error fetching assessment history',
      error: error.message
    });
  }
});

// Get specific assessment details
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        message: 'Assessment not found',
        error: 'Assessment does not exist or you do not have access'
      });
    }

    res.json({
      success: true,
      assessment: assessment
    });

  } catch (error) {
    console.error('Assessment details error:', error);
    res.status(500).json({
      message: 'Error fetching assessment details',
      error: error.message
    });
  }
});

module.exports = router; 