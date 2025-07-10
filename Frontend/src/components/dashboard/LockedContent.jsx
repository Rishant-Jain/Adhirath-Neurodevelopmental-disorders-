import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const LockedContent = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Lock className="w-16 h-16 text-gray-400" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800">Content Locked</h2>
      
      <p className="text-gray-600 max-w-md">
        Complete your personalized assessment to unlock your unique learning pathway. 
        This helps us understand your needs and create a customized experience just for you!
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/assessment')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Take Assessment Now
        </button>
        
        <button
          onClick={() => navigate('/welcome')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Return to Welcome Page
        </button>
      </div>
    </motion.div>
  );
};

export default LockedContent; 