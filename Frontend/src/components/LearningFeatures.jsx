import React from 'react';

const features = [
  {
    title: "Personalized AI Learning",
    description:
      "Tailored AI-powered learning paths that adapt to each child’s unique cognitive and motor needs, supporting individualized growth.",
    icon: "🧠",
  },
  {
    title: "2D Interactive Modules",
    description:
      "Engaging videos, puzzles, games, and activities designed to enhance cognitive functions and motor coordination through play-based learning.",
    icon: "🎮",
  },
  {
    title: "Speech & Social Skill Therapy",
    description:
      "Interactive exercises to boost language development, verbal expression, and social interaction with real-time adaptive feedback.",
    icon: "🗣️",
  },
];

const LearningFeatures = () => {
  return (
    <section
      className="min-h-screen bg-[#f0f7ff] py-24 px-6 flex flex-col items-center text-center"
      id="features"
    >
      <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
        Adhirath Project - Key Features
      </h2>
      <p className="text-gray-600 max-w-2xl mb-12 text-lg">
        Designed for children with Autism Spectrum Disorder (ASD) and Intellectual Disability (ID), Adhirath combines AI and 2D interactive modules to develop cognitive, motor, and social skills. Built for professional psychiatrists guiding structured, engaging learning.
      </p>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-xl text-left transform hover:scale-105 transition-transform duration-300"
          >
            <span className="text-4xl mb-4 block">{item.icon}</span>
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <button className="text-[#2563eb] font-medium hover:underline transition duration-200">
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningFeatures;
