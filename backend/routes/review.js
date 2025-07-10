const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Submit a new review
router.post('/submit', auth, async (req, res) => {
  try {
    const { name, rating, feedback } = req.body;
    
    if (!name || !rating || !feedback) {
      return res.status(400).json({
        message: 'Invalid review data',
        error: 'All fields are required'
      });
    }

    const review = new Review({
      userId: req.user.id,
      name,
      rating,
      feedback
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      message: 'Error submitting review',
      error: error.message
    });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10); // Limit to latest 10 reviews

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

module.exports = router; 