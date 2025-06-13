/**
 * Custom error class for handling application-specific errors
 * Extends the built-in Error class
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} status - Status type ('fail' or 'error')
   * @param {boolean} isOperational - Whether the error is operational (expected) or programming error
   */
  constructor(message, statusCode, status, isOperational = true) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = status || 'error';
    this.isOperational = isOperational;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 'bad request' error (400)
   */
  static badRequest(message = 'Invalid request data') {
    return new AppError(message, 400, 'fail');
  }

  /**
   * Create an 'unauthorized' error (401)
   */
  static unauthorized(message = 'You are not authorized to perform this action') {
    return new AppError(message, 401, 'fail');
  }

  /**
   * Create a 'forbidden' error (403)
   */
  static forbidden(message = 'You do not have permission to perform this action') {
    return new AppError(message, 403, 'fail');
  }

  /**
   * Create a 'not found' error (404)
   */
  static notFound(message = 'The requested resource was not found') {
    return new AppError(message, 404, 'fail');
  }

  /**
   * Create a 'conflict' error (409)
   */
  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409, 'fail');
  }

  /**
   * Create a 'validation' error (422)
   */
  static validationError(message = 'Validation failed') {
    return new AppError(message, 422, 'fail');
  }

  /**
   * Create an 'internal server' error (500)
   */
  static internalError(message = 'Internal server error') {
    return new AppError(message, 500, 'error');
  }

  /**
   * Create a 'service unavailable' error (503)
   */
  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new AppError(message, 503, 'error');
  }
}

module.exports = AppError;
