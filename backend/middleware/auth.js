const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No authentication token, access denied',
        error: 'Authorization token missing'
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    
   
    req.user = {
      id: decoded.id
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      message: 'Token is not valid',
      error: error.message
    });
  }
}; 