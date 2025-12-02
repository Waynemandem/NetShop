/**
 * API Base Configuration
 * This file contains the base API configuration and common helper functions
 * used across all services for communicating with the backend.
 */

// Get API base URL from environment variables
// Set this in your .env file: VITE_API_BASE_URL=http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper function to get authorization headers
 * Automatically retrieves JWT token from localStorage and adds it to headers
 * @returns {Object} Headers object with Authorization and Content-Type
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper function to get public headers (without auth)
 * @returns {Object} Headers object with Content-Type
 */
export const getPublicHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Generic API request handler
 * Handles all fetch requests to the backend with proper error handling
 * @param {string} endpoint - The API endpoint (e.g., '/products')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Parsed JSON response from backend
 * @throws {Error} If response is not ok or if network fails
 */
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      mode: 'cors', // Enable CORS support
      ...options,
    };

    const response = await fetch(url, config);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP Error: ${response.status}`;
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse and return response
    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw with proper context
    console.error('API Error:', {
      endpoint,
      message: error.message,
      statusCode: error.statusCode,
    });
    throw error;
  }
};

/**
 * GET request helper
 * @param {string} endpoint - The API endpoint
 * @param {boolean} requiresAuth - Whether to include authorization headers
 * @returns {Promise<Object>} Response data
 */
export const apiGet = (endpoint, requiresAuth = false) => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  return apiCall(endpoint, {
    method: 'GET',
    headers,
  });
};

/**
 * POST request helper
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - Data to send in request body
 * @param {boolean} requiresAuth - Whether to include authorization headers
 * @returns {Promise<Object>} Response data
 */
export const apiPost = (endpoint, data, requiresAuth = false) => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  return apiCall(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

/**
 * PUT request helper
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - Data to send in request body
 * @param {boolean} requiresAuth - Whether to include authorization headers
 * @returns {Promise<Object>} Response data
 */
export const apiPut = (endpoint, data, requiresAuth = true) => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  return apiCall(endpoint, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request helper
 * @param {string} endpoint - The API endpoint
 * @param {boolean} requiresAuth - Whether to include authorization headers
 * @returns {Promise<Object>} Response data
 */
export const apiDelete = (endpoint, requiresAuth = true) => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  return apiCall(endpoint, {
    method: 'DELETE',
    headers,
  });
};

export default {
  API_BASE_URL,
  getAuthHeaders,
  getPublicHeaders,
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
