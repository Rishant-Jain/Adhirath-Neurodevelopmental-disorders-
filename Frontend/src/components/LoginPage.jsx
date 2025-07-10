// components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import kidImg from '../assets/kid.png';
import awardGif from '../assets/award.gif';
import rocketGif from '../assets/rocket.gif';
import supportGif from '../assets/support.gif';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    if (isLoggedIn) {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/welcome';
      sessionStorage.removeItem('redirectUrl');
      navigate(redirectUrl);
    }
  }, [navigate, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill all fields!');
      return;
    }

    try {
      const result = await login({ email, password });
      if (!result.success) {
        setError(result.error);
        return;
      }

      // Navigate to the saved URL or welcome page
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/welcome';
      sessionStorage.removeItem('redirectUrl');
      navigate(redirectUrl);
    } catch (err) {
      console.error("Login error:", err);
      setError('Server error or wrong credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      {/* Floating Images */}
      <motion.img
        src={rocketGif}
        alt="Rocket"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-20 h-20 absolute left-40 top-1/2 -translate-y-1/2"
      />
      <motion.img
        src={supportGif}
        alt="Support"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-20 h-20 absolute right-40 top-1/4 -translate-y-1/2"
      />
      <motion.img
        src={kidImg}
        alt="Kid"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-64 h-64 absolute right-10 top-1/2 -translate-y-1/2"
      />

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 w-80 mt-24 z-10"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Award Gif */}
        <div className="flex justify-center mb-4">
          <motion.img
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            src={awardGif}
            alt="Award"
            className="w-16 h-16"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Regular Login Form */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
        >
          Login
        </button>

        {/* Signup Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default LoginPage;
