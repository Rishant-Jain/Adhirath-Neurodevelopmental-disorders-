import React, { useState } from 'react';

const faqs = [
  {
    question: "What is the Adhirath project?",
    answer:
      "Adhirath is an AI-powered learning tool designed to enhance cognitive, motor, and social skills in children with Autism Spectrum Disorder (ASD) and Intellectual Disability (ID). It uses 2D interactive modules like videos, games, puzzles, and activities.",
  },
  {
    question: "Who can use the Adhirath application?",
    answer:
      "The application is intended for professional psychiatrists and therapists who work with children with ASD and ID to provide structured, engaging, and personalized learning experiences.",
  },
  {
    question: "What types of learning modules are included?",
    answer:
      "The system includes 2D interactive modules such as videos, games, puzzles, and various cognitive activities tailored to improve different developmental areas.",
  },

  {
    question: "Is Adhirath suitable for all children with developmental challenges?",
    answer:
      "Adhirath is specifically designed for children with Autism Spectrum Disorder and Intellectual Disability, with content and activities tailored to their unique learning requirements.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section
      id="faq"
      className="min-h-screen px-6 py-16 bg-background flex flex-col justify-center items-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-text mb-10 text-center">
        Frequently Asked Questions
      </h2>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`border border-gray-200 rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.01]
              ${activeIndex === index ? 'bg-white shadow-lg' : 'bg-slate-50'}
              animate-slideUp
            `}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            {/* Question */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-100 hover:bg-slate-200 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 text-gray-700 text-base px-6 ${
                activeIndex === index ? 'max-h-40 py-4' : 'max-h-0 py-0'
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
