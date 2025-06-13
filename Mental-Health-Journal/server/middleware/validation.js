const { validationResult, check } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Wrapper function to handle validation errors
 */
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return next(
      AppError.badRequest('Validation failed', {
        errors: extractedErrors
      })
    );
  };
};

// Common validation rules
const userValidationRules = {
  username: check('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  email: check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  password: check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),

  confirmPassword: check('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
};

// Validation rules for specific routes
const authValidation = {
  // Register validation
  register: validate([
    userValidationRules.username,
    userValidationRules.email,
    userValidationRules.password,
    userValidationRules.confirmPassword
  ]),

  // Login validation
  login: validate([
    userValidationRules.email,
    check('password').notEmpty().withMessage('Password is required')
  ]),

  // Update password validation
  updatePassword: validate([
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    userValidationRules.password,
    userValidationRules.confirmPassword
  ]),

  // Forgot password validation
  forgotPassword: validate([
    userValidationRules.email
  ]),

  // Reset password validation
  resetPassword: validate([
    check('token').notEmpty().withMessage('Token is required'),
    userValidationRules.password,
    userValidationRules.confirmPassword
  ]),

  // Update profile validation
  updateProfile: validate([
    userValidationRules.username.optional(),
    userValidationRules.email.optional(),
    check('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    check('website').optional().isURL().withMessage('Please provide a valid URL')
  ])
};

module.exports = {
  validate,
  userValidationRules,
  authValidation
};
