import React from 'react';
import { Book } from '../../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  isAuthenticated: boolean;
  loading?: boolean;
  onBookClick?: (bookId: string) => void;
  onFavoriteToggle?: (bookId: string) => void;
  favoriteBookIds?: string[];
  showNoResults?: boolean;
  searchTerm?: string;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  isAuthenticated,
  loading = false,
  onBookClick,
  onFavoriteToggle,
  favoriteBookIds = [],
  showNoResults = false,
  searchTerm = '',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 sm:h-64 bg-gray-300"></div>
            <div className="p-3 sm:p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-4 w-1/2"></div>
              {isAuthenticated && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-10 sm:h-8 bg-gray-300 rounded"></div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (showNoResults) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            {searchTerm 
              ? `No books found matching "${searchTerm}". Try adjusting your search terms.`
              : 'No books available at the moment.'
            }
          </p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No books available
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            Check back later for new book additions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          isAuthenticated={isAuthenticated}
          onBookClick={onBookClick}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={favoriteBookIds.includes(book._id)}
        />
      ))}
    </div>
  );
};

export default BookGrid;
