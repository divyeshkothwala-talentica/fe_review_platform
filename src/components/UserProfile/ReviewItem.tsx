import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteReviewAction } from '../../store/actions/deleteReviewActions';
import { updateReviewAction } from '../../store/actions/updateReviewActions';
import { getUserReviewsAction } from '../../store/actions/getUserReviewsActions';
import StarRating from '../StarRating/StarRating';

interface ReviewItemProps {
  review: any;
  userId: string;
  skip: number;
  limit: number;
  onBookClick?: (bookId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  userId, 
  skip, 
  limit, 
  onBookClick 
}) => {
  const dispatch = useAppDispatch();
  const deleteReviewState = useAppSelector((state) => state.deleteReview);
  const updateReviewState = useAppSelector((state) => state.updateReview);

  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    comment: '',
  });
  const [reviewErrors, setReviewErrors] = useState<{[key: string]: string}>({});

  const handleDeleteReview = useCallback(async (review: any) => {
    const reviewId = review.id || review._id;
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const result = await dispatch(deleteReviewAction(reviewId) as any);
        if (!result.error) {
          // Refresh reviews list
          dispatch(getUserReviewsAction(userId, skip, limit) as any);
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  }, [dispatch, userId, skip, limit]);

  const handleEditReview = useCallback((review: any) => {
    setEditingReview(review.id || review._id);
    setEditFormData({
      rating: review.rating,
      comment: review.comment || review.text || '',
    });
    setReviewErrors({});
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingReview(null);
    setEditFormData({
      rating: 0,
      comment: '',
    });
    setReviewErrors({});
  }, []);

  const handleUpdateReview = useCallback(async (review: any) => {
    const reviewId = review.id || review._id;
    if (!editFormData.rating || editFormData.rating < 1 || editFormData.rating > 5) {
      setReviewErrors({ rating: 'Please select a rating between 1 and 5 stars' });
      return;
    }

    if (!editFormData.comment.trim()) {
      setReviewErrors({ comment: 'Please enter a review comment' });
      return;
    }

    try {
      const result = await dispatch(updateReviewAction(reviewId, editFormData.rating, editFormData.comment) as any);
      if (!result.error) {
        setEditingReview(null);
        setEditFormData({ rating: 0, comment: '' });
        setReviewErrors({});
        // Refresh reviews list
        dispatch(getUserReviewsAction(userId, skip, limit) as any);
      } else {
        setReviewErrors({ general: 'Failed to update review' });
      }
    } catch (error) {
      setReviewErrors({ general: 'Failed to update review' });
    }
  }, [dispatch, editFormData, userId, skip, limit]);

  const handleBookClick = useCallback((bookId: string) => {
    if (onBookClick) {
      onBookClick(bookId);
    }
  }, [onBookClick]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        {/* Review Content */}
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
            onClick={() => handleBookClick(review.book?._id)}
          >
            {review.book?.title}
          </h3>

          {editingReview === (review.id || review._id) ? (
            // Edit form
            <div className="space-y-3">
              {reviewErrors.general && (
                <p className="text-red-600 text-sm">{reviewErrors.general}</p>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <StarRating
                  rating={editFormData.rating}
                  onRatingChange={(rating) => {
                    setEditFormData(prev => ({ ...prev, rating }));
                    if (reviewErrors.rating) {
                      setReviewErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.rating;
                        return newErrors;
                      });
                    }
                  }}
                  size="sm"
                />
                {reviewErrors.rating && (
                  <p className="text-red-600 text-sm mt-1">{reviewErrors.rating}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  value={editFormData.comment}
                  onChange={(e) => {
                    setEditFormData(prev => ({ ...prev, comment: e.target.value }));
                    if (reviewErrors.comment) {
                      setReviewErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.comment;
                        return newErrors;
                      });
                    }
                  }}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    reviewErrors.comment ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Write your review..."
                />
                {reviewErrors.comment && (
                  <p className="text-red-600 text-sm mt-1">{reviewErrors.comment}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateReview(review)}
                  disabled={updateReviewState.loading}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updateReviewState.loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display review
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">{review.comment || review.text}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleEditReview(review)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review)}
                    disabled={deleteReviewState.loading}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deleteReviewState.loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Star Rating - Right Side */}
        {editingReview !== (review.id || review._id) && (
          <div className="flex items-center space-x-1 ml-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
