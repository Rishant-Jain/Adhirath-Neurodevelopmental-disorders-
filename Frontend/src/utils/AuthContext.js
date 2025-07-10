import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Configure axios defaults
      axios.defaults.baseURL = API_URL;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Verify token and get user data
      const response = await axios.get('/api/users/me');
      
      // Update both state and localStorage
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Configure axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = (onLogoutComplete) => {
    try {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other user-related data
      localStorage.removeItem('pathwayProgress');
      localStorage.removeItem('videoProgress');
      
      // Clear axios defaults
      delete axios.defaults.headers.common['Authorization'];

      setUser(null);
      setIsLoggedIn(false);

      // Show success message
      const message = "You have been successfully logged out!";
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Logout Successful', { body: message });
      }

      // Call the callback if provided
      if (onLogoutComplete) {
        onLogoutComplete();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still attempt to call the callback
      if (onLogoutComplete) {
        onLogoutComplete();
      }
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 