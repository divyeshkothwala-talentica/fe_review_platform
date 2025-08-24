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

  useEffect(() => {
    if (authState.data.isAuthenticated) {
      onClose();
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
    }
  }, [authState.data.isAuthenticated, onClose]);

  useEffect(() => {
    if (authState.error && authState.errorDetails) {
      setErrors({
        general: authState.errorDetails.errorMessage || 'An error occurred',
      });
    }
  }, [authState.error, authState.errorDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
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
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              {errors.general}
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
              {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
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
            {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
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
            {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
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
