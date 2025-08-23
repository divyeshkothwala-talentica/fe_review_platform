import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Book } from '../../types';
import StarRating from '../StarRating/StarRating';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import { getBookReviewsAction } from '../../store/actions/getBookReviewsActions';
import { checkUserReviewAction } from '../../store/actions/checkUserReviewActions';
import { getBookAction } from '../../store/actions/getBookActions';

interface BookDetailsModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Redux state
  const auth = useSelector((state: any) => state.auth);
  const bookReviews = useSelector((state: any) => state.bookReviews);
  const userReviewStatus = useSelector((state: any) => state.userReviewStatus);
  const bookData = useSelector((state: any) => state.book);

  const isAuthenticated = auth?.data?.isAuthenticated || false;
  const currentUser = auth?.data?.user;

  useEffect(() => {
    if (isOpen && book) {
      // Load reviews when modal opens
      dispatch(getBookReviewsAction(book._id, 0, 10) as any);
      
      // Check if user has reviewed this book
      if (isAuthenticated) {
        dispatch(checkUserReviewAction(book._id) as any);
      }

      // Reset image states
      setImageLoaded(false);
      setImageError(false);

      // Focus management
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, book, dispatch, isAuthenticated]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews, user review status, and book data after submission
    dispatch(getBookReviewsAction(book._id, 0, 10) as any);
    dispatch(checkUserReviewAction(book._id) as any);
    dispatch(getBookAction(book._id) as any);
  };

  if (!isOpen || !book) {
    return null;
  }

  // Use updated book data from Redux if available, otherwise use prop
  const currentBook = bookData?.data?._id === book._id ? bookData.data : book;
  const reviews = bookReviews?.data?.reviews || [];
  const reviewsLoading = bookReviews?.loading || false;
  const userReview = userReviewStatus?.data?.review;
  const hasUserReviewed = userReviewStatus?.data?.hasReviewed || false;



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 truncate pr-4">
            {currentBook.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] sm:max-h-[calc(90vh-80px)] overflow-hidden">
          {/* Left side - Book cover */}
          <div className="lg:w-1/3 p-4 sm:p-6 flex justify-center items-start bg-gray-50 flex-shrink-0">
            <div className="w-full max-w-[200px] lg:max-w-xs">
              {!imageLoaded && !imageError && (
                <div className="aspect-[3/4] bg-gray-300 animate-pulse rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {imageError ? (
                <div className="aspect-[3/4] bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <img
                  src={currentBook.coverImageUrl}
                  alt={currentBook.title}
                  className={`w-full aspect-[3/4] object-cover rounded-lg shadow-md transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          {/* Right side - Book info and reviews */}
          <div className="lg:w-2/3 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {/* Book Information */}
              <div className="mb-4 sm:mb-6">
                <p className="text-base sm:text-lg text-gray-700 mb-2">
                  <span className="font-medium">Author:</span> {currentBook.author}
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-2">
                  <span className="font-medium">Published:</span> {currentBook.publishedYear}
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  {currentBook.description}
                </p>

                {/* Rating Display */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={currentBook.averageRating} readonly size="md" />
                    <span className="text-base sm:text-lg font-medium text-gray-900">
                      {currentBook.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">
                    ({currentBook.totalReviews} review{currentBook.totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {/* Review Form - Only for authenticated users */}
              {isAuthenticated && (
                <div className="mb-6 sm:mb-8">
                  <ReviewForm
                    bookId={book._id}
                    existingReview={userReview}
                    hasExistingReview={hasUserReviewed}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              {/* Reviews List */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Reviews ({currentBook.totalReviews})
                </h3>
                <ReviewsList
                  reviews={reviews}
                  loading={reviewsLoading}
                  currentUserId={currentUser?._id}
                  onReviewUpdated={handleReviewSubmitted}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
