const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

/**
 * Generate JWT token
 * @param {string} userId - User ID to sign the token with
 * @returns {string} JWT token
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d', // 90 days
  });
};

/**
 * Create and send token in cookie and response
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000 // 90 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict',
  };

  // Send cookie with token
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

/**
 * Get user from JWT token
 * @param {string} token - JWT token
 * @param {boolean} checkUserExists - Whether to check if user still exists
 * @returns {Promise<Object>} User document
 */
const getUserFromToken = async (token, checkUserExists = true) => {
  try {
    // 1) Verify token
    const decoded = await verifyToken(token);

    // 2) Check if user still exists
    if (checkUserExists) {
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        throw new Error('The user belonging to this token no longer exists.');
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        throw new Error('User recently changed password! Please log in again.');
      }

      return currentUser;
    }

    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Protect routes - verify user is authenticated
 */
const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token
    const decoded = await verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password! Please log in again.',
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser; // For templates if needed
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or token expired. Please log in again.',
    });
  }
};

/**
 * Restrict route to specific roles
 * @param {...string} roles - Allowed user roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = {
  signToken,
  createSendToken,
  verifyToken,
  getUserFromToken,
  protect,
  restrictTo,
};
