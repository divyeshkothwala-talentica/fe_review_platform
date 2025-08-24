import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setAuthData } from './store/actions/authActions';
import Header from './components/Header/Header';
import AuthModal from './components/Auth/AuthModal';
import applicationRoutes from './applicationRoutes';
import authService from './services/authService';

// Inner component that uses useLocation
function AppContent() {
  const dispatch = useAppDispatch();
  const location = useLocation();
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

  // Close modal when authentication is successful
  useEffect(() => {
    if (authState.data.isAuthenticated && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [authState.data.isAuthenticated, isAuthModalOpen]);

  const handleSignInClick = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    // Don't close modal if there's an authentication error (unless user is authenticated)
    if (authState.error && !authState.data.isAuthenticated) {
      return;
    }
    setIsAuthModalOpen(false);
  };

  const handleToggleMode = () => {
    setAuthModalMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  const getCurrentPage = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/recommendations') return 'recommendations';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
        currentPage={getCurrentPage()}
      />
      
      <main>
        <Routes>
          {applicationRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
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

// Main App component with Router wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
