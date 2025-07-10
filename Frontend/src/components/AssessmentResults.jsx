import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, LayoutDashboard, BookOpen } from 'lucide-react';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathwayRecommendations = location.state?.pathwayRecommendations || [];

  const handleProceedToDashboard = () => {
    navigate('/dashboard/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 to-pink-50 mt-20 flex flex-col items-center justify-center px-4 text-center">
      {/* Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-2xl">
            <Award size={28} />
          </div>
          <h1 className="text-4xl font-extrabold text-violet-700">Assessment Complete!</h1>
        </div>
        <p className="mt-2 text-lg text-gray-600 font-medium">
          Your Personalized Learning Journey Awaits
        </p>
      </motion.div>

      {/* Results Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-pink-100"
      >
        <div className="flex items-center justify-center text-pink-500 mb-4">
          <BookOpen size={32} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recommended Learning Pathways
        </h2>

        <div className="space-y-4 mb-8">
          {pathwayRecommendations.map((pathway, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-pink-100"
            >
              <p className="text-gray-800 font-medium">{pathway}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-gray-600 mb-8">
          These pathways are carefully tailored to support your child's unique learning style and needs.
          Let's begin this exciting journey of growth and development together!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProceedToDashboard}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-md transition flex items-center gap-2 mx-auto"
        >
          <LayoutDashboard size={20} />
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AssessmentResults; 