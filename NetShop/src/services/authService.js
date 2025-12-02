/**
 * Authentication Service
 * Handles all user authentication-related API calls
 */

import { apiPost, apiGet } from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.phone - Phone number
 * @returns {Promise<Object>} Response with token and user data
 */
export const register = async (userData) => {
  const response = await apiPost('/auth/register', userData, false);
  
  // Store token and user data in localStorage
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with token and user data
 */
export const login = async (email, password) => {
  const response = await apiPost('/auth/login', { email, password }, false);
  
  // Store token and user data in localStorage
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await apiGet('/auth/me', true);
  return response;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @param {string} profileData.firstName - First name
 * @param {string} profileData.lastName - Last name
 * @param {string} profileData.phone - Phone number
 * @param {string} profileData.address - Address
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
  const response = await apiPut('/auth/profile', profileData, true);
  
  // Update user in localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response;
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiPut(
    '/auth/change-password',
    { currentPassword, newPassword },
    true
  );
  return response;
};

/**
 * Refresh JWT token
 * @returns {Promise<Object>} Response with new token
 */
export const refreshToken = async () => {
  const response = await apiPost('/auth/refresh', {}, true);
  
  // Update token in localStorage
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response;
};

/**
 * Logout user (client-side only)
 * Clears localStorage but does not call backend
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Get stored user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists in localStorage
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  getStoredUser,
  isAuthenticated,
};
