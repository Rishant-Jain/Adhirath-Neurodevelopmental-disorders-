import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import childImage from '../assets/child.jpg'; // IMPORTANT: Use the cartoon image from the screenshot

const Hero = () => {
  const navigate = useNavigate();

  // Animation variants for orchestrating the left-side text content
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const textItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };
  
  // Animation variants for the right-side image and its decorative elements
  const imageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5, // Start after the text has begun animating
      },
    },
  };
  
  const decorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      
      {/* ===== Impressive Animated Background ===== */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            transform: [
              'translate(20%, -20%) scale(1)',
              'translate(0%, 20%) scale(0.8)',
              'translate(-20%, -20%) scale(1)',
            ],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
          className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            transform: [
              'translate(-20%, 20%) scale(1)',
              'translate(20%, 0%) scale(1.2)',
              'translate(-20%, 20%) scale(1)',
            ],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
        />
      </div>

      {/* The main content now sits on top with a higher z-index */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20 items-center z-10">
        
        {/* === Left Column: Content (with staggered animations) === */}
        <motion.div variants={textContainerVariants} initial="hidden" animate="visible">
          <motion.h1 
            variants={textItemVariants} 
            className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tighter"
          >
            Learning Made{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Fun</span>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-2 left-0 w-full h-[33%] bg-yellow-400 origin-left z-0"
              />
            </span>
            <br />
            for Every Child
          </motion.h1>

          <motion.p variants={textItemVariants} className="mt-6 text-gray-600 text-lg max-w-lg">
            Interactive learning designed for children with neurodevelopmental challenges. Personalized activities to develop cognitive, motor, and social skills.
          </motion.p>
          
          <motion.div variants={textItemVariants} className="mt-8 flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/learn-more')}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Learn More →
            </motion.button>
          </motion.div>
        </motion.div>

        {/* === Right Column: Image with Decorative Elements (with staggered animations) === */}
        <motion.div 
          variants={imageContainerVariants} 
          initial="hidden" 
          animate="visible" 
          className="relative flex justify-center items-center"
        >
          <motion.div variants={decorVariants} className="absolute -top-8 -left-4 w-52 h-52 bg-yellow-400 rounded-full" />
          <motion.div variants={decorVariants} className="absolute -bottom-8 -right-4 w-52 h-40 bg-blue-300 rounded-3xl" />
          
          <motion.div variants={decorVariants} className="relative p-3 bg-white rounded-2xl shadow-xl">
            <img
              src={childImage}
              alt="Cartoon of children playing and learning"
              className="w-full max-w-lg object-cover rounded-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;