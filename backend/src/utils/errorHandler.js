/**
 * Error Handler Utility
 * ========================================
 * Centralized error handling and response formatting
 */

const logger = require('./logger');

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Handle and format error response
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @returns {void}
 */
function handleError(error, res) {
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  // Custom API Error
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  }
  // Validation Error
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((e) => e.message);
  }
  // Cast Error (invalid MongoDB ObjectId)
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }
  // Duplicate Key Error
  else if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }
  // JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error
  logger.error(`Error [${statusCode}]:`, message);
  if (errors.length > 0) {
    logger.debug('Validation errors:', errors);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: errors.length > 0 ? errors : undefined,
  });
}

/**
 * Success response formatter
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @returns {void}
 */
function sendSuccess(res, statusCode, message, data = null) {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
}

module.exports = {
  ApiError,
  handleError,
  sendSuccess,
};
