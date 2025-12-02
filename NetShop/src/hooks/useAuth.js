/**
 * useAuth Hook
 * Manages authentication state and provides auth methods to components
 * Handles loading/error states and automatic redirects on auth errors
 */

import { useState, useCallback } from 'react';
import * as authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuthenticated = !!user;

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get current user profile
   */
  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      setError(null);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    authService.logout();
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Methods
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword,
    logout,
    clearError,
  };
};

export default useAuth;
