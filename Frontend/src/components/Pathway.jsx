import React from 'react';
import { motion } from 'framer-motion';
import { Video, Gamepad2, Puzzle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Learning Videos',
    description: 'Interactive educational videos designed for cognitive development',
    icon: <Video size={40} className="text-blue-500" />,
  },
  {
    title: 'Fun Games',
    description: 'Engaging games that improve motor skills and coordination',
    icon: <Gamepad2 size={40} className="text-green-500" />,
  },
  {
    title: 'Smart Puzzles',
    description: 'Problem-solving activities to enhance cognitive abilities',
    icon: <Puzzle size={40} className="text-purple-500" />,
  },
  {
    title: 'Social Activities',
    description: 'Interactive exercises to develop social and communication skills',
    icon: <Users size={40} className="text-pink-500" />,
  },
];

const Pathway = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-6 py-12 bg-pink-50 text-center mt-20 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
      >
        Your Personalized Learning Pathway
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-600 max-w-2xl mb-10"
      >
        Take our comprehensive assessment to receive a customized learning experience. Our AI will analyze your needs
        and abilities to recommend the most suitable learning pathways for you.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center text-center"
          >
            {feature.icon}
            <h3 className="text-lg font-semibold mt-4 text-gray-800">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/learning-path')}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md transition"
        >
          Take Assessment
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/home')}
          className="px-6 py-3 border-2 border-purple-500 text-purple-600 font-semibold rounded-full bg-white shadow-md transition"
        >
          Go to Dashboard
        </motion.button>
      </div>
    </div>
  );
};

export default Pathway;