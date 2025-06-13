const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to the request object
 */
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, no token provided'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          error: 'Please log in again'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error during authentication',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      hint: 'Include an Authorization header with a valid JWT token (Bearer token)'
    });
  }
};

module.exports = protect;
