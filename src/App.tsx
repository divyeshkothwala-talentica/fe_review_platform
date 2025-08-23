import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setAuthData } from './store/actions/authActions';
import Header from './components/Header/Header';
import AuthModal from './components/Auth/AuthModal';
import authService from './services/authService';

function App() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    // Check for existing authentication on app load
    const token = authService.getToken();
    const user = authService.getUser();
    
    if (token && user && authService.isAuthenticated()) {
      dispatch(setAuthData({ token, user }));
      authService.setupAutoLogout();
    }
  }, [dispatch]);

  const handleSignInClick = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleToggleMode = () => {
    setAuthModalMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BookNest
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, review, and get personalized book recommendations
          </p>
          
          {authState.data.isAuthenticated ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome back, {authState.data.user?.name}!
              </h2>
              <p className="text-gray-600">
                Start exploring books and sharing your reviews.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Join Our Community
              </h2>
              <p className="text-gray-600 mb-6">
                Sign up to write reviews, save favorites, and get personalized recommendations.
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleSignUpClick}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium"
                >
                  Get Started
                </button>
                <button
                  onClick={handleSignInClick}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authModalMode}
        onClose={handleCloseModal}
        onToggleMode={handleToggleMode}
      />
    </div>
  );
}

export default App;
