// Utility function for handling authentication-related operations

export const handleLogout = async (navigate, setIsLoggedIn = null) => {
  try {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any other user-related data
    localStorage.removeItem('pathwayProgress');
    localStorage.removeItem('videoProgress');
    
    // Update login state if the setter is provided
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }

    // Show success message
    const message = "You have been successfully logged out!";
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Logout Successful', { body: message });
    }

    // Ensure we're redirecting to the home page
    setTimeout(() => {
      navigate('/');
    }, 100);

  } catch (error) {
    console.error('Error during logout:', error);
    // Still attempt to redirect even if there's an error
    navigate('/');
  }
};

// Function to check if user is logged in
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}; 