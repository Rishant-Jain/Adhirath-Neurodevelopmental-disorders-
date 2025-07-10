// LearnMore.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LearnMore = () => {
  return (
    <motion.section
      className="min-h-screen bg-yellow-50 px-6 py-20 flex items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl bg-white rounded-xl shadow-lg p-10 space-y-6">
        <motion.h2
          className="text-3xl font-extrabold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          About the Adhirath Project
        </motion.h2>
        <motion.p
          className="text-gray-700 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The <strong>Adhirath Project</strong> is designed to enhance cognitive, motor, and social skills in children with Autism Spectrum Disorder (ASD) and Intellectual Disability (ID).
          It utilizes content-based learning tools integrated with <strong>advanced artificial intelligence</strong>.
          The core of the system includes engaging <strong>2D interactive modules</strong> like videos, games, puzzles, and activities that target cognitive development.
        </motion.p>
        <motion.p
          className="text-gray-700 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Designed for <strong>professional psychiatrists</strong>, this tool supports structured and personalized learning experiences for children with developmental challenges. Its simple and intuitive interface ensures it can be used effectively by both caregivers and professionals.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default LearnMore;
