import { ApiResponse, Recommendation } from '../types';
import apiService from './api';

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  source: 'ai' | 'fallback';
  message?: string;
}

class RecommendationsService {
  /**
   * Get AI-powered recommendations for the authenticated user
   */
  public async getRecommendations(): Promise<ApiResponse<RecommendationsResponse>> {
    try {
      return await apiService.get<RecommendationsResponse>('/recommendations');
    } catch (error: any) {
      // If AI service fails, try to get fallback recommendations
      console.warn('AI recommendations failed, attempting fallback:', error);
      return this.getFallbackRecommendations();
    }
  }

  /**
   * Get fallback recommendations when AI service fails
   */
  private async getFallbackRecommendations(): Promise<ApiResponse<RecommendationsResponse>> {
    try {
      // Get top-rated books as fallback
      const response = await apiService.get<any>('/books', {
        sort: 'rating',
        limit: 10,
        page: 1
      });

      // Transform books into recommendation format
      const recommendations: Recommendation[] = response.data.books.map((book: any, index: number) => ({
        _id: `fallback_${book._id}_${Date.now()}`,
        book: book,
        reason: this.getFallbackReason(index),
        confidence: 0.7,
        source: 'fallback' as const,
        createdAt: new Date().toISOString()
      }));

      return {
        success: true,
        data: {
          recommendations,
          source: 'fallback',
          message: 'Showing popular books while AI recommendations are unavailable'
        }
      };
    } catch (fallbackError: any) {
      throw fallbackError;
    }
  }

  /**
   * Generate fallback recommendation reasons
   */
  private getFallbackReason(index: number): string {
    const reasons = [
      'Highly rated by our community of readers',
      'A popular choice among book enthusiasts',
      'Consistently praised for its engaging storytelling',
      'Recommended by fellow readers with similar tastes',
      'A well-reviewed book that readers love',
      'Popular among readers who enjoy quality literature',
      'Highly recommended by the reading community',
      'A favorite among discerning readers',
      'Praised for its compelling narrative and characters',
      'A standout book that has captured readers\' attention'
    ];
    
    return reasons[index % reasons.length];
  }
}

export const recommendationsService = new RecommendationsService();
export default recommendationsService;
