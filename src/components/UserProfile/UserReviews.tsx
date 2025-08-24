import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getUserReviewsAction } from '../../store/actions/getUserReviewsActions';
import ReviewItem from './ReviewItem';

interface UserReviewsProps {
  userId: string;
  onBookClick?: (bookId: string) => void;
}

const UserReviews: React.FC<UserReviewsProps> = ({ userId, onBookClick }) => {
  const dispatch = useAppDispatch();
  const userReviewsState = useAppSelector((state) => state.userReviews);

  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  const reviews = userReviewsState.data?.reviews || [];
  const totalReviews = userReviewsState.meta?.pagination?.totalReviews || userReviewsState.data?.pagination?.totalReviews || userReviewsState.data?.total || 0;
  const loading = userReviewsState.loading;





  // Load user reviews on component mount
  useEffect(() => {
    if (userId) {
      dispatch(getUserReviewsAction(userId, skip, limit) as any);
    }
  }, [dispatch, userId, skip, limit]);



  const handleLoadMore = useCallback(() => {
    const newSkip = skip + limit;
    setSkip(newSkip);
  }, [skip, limit]);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⭐</span>
          Your Reviews ({totalReviews})
        </h2>
      </div>

      <div>
        {loading && reviews.length === 0 ? (
          // Loading skeleton
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse border-b border-gray-200 pb-6">
                <div className="flex space-x-4">
                  <div className="w-16 h-20 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4 w-full"></div>
                    <div className="h-8 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500">
              Start reading and reviewing books to see your reviews here.
            </p>
          </div>
        ) : (
          // Reviews list
          <div>
            {reviews.map((review: any) => (
              <ReviewItem
                key={review.id || review._id}
                review={review}
                userId={userId}
                skip={skip}
                limit={limit}
                onBookClick={onBookClick}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && reviews.length > 0 && reviews.length < totalReviews && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
