import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser, registerUser } from '../../store/actions/authActions';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose, onToggleMode }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Clear errors and form when mode changes
  useEffect(() => {
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  }, [mode]);

  useEffect(() => {
    if (authState.data.isAuthenticated) {
      onClose();
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
    }
  }, [authState.data.isAuthenticated, onClose]);

  // Handle modal close - allow explicit close but prevent accidental backdrop close with errors
  const handleModalClose = () => {
    // Only close if there's no authentication error or if user is authenticated
    if (!authState.error || authState.data.isAuthenticated) {
      onClose();
    }
    // If there's an error, we could add a subtle shake animation or highlight
    // For now, we just prevent closing to keep the error visible
  };

  // Handle explicit close button click - always allow closing
  const handleExplicitClose = () => {
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
    onClose();
  };

  useEffect(() => {
    if (authState.error && authState.errorDetails) {
      // Extract more specific error message from server response
      let errorMessage = authState.errorDetails.errorMessage || 'An error occurred';
      
      // Handle specific error cases
      if (authState.errorDetails.message) {
        errorMessage = authState.errorDetails.message;
      } else if (authState.errorDetails.error) {
        errorMessage = authState.errorDetails.error;
      }
      
      // Handle common authentication errors with user-friendly messages
      if (authState.errorDetails.errorStatusCode === 401 || 
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('invalid credentials') || 
          errorMessage.toLowerCase().includes('invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage.toLowerCase().includes('user already exists') || 
                 errorMessage.toLowerCase().includes('email already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (errorMessage.toLowerCase().includes('user not found')) {
        errorMessage = 'No account found with this email. Please check your email or sign up.';
      } else if (errorMessage.toLowerCase().includes('network') || 
                 errorMessage.toLowerCase().includes('connection')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (errorMessage.toLowerCase().includes('server') || 
                 authState.errorDetails.errorStatusCode >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setErrors({
        general: errorMessage,
      });
    } else {
      // Clear general error when no auth error
      setErrors(prev => ({
        ...prev,
        general: '',
      }));
    }
  }, [authState.error, authState.errorDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error and general error when user starts typing
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 7) {
      newErrors.password = 'Password must be at least 7 characters';
    }

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (mode === 'signin') {
      dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }) as any);
    } else {
      dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }) as any);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleExplicitClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleModalClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleExplicitClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-xl font-bold p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex border-b">
            <button
              onClick={() => mode !== 'signin' && onToggleMode()}
              className={`flex-1 py-3 px-3 sm:px-4 text-center font-medium text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
                mode === 'signin'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => mode !== 'signup' && onToggleMode()}
              className={`flex-1 py-3 px-3 sm:px-4 text-center font-medium text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
                mode === 'signup'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {errors.general && (
            <div 
              className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm flex items-start gap-2"
              role="alert"
              aria-live="polite"
            >
              <svg 
                className="w-4 h-4 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="flex-1">{errors.general}</span>
              <div className="flex gap-2 ml-2 flex-shrink-0">
                {(errors.general.toLowerCase().includes('network') || 
                  errors.general.toLowerCase().includes('server')) && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrors(prev => ({ ...prev, general: '' }));
                      handleSubmit(new Event('submit') as any);
                    }}
                    className="text-red-600 hover:text-red-800 text-xs underline"
                  >
                    Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    onClose(); // Use onClose directly here to force close
                  }}
                  className="text-red-600 hover:text-red-800 text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base min-h-[44px] ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1" role="alert">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base min-h-[44px] ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1" role="alert">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base min-h-[44px] ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1" role="alert">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={authState.loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium min-h-[44px] flex items-center justify-center"
          >
            {authState.loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
