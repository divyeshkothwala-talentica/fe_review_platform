import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getBooksAction } from '../../store/actions/getBooksActions';
import { searchBooksAction, clearSearchResults } from '../../store/actions/searchBooksActions';
import { addFavoriteAction } from '../../store/actions/addFavoriteActions';
import { removeFavoriteAction } from '../../store/actions/removeFavoriteActions';
import { checkFavoriteAction, updateFavoriteStatus } from '../../store/actions/checkFavoriteActions';

import SearchBar from './SearchBar';
import BookGrid from './BookGrid';
import Pagination from './Pagination';

const BookListing: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const booksState = useAppSelector((state) => state.books);
  const searchState = useAppSelector((state) => state.search);
  const favoriteStatusState = useAppSelector((state) => state.favoriteStatus);

  // Component state for pagination and search
  const [, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favoriteErrors, setFavoriteErrors] = useState<{[key: string]: string}>({});
  
  // Track which books we've already checked to prevent duplicate API calls
  const checkedBooksRef = useRef<Set<string>>(new Set());

  const isAuthenticated = authState.data.isAuthenticated;
  const itemsPerPage = 12;

  // Determine which data to display (search results or regular books)
  const displayData = isSearching && searchState.data.hasSearched 
    ? searchState.data 
    : booksState.data;

  const books = isSearching && searchState.data.hasSearched 
    ? searchState.data.searchResults 
    : booksState.data.books;

  const pagination = displayData.pagination;
  const loading = isSearching ? searchState.loading : booksState.loading;
  const error = isSearching ? searchState.error : booksState.error;

  // Load initial books on component mount
  useEffect(() => {
    if (!isSearching && booksState.data.books.length === 0) {
      dispatch(getBooksAction({ page: 1, limit: itemsPerPage }) as any);
    }
  }, [dispatch, isSearching, booksState.data.books.length]);

  // Check favorite status for loaded books (only for authenticated users)
  useEffect(() => {
    // Only check favorites if user is properly authenticated with a valid token
    if (isAuthenticated && authState.data.token && authState.data.user && books.length > 0) {
      books.forEach((book: any) => {
        // Only check if we haven't already made a request for this book
        if (!checkedBooksRef.current.has(book._id)) {
          // Mark as checked to prevent duplicate requests
          checkedBooksRef.current.add(book._id);
          dispatch(checkFavoriteAction(book._id) as any);
        }
      });
    }
  }, [isAuthenticated, authState.data.token, authState.data.user, books, dispatch]);

  // Clear checked books when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      checkedBooksRef.current.clear();
    }
  }, [isAuthenticated]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    setCurrentPage(1);
    
    if (term.trim().length >= 3) {
      dispatch(searchBooksAction(term, { page: 1, limit: itemsPerPage }) as any);
    }
  }, [dispatch]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    dispatch(clearSearchResults());
    
    // Load regular books if not already loaded
    if (booksState.data.books.length === 0) {
      dispatch(getBooksAction({ page: 1, limit: itemsPerPage }) as any);
    }
  }, [dispatch, booksState.data.books.length]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    if (isSearching && searchTerm) {
      dispatch(searchBooksAction(searchTerm, { page, limit: itemsPerPage }) as any);
    } else {
      dispatch(getBooksAction({ page, limit: itemsPerPage }) as any);
    }
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, isSearching, searchTerm]);

  // Handle book click (for future book details modal)
  const handleBookClick = useCallback((bookId: string) => {
    // TODO: Implement book details modal
    console.log('Book clicked:', bookId);
  }, []);

  // Handle favorite toggle with optimistic updates
  const handleFavoriteToggle = useCallback((bookId: string) => {
    if (!isAuthenticated) return;

    const currentStatus = favoriteStatusState.favoriteStatuses?.[bookId] || false;
    const newStatus = !currentStatus;

    // Clear any previous errors for this book
    setFavoriteErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[bookId];
      return newErrors;
    });

    // Optimistic update
    dispatch(updateFavoriteStatus(bookId, newStatus));

    // Make API call
    const action = newStatus ? addFavoriteAction(bookId) : removeFavoriteAction(bookId);
    dispatch(action as any)
      .then((result: any) => {
        // API call succeeded, the optimistic update was correct
        if (result.error) {
          // Revert optimistic update on error
          dispatch(updateFavoriteStatus(bookId, currentStatus));
          
          // Handle different error types
          const errorCode = result.error.errorStatusCode;
          let errorMessage = newStatus ? 'Failed to add to favorites' : 'Failed to remove from favorites';
          
          if (errorCode === 'MISSING_TOKEN' || errorCode === 'INVALID_TOKEN') {
            errorMessage = 'Please log in to manage favorites';
          } else if (errorCode === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please try again.';
          }
          
          setFavoriteErrors(prev => ({
            ...prev,
            [bookId]: errorMessage
          }));
        }
      })
      .catch((error: any) => {
        // Revert optimistic update on error
        dispatch(updateFavoriteStatus(bookId, currentStatus));
        
        let errorMessage = newStatus ? 'Failed to add to favorites' : 'Failed to remove from favorites';
        
        // Handle 401 specifically
        if (error.error?.code === 'MISSING_TOKEN' || error.error?.code === 'INVALID_TOKEN') {
          errorMessage = 'Please log in to manage favorites';
        }
        
        setFavoriteErrors(prev => ({
          ...prev,
          [bookId]: errorMessage
        }));
      });
  }, [isAuthenticated, favoriteStatusState.favoriteStatuses, dispatch]);

  // Show no results when search has been performed but no results found
  const showNoResults = isSearching && 
    searchState.data.hasSearched && 
    !loading && 
    books.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Great Books
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Read reviews, share your thoughts, and find your next favorite book
            </p>
            
            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              initialValue={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading books
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    There was a problem loading the books. Please try again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Search Results Info */}
        {isSearching && searchState.data.hasSearched && !loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              {books.length > 0 
                ? `Found ${pagination.totalItems} result${pagination.totalItems !== 1 ? 's' : ''} for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </p>
          </div>
        )}

        {/* Book Grid */}
        <BookGrid
          books={books}
          isAuthenticated={isAuthenticated}
          loading={loading}
          onBookClick={handleBookClick}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteBookIds={Object.keys(favoriteStatusState.favoriteStatuses || {}).filter(
            bookId => favoriteStatusState.favoriteStatuses?.[bookId]
          )}
          showNoResults={showNoResults}
          searchTerm={searchTerm}
        />

        {/* Pagination */}
        {!loading && books.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default BookListing;
