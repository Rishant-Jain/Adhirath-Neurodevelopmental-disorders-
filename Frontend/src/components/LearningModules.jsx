import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { getPathwayContent } from '../data/pathwayContent';

const LearningModules = () => {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadModules = () => {
      try {
        // Get user's pathway recommendations
        const userRecommendations = user?.pathwayRecommendations || [];
        
        // Get one video from each pathway
        const pathwayModules = userRecommendations.map(pathway => {
          const content = getPathwayContent(pathway);
          if (!content || !content.content) return null;

          // Get the first video from the pathway
          const video = content.content.find(item => item.type === 'video');
          if (!video) return null;

          // Extract video ID from URL
          const videoId = video.url.split('embed/')[1]?.split('?')[0];
          const thumbnailUrl = videoId ? 
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 
            '/assets/default-video-thumbnail.svg';

          return {
            title: video.title,
            description: video.description,
            age: content.category === 'brainPower' ? 'Brain Power' :
                 content.category === 'moveAndPlay' ? 'Move & Play' :
                 'Social Skills',
            image: thumbnailUrl,
            videoUrl: video.url,
            pathway: pathway
          };
        }).filter(Boolean);

        setModules(pathwayModules);
      } catch (error) {
        console.error('Error loading modules:', error);
      }
    };

    loadModules();
  }, [user]);

  const handleModuleClick = (module) => {
    // Navigate to the dashboard home page with the selected pathway
    navigate('/dashboard/home', {
      state: { selectedPathway: module.pathway }
    });
  };

  return (
    <section className="bg-yellow-50 py-16 px-6 sm:px-12 lg:px-24">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4 drop-shadow-md font-times">
        Your Learning Modules
      </h2>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-12 text-lg font-inter">
        Explore your personalized learning modules with engaging videos and activities designed just for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {modules.map((module, idx) => (
          <article
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-slideUp"
            style={{ animationDelay: `${idx * 0.15}s` }}
            onClick={() => handleModuleClick(module)}
            tabIndex={0}
            aria-label={`Module: ${module.title}, Category: ${module.age}`}
          >
            <div className="relative">
              <img
                src={module.image}
                alt={module.title}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/assets/default-video-thumbnail.svg';
                }}
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-900 font-times">{module.title}</h3>
                <span className="bg-red-200 text-red-700 text-sm font-medium px-3 py-1 rounded-full select-none">
                  {module.age}
                </span>
              </div>
              <p className="text-gray-700 mb-6 font-inter line-clamp-2">{module.description}</p>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Start learning ${module.title}`}
              >
                Start Learning
              </button>
            </div>
          </article>
        ))}
      </div>

      {!modules.length && user?.pathwayRecommendations?.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Take the assessment to get your personalized learning modules!</p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      )}
    </section>
  );
};

export default LearningModules;
