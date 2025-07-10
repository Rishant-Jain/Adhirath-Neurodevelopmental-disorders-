// src/components/GiveReviewPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';

function GiveReviewPage() {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !feedback || rating === 0) {
      setError('Please fill all fields and select a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          feedback,
          rating
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      alert('Thank you for your feedback!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 mt-24">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          Share Your Feedback
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
            rows={5}
            disabled={isSubmitting}
          />
          <div>
            <label className="mr-3 font-semibold text-gray-800">Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`text-4xl cursor-pointer select-none transition-colors ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-400'
                }`}
                aria-label={`${star} Star`}
                disabled={isSubmitting}
              >
                ★
              </motion.button>
            ))}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gray-900 text-white font-bold py-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default GiveReviewPage;
