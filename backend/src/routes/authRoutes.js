/**
 * Authentication Routes
 * ========================================
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken,
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/refresh', protect, refreshToken);

module.exports = router;
