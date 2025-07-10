import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, LayoutDashboard, ClipboardCheck } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const needsAssessment = !user.pathwayRecommendations || user.pathwayRecommendations.length === 0;

  const handleAssessmentClick = () => {
    navigate("/questionnaire");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard/home");
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
          <div className="w-12 h-12 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-2xl font-bold">
            🧠
          </div>
          <h1 className="text-4xl font-extrabold text-violet-700">Adhirath</h1>
        </div>
        <p className="mt-2 text-lg text-gray-600 font-medium">
          Enhancing Learning Through Interactive Play
        </p>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          A specialized learning platform designed to improve cognitive, motor, and social skills for
          children with ASD and ID through engaging 2D interactive activities.
        </p>
      </motion.div>

      {/* Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl border border-pink-100"
      >
        <div className="flex items-center justify-center text-pink-500 mb-2">
          <Heart size={24} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Learning Journey!</h2>
        <p className="text-gray-600 mt-2">
          {needsAssessment 
            ? "Start with our assessment to create a personalized learning pathway tailored just for you."
            : "Continue your personalized learning journey from where you left off."}
        </p>
        <div className="flex justify-center gap-4 mt-6">
          {needsAssessment && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAssessmentClick}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-md transition flex items-center gap-2"
            >
              <ClipboardCheck size={20} />
              Take Assessment
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDashboardClick}
            className={`px-6 py-3 bg-gradient-to-r ${needsAssessment ? 'from-blue-500 to-indigo-500' : 'from-pink-500 to-purple-500'} text-white font-semibold rounded-full shadow-md transition flex items-center gap-2`}
          >
            <LayoutDashboard size={20} />
            Go to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;