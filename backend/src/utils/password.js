/**
 * Password Hashing Utilities
 * ========================================
 * Secure password hashing using bcrypt
 * - Hash password for storage
 * - Compare plain password with hash
 */

const bcrypt = require('bcryptjs');
const logger = require('./logger');

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    logger.error('Error hashing password:', error.message);
    throw error;
  }
}

/**
 * Compare plain text password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
async function comparePassword(password, hash) {
  try {
    if (!password || !hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error comparing password:', error.message);
    throw error;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
