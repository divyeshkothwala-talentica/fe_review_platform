import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Review } from '../../types';
import StarRating from '../StarRating/StarRating';
import { createReviewAction } from '../../store/actions/createReviewActions';
import { updateReviewAction } from '../../store/actions/updateReviewActions';

interface ReviewFormProps {
  bookId: string;
  existingReview?: Review;
  hasExistingReview: boolean;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  existingReview,
  hasExistingReview,
  onReviewSubmitted,
}) => {
  const dispatch = useDispatch();
  
  // Form state
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    rating?: string;
    text?: string;
  }>({});

  // Redux state
  const createReview = useSelector((state: any) => state.createReview);
  const updateReview = useSelector((state: any) => state.updateReview);

  const MAX_CHARACTERS = 100;

  // Initialize form with existing review data
  useEffect(() => {
    if (hasExistingReview && existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.text);
    } else {
      setRating(0);
      setReviewText('');
    }
  }, [hasExistingReview, existingReview]);

  // Handle successful submission
  useEffect(() => {
    if (!createReview.loading && !createReview.error && createReview.data && isSubmitting) {
      // Review created successfully
      setRating(0);
      setReviewText('');
      setIsSubmitting(false);
      setValidationErrors({});
      onReviewSubmitted();
    }
  }, [createReview.loading, createReview.error, createReview.data, isSubmitting, onReviewSubmitted]);

  useEffect(() => {
    if (!updateReview.loading && !updateReview.error && updateReview.data && isSubmitting) {
      // Review updated successfully
      setIsSubmitting(false);
      setValidationErrors({});
      onReviewSubmitted();
    }
  }, [updateReview.loading, updateReview.error, updateReview.data, isSubmitting, onReviewSubmitted]);

  // Handle submission errors
  useEffect(() => {
    if ((createReview.error || updateReview.error) && isSubmitting) {
      setIsSubmitting(false);
      // Handle error display if needed
    }
  }, [createReview.error, updateReview.error, isSubmitting]);

  const validateForm = (): boolean => {
    const errors: { rating?: string; text?: string } = {};

    if (rating === 0) {
      errors.rating = 'Please select a rating';
    }

    if (reviewText.trim().length === 0) {
      errors.text = 'Please write a review';
    } else if (reviewText.length > MAX_CHARACTERS) {
      errors.text = `Review must be ${MAX_CHARACTERS} characters or less`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewId = existingReview?._id || existingReview?.id;
      if (hasExistingReview && existingReview && reviewId) {
        // Update existing review
        dispatch(updateReviewAction(reviewId, rating, reviewText.trim()) as any);
      } else {
        // Create new review
        dispatch(createReviewAction(bookId, rating, reviewText.trim()) as any);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting review:', error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (validationErrors.rating) {
      setValidationErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARACTERS) {
      setReviewText(newText);
      if (validationErrors.text) {
        setValidationErrors(prev => ({ ...prev, text: undefined }));
      }
    }
  };

  const remainingCharacters = MAX_CHARACTERS - reviewText.length;
  const isFormValid = rating > 0 && reviewText.trim().length > 0 && reviewText.length <= MAX_CHARACTERS;
  const submitButtonText = hasExistingReview ? 'Update Review' : 'Submit Review';

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        {hasExistingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <StarRating
              rating={rating}
              onRatingChange={handleRatingChange}
              size="lg"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                ({rating} star{rating !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          {validationErrors.rating && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.rating}</p>
          )}
        </div>

        {/* Review Text Section */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={handleTextChange}
            placeholder="Share your thoughts about this book..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              validationErrors.text ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={MAX_CHARACTERS}
          />
          <div className="flex justify-between items-center mt-1">
            {validationErrors.text ? (
              <p className="text-sm text-red-600">{validationErrors.text}</p>
            ) : (
              <div></div>
            )}
            <p className={`text-sm ${remainingCharacters < 10 ? 'text-red-600' : 'text-gray-500'}`}>
              {remainingCharacters} characters remaining
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isFormValid && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              submitButtonText
            )}
          </button>
        </div>

        {/* Error Messages */}
        {(createReview.error || updateReview.error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">
              {createReview.errorDetails?.errorMessage || 
               updateReview.errorDetails?.errorMessage || 
               'An error occurred while submitting your review. Please try again.'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
