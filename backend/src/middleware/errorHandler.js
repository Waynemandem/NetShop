/**
 * Error Handling Middleware
 * ========================================
 * Catches errors and sends formatted response
 */

const { handleError } = require('../utils/errorHandler');

/**
 * Global error handler middleware
 * Should be last middleware
 * @param {Error} error - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
function errorHandler(error, req, res, next) {
  handleError(error, res);
}

module.exports = errorHandler;
