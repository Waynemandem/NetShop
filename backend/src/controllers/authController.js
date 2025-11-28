/**
 * Authentication Controller
 * ========================================
 * Handle user registration, login, and token management
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, ApiError, handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Register new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleError(
        new ApiError(409, 'Email already registered'),
        res
      );
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
    });

    await user.save();
    logger.info(`✅ User registered: ${email}`);

    // Generate token
    const token = generateToken({ id: user._id });

    // Return user and token
    sendSuccess(res, 201, 'User registered successfully', {
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return handleError(
        new ApiError(400, 'Email and password are required'),
        res
      );
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return handleError(
        new ApiError(401, 'Invalid credentials'),
        res
      );
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return handleError(
        new ApiError(401, 'Invalid credentials'),
        res
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return handleError(
        new ApiError(403, 'Your account is inactive'),
        res
      );
    }

    logger.info(`✅ User logged in: ${email}`);

    // Generate token
    const token = generateToken({ id: user._id });

    // Return user and token
    sendSuccess(res, 200, 'Login successful', {
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 * Requires authentication
 */
async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, 200, 'User profile retrieved', user.toJSON());
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/auth/profile
 * Requires authentication
 */
async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phone,
        address,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    logger.info(`✅ User profile updated: ${user.email}`);
    sendSuccess(res, 200, 'Profile updated successfully', user.toJSON());
  } catch (error) {
    next(error);
  }
}

/**
 * Change password
 * PUT /api/auth/change-password
 * Requires authentication
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return handleError(
        new ApiError(401, 'Current password is incorrect'),
        res
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`✅ User password changed: ${user.email}`);
    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh authentication token
 * POST /api/auth/refresh
 */
async function refreshToken(req, res, next) {
  try {
    if (!req.user) {
      return handleError(
        new ApiError(401, 'User not authenticated'),
        res
      );
    }

    const newToken = generateToken({ id: req.user._id });
    sendSuccess(res, 200, 'Token refreshed', { token: newToken });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken,
};
