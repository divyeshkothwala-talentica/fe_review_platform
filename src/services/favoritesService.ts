import { apiService } from './api';
import { ApiResponse } from '../types';

export interface FavoriteResponse {
  bookId: string;
  userId: string;
  createdAt: string;
}

export interface FavoriteBook {
  _id: string;
  title: string;
  author: string;
  coverImageUrl: string;
  description: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface FavoritesListResponse {
  favorites: FavoriteBook[];
  total: number;
}

export interface FavoriteCheckResponse {
  isFavorite: boolean;
}

class FavoritesService {
  // Add book to favorites
  async addToFavorites(bookId: string): Promise<ApiResponse<FavoriteResponse>> {
    try {
      return await apiService.post<FavoriteResponse>('/favorites', { bookId });
    } catch (error) {
      throw error;
    }
  }

  // Remove book from favorites
  async removeFromFavorites(bookId: string): Promise<ApiResponse<any>> {
    try {
      return await apiService.delete<any>(`/favorites/${bookId}`);
    } catch (error) {
      throw error;
    }
  }

  // Check if book is in favorites
  async checkFavoriteStatus(bookId: string): Promise<ApiResponse<FavoriteCheckResponse>> {
    try {
      return await apiService.get<FavoriteCheckResponse>(`/favorites/check/${bookId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get user's favorite books
  async getUserFavorites(skip: number = 0, limit: number = 20): Promise<ApiResponse<FavoritesListResponse>> {
    try {
      return await apiService.get<FavoritesListResponse>('/favorites', { skip, limit });
    } catch (error) {
      throw error;
    }
  }

  // Toggle favorite status (helper method)
  async toggleFavorite(bookId: string, currentStatus: boolean): Promise<ApiResponse<any>> {
    try {
      if (currentStatus) {
        return await this.removeFromFavorites(bookId);
      } else {
        return await this.addToFavorites(bookId);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const favoritesService = new FavoritesService();
export default favoritesService;
