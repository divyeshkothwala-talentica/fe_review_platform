import React, { useState } from 'react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  isAuthenticated: boolean;
  onBookClick?: (bookId: string) => void;
  onFavoriteToggle?: (bookId: string) => void;
  isFavorite?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  isAuthenticated,
  onBookClick,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  // Debug what BookCard receives
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log(`BookCard for "${book.title}" (${book._id}): isFavorite = ${isFavorite}`);
    }
  }, [isFavorite, isAuthenticated, book.title, book._id]);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleViewDetails = () => {
    if (onBookClick) {
      onBookClick(book._id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(book._id);
    }
  };

  const truncateDescription = (text: string, maxLines: number = 3) => {
    const words = text.split(' ');
    const maxWords = maxLines * 15; // Approximate words per line
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">☆</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">☆</span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Book Cover */}
      <div className="relative h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="animate-pulse bg-gray-300 w-full h-full flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Favorite Heart Icon - Only for authenticated users */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
              fill={isFavorite ? 'currentColor' : 'none'}
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
          </button>
        )}
      </div>

      {/* Book Information */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          by {book.author}
        </p>
        
        <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-3">
          {truncateDescription(book.description)}
        </p>

        {/* Rating and Reviews - Only for authenticated users */}
        {isAuthenticated && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-1">
              {renderStars(book.averageRating)}
              <span className="text-xs sm:text-sm text-gray-600 ml-1">
                {book.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              ({book.totalReviews} review{book.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* View Details Button - Only for authenticated users */}
        {isAuthenticated && (
          <button
            onClick={handleViewDetails}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium min-h-[44px] flex items-center justify-center"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
