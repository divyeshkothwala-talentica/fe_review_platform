import { ApiResponse, Book } from '../types';
import apiService from './api';

export interface BookListParams {
  page?: number;
  limit?: number;
  search?: string;
  skip?: number;
}

export interface BookListResponse {
  books: Book[];
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

class BookService {
  /**
   * Get list of books with optional search and pagination
   */
  public async getBooks(params: BookListParams = {}): Promise<ApiResponse<BookListResponse>> {
    const { page = 1, limit = 12, search, skip } = params;
    
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) {
      queryParams.append('skip', skip.toString());
    } else {
      queryParams.append('page', page.toString());
    }
    
    queryParams.append('limit', limit.toString());
    
    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }

    const url = `/books?${queryParams.toString()}`;
    return apiService.get<BookListResponse>(url);
  }

  /**
   * Get a single book by ID
   */
  public async getBookById(bookId: string): Promise<ApiResponse<Book>> {
    return apiService.get<Book>(`/books/${bookId}`);
  }

  /**
   * Get book genres
   */
  public async getGenres(): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>('/books/genres');
  }

  /**
   * Search books by title or author
   */
  public async searchBooks(searchTerm: string, params: Omit<BookListParams, 'search'> = {}): Promise<ApiResponse<BookListResponse>> {
    return this.getBooks({ ...params, search: searchTerm });
  }
}

const bookService = new BookService();
export default bookService;
