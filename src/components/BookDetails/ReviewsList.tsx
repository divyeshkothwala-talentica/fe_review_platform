import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Review } from '../../types';
import StarRating from '../StarRating/StarRating';
import { deleteReviewAction } from '../../store/actions/deleteReviewActions';

interface ReviewsListProps {
  reviews: Review[];
  loading: boolean;
  currentUserId?: string;
  onReviewUpdated: () => void;
}

interface ReviewItemProps {
  review: Review;
  isCurrentUser: boolean;
  onDelete: (reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, isCurrentUser, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const reviewId = review._id || review.id;
      if (reviewId) {
        await onDelete(reviewId);
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user?.name || 'Anonymous User'}
            </p>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button for current user's reviews */}
        {isCurrentUser && (
          <div className="flex-shrink-0">
            {!showDeleteConfirm ? (
              <button
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                disabled={isDeleting}
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-1">
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Confirm'
                  )}
                </button>
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed ml-11">
        {review.text}
      </p>
    </div>
  );
};

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  loading,
  currentUserId,
  onReviewUpdated,
}) => {
  const dispatch = useDispatch();

  const handleDeleteReview = async (reviewId: string) => {
    try {
      dispatch(deleteReviewAction(reviewId) as any);
      // Refresh the reviews list after deletion
      setTimeout(() => {
        onReviewUpdated();
      }, 500);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
            <div className="ml-11">
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-gray-500 text-lg">No reviews yet.</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to review this book!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review._id || review.id}
          review={review}
          isCurrentUser={review.userId === currentUserId}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
