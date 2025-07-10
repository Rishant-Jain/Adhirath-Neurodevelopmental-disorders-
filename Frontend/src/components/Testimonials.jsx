// src/components/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        User Reviews
      </motion.h2>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div
          className="flex space-x-6 px-4"
          drag="x"
          dragConstraints={{ left: -((reviews.length - 1) * 280), right: 0 }}
          dragElastic={0.2}
          whileTap={{ cursor: 'grabbing' }}
        >
          {reviews.map(({ _id, name, rating, feedback, createdAt }) => (
            <motion.div
              key={_id}
              className="min-w-[280px] bg-white border border-gray-300 rounded-xl shadow-lg p-6 cursor-grab hover:shadow-2xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="font-semibold text-lg mb-2 text-gray-900">{name}</p>
              <p className="text-yellow-400 mb-3 text-xl">
                {'★'.repeat(rating)}
                {'☆'.repeat(5 - rating)}
              </p>
              <p className="text-gray-700">{feedback}</p>
              <p className="text-sm text-gray-500 mt-4">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Add Review Button */}
      <div className="flex justify-center mt-8">
        <motion.a
          href="/give-review"
          className="bg-gradient-to-r from-gray-800 to-gray-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:from-gray-700 hover:to-gray-300 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Share Your Feedback
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Testimonials;
