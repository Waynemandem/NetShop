/**
 * Logger Utility
 * ========================================
 * Centralized logging with timestamps and levels
 * Formats: console output and can be extended to file logging
 */

const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
  error: '❌',
  warn: '⚠️',
  info: '✅',
  debug: '🔧',
};

/**
 * Format timestamp for logs
 * @returns {string}
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Write log message
 * @param {string} level - Log level (error, warn, info, debug)
 * @param {string} message - Main message
 * @param {any} data - Additional data (optional)
 */
function log(level, message, data = '') {
  const timestamp = getTimestamp();
  const emoji = LOG_LEVELS[level] || '📝';
  const logMessage = `[${timestamp}] ${emoji} ${level.toUpperCase()}: ${message}`;

  switch (level) {
    case 'error':
      console.error(logMessage, data);
      break;
    case 'warn':
      console.warn(logMessage, data);
      break;
    case 'info':
      console.log(logMessage, data);
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.log(logMessage, data);
      }
      break;
    default:
      console.log(logMessage, data);
  }
}

module.exports = {
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  info: (msg, data) => log('info', msg, data),
  debug: (msg, data) => log('debug', msg, data),
};
