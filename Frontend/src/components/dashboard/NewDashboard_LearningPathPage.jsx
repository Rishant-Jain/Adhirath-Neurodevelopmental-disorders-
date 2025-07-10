import React, { useState, useEffect } from 'react';
import { Book, Brain, Star, MessageSquare } from 'lucide-react';
import './NewDashboard_LearningPathPage.css';
import { useAuth } from '../../utils/AuthContext';
import LockedContent from './LockedContent';
import { useNavigate } from 'react-router-dom';

const pathwayDescriptions = {
  'Adaptive Self-Care Training': {
    description: 'Personalized program focusing on essential daily living skills.',
    icon: <Star className="w-6 h-6 text-blue-500" />,
    category: 'socialSkills',
    activities: [
      'Daily routine practice',
      'Personal hygiene skills',
      'Self-organization tasks',
      'Independent living exercises'
    ]
  },
  'Attention & Behavioral Focus Training': {
    description: 'Activities to enhance focus and behavior regulation.',
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    category: 'brainPower',
    activities: [
      'Concentration exercises',
      'Behavioral management techniques',
      'Focus-building activities',
      'Self-regulation practice'
    ]
  },
  'Auditory Learning Sessions': {
    description: 'Sound-based learning using verbal instruction and music.',
    icon: <Book className="w-6 h-6 text-green-500" />,
    category: 'moveAndPlay',
    activities: [
      'Music therapy sessions',
      'Listening comprehension',
      'Verbal instruction practice',
      'Sound recognition games'
    ]
  },
  'Developmental Support Program': {
    description: 'Support for overall developmental milestones.',
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    category: 'socialSkills',
    activities: [
      'Motor skills development',
      'Cognitive exercises',
      'Emotional development',
      'Social skills practice'
    ]
  },
  'Expressive Practice Sessions': {
    description: 'Activities to improve communication and expression skills.',
    icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
    category: 'socialSkills',
    activities: [
      'Speech exercises',
      'Emotional expression activities',
      'Creative communication tasks',
      'Interactive storytelling'
    ]
  },
  'Generalization Practice': {
    description: 'Exercises to apply learned skills in different contexts.',
    icon: <Brain className="w-6 h-6 text-indigo-500" />,
    category: 'brainPower',
    activities: [
      'Real-world application exercises',
      'Context switching activities',
      'Skill transfer practice',
      'Adaptive learning tasks'
    ]
  },
  'Guided Learning Support': {
    description: 'Structured learning activities with step-by-step guidance.',
    icon: <Book className="w-6 h-6 text-teal-500" />,
    category: 'brainPower',
    activities: [
      'Scaffolded learning exercises',
      'Progressive skill building',
      'Guided practice sessions',
      'Structured problem-solving'
    ]
  },
  'Intensive Intervention Program': {
    description: 'Focused intervention for specific developmental needs.',
    icon: <Star className="w-6 h-6 text-red-500" />,
    category: 'moveAndPlay',
    activities: [
      'Targeted skill development',
      'Intensive practice sessions',
      'Progress monitoring',
      'Specialized exercises'
    ]
  },
  'Social Communication Intervention': {
    description: 'Activities to enhance social interaction and communication.',
    icon: <MessageSquare className="w-6 h-6 text-orange-500" />,
    category: 'socialSkills',
    activities: [
      'Social skills practice',
      'Communication exercises',
      'Interactive group activities',
      'Role-playing scenarios'
    ]
  },
  'Speech Therapy': {
    description: 'Specialized exercises for speech and language development.',
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    category: 'socialSkills',
    activities: [
      'Articulation exercises',
      'Language development activities',
      'Speech fluency practice',
      'Vocal exercises'
    ]
  }
};

const PathwayCard = ({ title, description, icon, activities }) => (
  <div className="pathway-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start space-x-4">
      <div className="pathway-icon p-3 rounded-full bg-gray-50">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Key Activities:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const NewDashboard_LearningPathPage = () => {
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAssessment, setHasAssessment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendedPaths = () => {
      if (!user) return;

      const userRecommendations = user.pathwayRecommendations || [];
      
      if (userRecommendations.length > 0) {
        setHasAssessment(true);
        const pathItems = userRecommendations
          .map(rec => {
            const pathwayInfo = pathwayDescriptions[rec];
            if (!pathwayInfo) {
              console.error(`No pathway info found for: ${rec}`);
              return null;
            }
            return {
              title: rec,
              description: pathwayInfo.description,
              icon: pathwayInfo.icon,
              activities: pathwayInfo.activities
            };
          })
          .filter(Boolean);

        setRecommendedPaths(pathItems);
      } else {
        setHasAssessment(false);
      }
      setLoading(false);
    };

    loadRecommendedPaths();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasAssessment) {
    return <LockedContent />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Pathways</h1>
        <p className="text-gray-600">
          These pathways have been personalized based on your assessment results.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {recommendedPaths.map((pathway, index) => (
          <PathwayCard
            key={index}
            title={pathway.title}
            description={pathway.description}
            icon={pathway.icon}
            activities={pathway.activities}
          />
        ))}
      </div>
    </div>
  );
};

export default NewDashboard_LearningPathPage;