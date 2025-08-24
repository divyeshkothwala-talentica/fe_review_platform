import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/actions/authActions';

interface HeaderProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, onSignUpClick, currentPage }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);
  const { isAuthenticated, user } = authState.data;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              onClick={closeMobileMenu}
            >
              BookNest
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 'profile' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Desktop Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm text-gray-700 truncate max-w-32">
                    Welcome, {user?.name || user?.email}
                  </span>
                  <Link
                    to="/profile"
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="View Profile"
                  >
                    <svg className="w-5 h-5 text-gray-600 hover:text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onSignInClick}
                  className="text-gray-700 hover:text-primary-600 px-3 py-3 text-sm font-medium min-h-[44px]"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded="false"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center ${
                  currentPage === 'home'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center ${
                    currentPage === 'profile'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>
            
            {/* Mobile auth section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-2 space-y-1">
                  <div className="px-3 py-2">
                    <div className="text-base font-medium text-gray-800 truncate">
                      {user?.name || user?.email}
                    </div>
                    <div className="text-sm text-gray-500">Logged in</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <button
                    onClick={() => {
                      onSignInClick();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onSignUpClick();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
