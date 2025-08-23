import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setAuthData } from './store/actions/authActions';
import Header from './components/Header/Header';
import AuthModal from './components/Auth/AuthModal';
import BookListing from './components/BookList/BookListing';
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
      
      <main>
        <BookListing />
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
