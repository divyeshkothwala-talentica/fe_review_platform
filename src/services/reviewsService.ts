import { ApiResponse, Review } from '../types';
import apiService from './api';

export interface CreateReviewRequest {
  bookId: string;
  rating: number;
  text: string;
}

export interface UpdateReviewRequest {
  rating: number;
  text: string;
}

export interface ReviewsListResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
  };
}

export interface UserReviewCheckResponse {
  hasReviewed: boolean;
  review?: Review;
}

class ReviewsService {
  /**
   * Get reviews for a specific book
   */
  async getBookReviews(bookId: string, skip: number = 0, limit: number = 10): Promise<ApiResponse<ReviewsListResponse>> {
    try {
      return await apiService.get<ReviewsListResponse>(`/reviews/book/${bookId}`, { skip, limit });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
    try {
      return await apiService.post<Review>('/reviews', reviewData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing review
   */
  async updateReview(reviewId: string, reviewData: UpdateReviewRequest): Promise<ApiResponse<Review>> {
    try {
      return await apiService.put<Review>(`/reviews/${reviewId}`, reviewData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<ApiResponse<any>> {
    try {
      return await apiService.delete<any>(`/reviews/${reviewId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user has reviewed a book
   */
  async checkUserReview(bookId: string): Promise<ApiResponse<UserReviewCheckResponse>> {
    try {
      return await apiService.get<UserReviewCheckResponse>(`/reviews/check/${bookId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(skip: number = 0, limit: number = 10): Promise<ApiResponse<ReviewsListResponse>> {
    try {
      return await apiService.get<ReviewsListResponse>('/reviews/user', { skip, limit });
    } catch (error) {
      throw error;
    }
  }
}

const reviewsService = new ReviewsService();
export default reviewsService;
