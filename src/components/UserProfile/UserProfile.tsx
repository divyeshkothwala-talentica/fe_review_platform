import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getFavoritesAction } from '../../store/actions/getFavoritesActions';
import { removeFavoriteAction } from '../../store/actions/removeFavoriteActions';
import { updateFavoriteStatus } from '../../store/actions/checkFavoriteActions';

interface UserProfileProps {
  onBookClick?: (bookId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBookClick }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const favoritesState = useAppSelector((state) => state.favorites);
  const removeFavoriteState = useAppSelector((state) => state.removeFavorite);

  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [favoriteErrors, setFavoriteErrors] = useState<{[key: string]: string}>({});

  const isAuthenticated = authState.data.isAuthenticated;
  const user = authState.data.user;
  const favorites = favoritesState.data?.favorites || [];
  const totalFavorites = favoritesState.data?.total || 0;
  const loading = favoritesState.loading;

  // Load user favorites on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getFavoritesAction(skip, limit) as any);
    }
  }, [dispatch, isAuthenticated, skip, limit]);

  // Handle remove from favorites
  const handleRemoveFavorite = useCallback((bookId: string) => {
    // Clear any previous errors for this book
    setFavoriteErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[bookId];
      return newErrors;
    });

    // Update favorite status in the global state
    dispatch(updateFavoriteStatus(bookId, false));

    // Make API call to remove from favorites
    dispatch(removeFavoriteAction(bookId) as any)
      .then((result: any) => {
        if (result.error) {
          // Revert the status update on error
          dispatch(updateFavoriteStatus(bookId, true));
          setFavoriteErrors(prev => ({
            ...prev,
            [bookId]: 'Failed to remove from favorites'
          }));
        } else {
          // Refresh favorites list on successful removal
          dispatch(getFavoritesAction(skip, limit) as any);
        }
      })
      .catch(() => {
        // Revert the status update on error
        dispatch(updateFavoriteStatus(bookId, true));
        setFavoriteErrors(prev => ({
          ...prev,
          [bookId]: 'Failed to remove from favorites'
        }));
      });
  }, [dispatch, skip, limit]);

  // Handle book click
  const handleBookClick = useCallback((bookId: string) => {
    if (onBookClick) {
      onBookClick(bookId);
    }
  }, [onBookClick]);

  // Handle load more favorites
  const handleLoadMore = useCallback(() => {
    const newSkip = skip + limit;
    setSkip(newSkip);
  }, [skip, limit]);

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
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.name || 'User Profile'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Favorite Errors */}
        {Object.keys(favoriteErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Favorites Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {Object.values(favoriteErrors).map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              My Favorite Books ({totalFavorites})
            </h2>
          </div>

          <div className="p-6">
            {loading && favorites.length === 0 ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-20 h-28 bg-gray-300 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded mb-4 w-1/2"></div>
                        <div className="h-8 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No favorite books yet
                </h3>
                <p className="text-gray-500">
                  Start exploring books and add them to your favorites to see them here.
                </p>
              </div>
            ) : (
              // Favorites grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((book: any) => (
                  <div key={book._id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded cursor-pointer"
                        onClick={() => handleBookClick(book._id)}
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 line-clamp-2"
                        onClick={() => handleBookClick(book._id)}
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {book.author}
                      </p>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {book.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {book.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({book.totalReviews})
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFavorite(book._id)}
                        disabled={removeFavoriteState.loading}
                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {removeFavoriteState.loading ? 'Removing...' : 'Remove'}
                      </button>

                      {/* Error message for this specific book */}
                      {favoriteErrors[book._id] && (
                        <p className="text-red-600 text-sm mt-1">
                          {favoriteErrors[book._id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!loading && favorites.length > 0 && favorites.length < totalFavorites && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Load More Favorites
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
