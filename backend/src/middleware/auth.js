/**
 * Authentication Middleware
 * ========================================
 * Verify JWT token and attach user to request
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Protect route - require valid JWT token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
async function protect(req, res, next) {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return handleError(
        new ApiError(401, 'Not authorized to access this route'),
        res
      );
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return handleError(
        new ApiError(401, 'User not found'),
        res
      );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return handleError(new ApiError(401, 'Token expired'), res);
    }
    handleError(new ApiError(401, 'Not authorized to access this route'), res);
  }
}

/**
 * Authorize based on roles
 * @param {...string} roles - Allowed roles
 * @returns {Function}
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return handleError(
        new ApiError(401, 'Not authenticated'),
        res
      );
    }

    if (!roles.includes(req.user.role)) {
      return handleError(
        new ApiError(403, `User role '${req.user.role}' is not authorized`),
        res
      );
    }

    next();
  };
}

module.exports = {
  protect,
  authorize,
};
