import React, { useCallback } from 'react';
import { useAppSelector } from '../../hooks/redux';
import ProfileSettings from './ProfileSettings';
import UserReviews from './UserReviews';
import FavoriteBooks from './FavoriteBooks';

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const authState = useAppSelector((state) => state.auth);

  const isAuthenticated = authState.data.isAuthenticated;
  const user = authState.data.user;

  // Handle book click - placeholder for future modal implementation
  const handleBookClick = useCallback((bookId: string) => {
    // TODO: Implement book details modal
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">Profile Settings</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">View your reading activity and preferences</p>
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-500">Logged in as</p>
              <p className="text-sm sm:text-base text-gray-900 font-medium truncate max-w-48">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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
