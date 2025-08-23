import React, { useCallback } from 'react';
import { useAppSelector } from '../../hooks/redux';
import ProfileSettings from './ProfileSettings';
import UserReviews from './UserReviews';
import FavoriteBooks from './FavoriteBooks';

interface UserProfileProps {
  onBookClick?: (bookId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBookClick }) => {
  const authState = useAppSelector((state) => state.auth);

  const isAuthenticated = authState.data.isAuthenticated;
  const user = authState.data.user;

  // Handle book click
  const handleBookClick = useCallback((bookId: string) => {
    if (onBookClick) {
      onBookClick(bookId);
    }
  }, [onBookClick]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access your profile and favorites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <svg className="w-8 h-8 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile Settings
                </h1>
                <p className="text-gray-600">View your reading activity and preferences</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Settings */}
        <ProfileSettings user={user} />

        {/* User Reviews */}
        <UserReviews userId={user?._id} onBookClick={handleBookClick} />

        {/* Favorite Books */}
        <FavoriteBooks onBookClick={handleBookClick} />
      </div>
    </div>
  );
};

export default UserProfile;
