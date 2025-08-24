import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getFavoritesAction } from '../../store/actions/getFavoritesActions';
import { removeFavoriteAction } from '../../store/actions/removeFavoriteActions';
import { updateFavoriteStatus } from '../../store/actions/checkFavoriteActions';

interface FavoriteBooksProps {
  onBookClick?: (bookId: string) => void;
}

const FavoriteBooks: React.FC<FavoriteBooksProps> = ({ onBookClick }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const favoritesState = useAppSelector((state) => state.favorites);
  const removeFavoriteState = useAppSelector((state) => state.removeFavorite);

  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [favoriteErrors, setFavoriteErrors] = useState<{[key: string]: string}>({});

  const isAuthenticated = authState.data.isAuthenticated;
  const favorites = favoritesState.data?.favorites || [];
  const totalFavorites = favoritesState.meta?.pagination?.totalItems || favoritesState.data?.pagination?.totalItems || favoritesState.data?.total || 0;
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

  return (
    <div className="mb-8">
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📖</span>
          Favorite Books ({totalFavorites})
        </h2>
      </div>

      <div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((favorite: any) => {
              const book = favorite.book || favorite; // Handle both nested and direct book data
              return (
              <div key={favorite._id || favorite.id || book._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Book Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                      onClick={() => handleBookClick(book._id || book.id)}
                    >
                      {book.title || 'Untitled Book'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {book.author || 'Unknown Author'}
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFavorite(book._id || book.id)}
                      disabled={removeFavoriteState.loading}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {removeFavoriteState.loading ? 'Removing...' : 'Remove'}
                    </button>

                    {/* Error message for this specific book */}
                    {favoriteErrors[book._id || book.id] && (
                      <p className="text-red-600 text-sm mt-2">
                        {favoriteErrors[book._id || book.id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
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
  );
};

export default FavoriteBooks;
