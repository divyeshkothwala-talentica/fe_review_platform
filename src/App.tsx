import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setAuthData } from './store/actions/authActions';
import Header from './components/Header/Header';
import AuthModal from './components/Auth/AuthModal';
import BookListing from './components/BookList/BookListing';
import UserProfile from './components/UserProfile/UserProfile';
import authService from './services/authService';

function App() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

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

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  const handleBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    // TODO: Implement book details modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
        onProfileClick={handleNavigateToProfile}
        onHomeClick={handleNavigateToHome}
        currentPage={currentPage}
      />
      
      <main>
        {currentPage === 'home' ? (
          <BookListing />
        ) : currentPage === 'profile' ? (
          <UserProfile onBookClick={handleBookClick} />
        ) : (
          <BookListing />
        )}
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
