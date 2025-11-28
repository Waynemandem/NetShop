/**
 * JWT Utilities
 * ========================================
 * Token generation and verification
 * - Create JWT tokens for users
 * - Verify and decode tokens
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('./logger');

/**
 * Generate JWT token
 * @param {Object} payload - Token payload (user data)
 * @param {string} secret - Secret key (optional, uses default)
 * @param {string} expiresIn - Expiration time (optional, uses default)
 * @returns {string} - Signed JWT token
 */
function generateToken(payload, secret = env.JWT_SECRET, expiresIn = env.JWT_EXPIRE) {
  try {
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    logger.error('Error generating token:', error.message);
    throw error;
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key (optional, uses default)
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
function verifyToken(token, secret = env.JWT_SECRET) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired:', error.message);
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token:', error.message);
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token:', error.message);
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
