import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { getRecommendationsAction, clearRecommendations } from '../../store/actions/getRecommendationsActions';
import { Recommendation } from '../../types';
import StarRating from '../StarRating/StarRating';

const AIRecommendations: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, errorDetails, data } = useSelector((state: RootState) => state.recommendations);
  const { data: authData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Fetch recommendations on component mount
    if (authData.isAuthenticated) {
      dispatch(getRecommendationsAction() as any);
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearRecommendations());
    };
  }, [dispatch, authData.isAuthenticated]);

  const handleBackToBooks = () => {
    navigate('/');
  };

  const renderRecommendationCard = (recommendation: Recommendation, index: number) => {
    const { title, author, genre, reason, confidence, source, averageRating, reviewCount } = recommendation;

    return (
      <div key={`${title}-${author}-${index}`} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Book Cover Placeholder */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-20 h-28 sm:w-24 sm:h-32 lg:w-32 lg:h-40 bg-gray-200 rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-2">by {author}</p>

            {/* Rating */}
            {averageRating && (
              <div className="flex items-center justify-center sm:justify-start mb-3">
                <StarRating rating={averageRating} size="sm" />
                <span className="ml-2 text-xs sm:text-sm text-gray-600">
                  {reviewCount ? `(${reviewCount} reviews)` : ''}
                </span>
              </div>
            )}

            {/* Genre */}
            {genre && (
              <div className="flex flex-wrap gap-1 mb-3 justify-center sm:justify-start">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {genre}
                </span>
              </div>
            )}

            {/* AI Recommendation Reason */}
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-gray-700 italic line-clamp-3">"{reason}"</p>
              {confidence && (
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <span className="text-xs text-gray-500">Confidence: </span>
                  <div className="ml-1 w-12 sm:w-16 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Source Indicator */}
        {source === 'fallback' && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center sm:text-left">
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Popular Recommendation
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!authData.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Please sign in to access AI recommendations.</p>
          <button
            onClick={handleBackToBooks}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px] text-sm sm:text-base"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start">
                <span className="text-xl sm:text-2xl mr-2">⚡</span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Recommendations</h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Personalized book suggestions powered by AI</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-48">{authData.user?.email}</span>
              <button
                onClick={handleBackToBooks}
                className="px-4 py-3 text-blue-600 hover:text-blue-700 font-medium min-h-[44px] text-sm sm:text-base"
              >
                Back to Books
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {loading && (
          <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <span className="text-sm sm:text-base text-gray-600">Loading AI recommendations...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Failed to load recommendations
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {errorDetails.errorMessage || 'An error occurred while fetching recommendations.'}
                </p>
                <button
                  onClick={() => dispatch(getRecommendationsAction() as any)}
                  className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data.recommendations.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              We're working on generating personalized recommendations for you. Please try again later.
            </p>
          </div>
        )}

        {!loading && !error && data.recommendations.length > 0 && (
          <>
            {/* Source Message */}
            {data.source === 'fallback' && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-800">
                      Showing popular books while AI recommendations are unavailable.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Grid */}
            <div className="space-y-4 sm:space-y-6">
              {data.recommendations.map((recommendation: Recommendation, index: number) => renderRecommendationCard(recommendation, index))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
