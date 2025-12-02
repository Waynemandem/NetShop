/**
 * Complete Example: LoginComponent.jsx
 * 
 * This component demonstrates how to:
 * - Handle user login
 * - Store authentication token
 * - Display error messages
 * - Redirect to dashboard on success
 * - Manage loading state
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginComponent = () => {
  const { login, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Call login service
      const response = await login(email, password);
      
      // Show success message and redirect
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      // Error is already stored in hook state
      // It will be displayed by the error message section
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login to NetShop</h1>

        {/* Error Message Display */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={clearError} className="close-btn">×</button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-btn"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="signup-link">
          Don't have an account?{' '}
          <a href="/register">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;

/**
 * Example CSS Styles for Login Page
 * 
 * .login-container {
 *   display: flex;
 *   justify-content: center;
 *   align-items: center;
 *   min-height: 100vh;
 *   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 * }
 * 
 * .login-box {
 *   background: white;
 *   padding: 40px;
 *   border-radius: 8px;
 *   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
 *   width: 100%;
 *   max-width: 400px;
 * }
 * 
 * .login-box h1 {
 *   text-align: center;
 *   margin-bottom: 30px;
 *   color: #333;
 * }
 * 
 * .error-box {
 *   background: #f8d7da;
 *   color: #721c24;
 *   padding: 12px;
 *   border-radius: 4px;
 *   margin-bottom: 20px;
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 * }
 * 
 * .form-group {
 *   margin-bottom: 20px;
 * }
 * 
 * .form-group label {
 *   display: block;
 *   margin-bottom: 8px;
 *   font-weight: 500;
 *   color: #333;
 * }
 * 
 * .form-group input {
 *   width: 100%;
 *   padding: 12px;
 *   border: 1px solid #ddd;
 *   border-radius: 4px;
 *   font-size: 14px;
 * }
 * 
 * .form-group input:focus {
 *   outline: none;
 *   border-color: #667eea;
 *   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
 * }
 * 
 * .password-input-group {
 *   position: relative;
 * }
 * 
 * .show-password-btn {
 *   position: absolute;
 *   right: 10px;
 *   top: 50%;
 *   transform: translateY(-50%);
 *   background: none;
 *   border: none;
 *   cursor: pointer;
 * }
 * 
 * .login-btn {
 *   width: 100%;
 *   padding: 12px;
 *   background: #667eea;
 *   color: white;
 *   border: none;
 *   border-radius: 4px;
 *   font-size: 16px;
 *   font-weight: 600;
 *   cursor: pointer;
 *   transition: background 0.3s;
 * }
 * 
 * .login-btn:hover:not(:disabled) {
 *   background: #5568d3;
 * }
 * 
 * .login-btn:disabled {
 *   opacity: 0.6;
 *   cursor: not-allowed;
 * }
 * 
 * .signup-link {
 *   text-align: center;
 *   margin-top: 20px;
 *   color: #666;
 * }
 * 
 * .signup-link a {
 *   color: #667eea;
 *   text-decoration: none;
 *   font-weight: 600;
 * }
 */
