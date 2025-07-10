// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './utils/AuthContext';

// Your existing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LearningModules from './components/LearningModules';
import LearningFeatures from './components/LearningFeatures';
import FAQ from './components/FAQ';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import LearnMore from './components/LearnMore';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Testimonials from './components/Testimonials';
import GiveReviewPage from './components/GiveReviewPage';
import Questionnaire from './components/Questionnaire';
import Welcome from './components/Welcome';
import Pathway from './components/Pathway';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AssessmentResults from './components/AssessmentResults';

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Arjun',
      rating: 5,
      feedback: 'Amazing app! Helped me a lot.',
    },
  ]);

  const addReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Determine if the current route is part of the new dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Protected Route Component
  const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    if (!isLoggedIn) {
      // Save the attempted URL
      sessionStorage.setItem('redirectUrl', location.pathname);
      return <Navigate to={redirectTo} replace />;
    }
    return children;
  };

  // Public Route Component (redirects to dashboard if logged in)
  const PublicRoute = ({ children }) => {
    if (isLoggedIn) {
      // Check if there's a saved redirect URL
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
      sessionStorage.removeItem('redirectUrl'); // Clear it after use
      return <Navigate to={redirectUrl} replace />;
    }
    return children;
  };

  return (
    <div className="w-full min-h-screen font-inter bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* Show Navbar if not on dashboard routes */}
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <main className="flex flex-col items-center">
              <section id="home" className="w-full max-w-6xl px-10 py-20">
                <Hero />
              </section>
              <section id="LearningModules" className="w-full max-w-6xl px-5 py-10">
                <LearningModules />
              </section>
              <section id="features" className="w-full max-w-6xl px-5 py-10">
                <LearningFeatures />
              </section>
              <section id="testimonials" className="w-full max-w-6xl px-5 py-10">
                <Testimonials />
              </section>
              <section id="faq" className="w-full max-w-6xl px-5 py-10">
                <FAQ />
              </section>
            </main>
          }
        />
        
        {/* Auth Routes */}
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        
        {/* Public Information Routes */}
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/learning-features" element={<LearningFeatures />} />
        <Route path="/give-review" element={<GiveReviewPage />} />
        
        {/* Protected Routes */}
        <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
        <Route path="/assessment-results" element={<ProtectedRoute><AssessmentResults /></ProtectedRoute>} />
        <Route path="/learning-modules" element={<ProtectedRoute><LearningModules /></ProtectedRoute>} />
        <Route path="/pathway" element={<ProtectedRoute><Pathway /></ProtectedRoute>} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Show Footer only if not a dashboard route */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default App;