// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  genres: string[];
  publishedYear: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  _id: string;
  id?: string; // Backend sometimes returns id instead of _id
  bookId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
}

// Favorite types
export interface Favorite {
  _id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  book?: Book;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage?: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    method: string;
    details?: any;
  };
  requestId?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Redux state types
export interface AuthState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  };
}

export interface BooksState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    books: Book[];
    genres: string[];
    currentBook: Book | null;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ReviewsState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    reviews: Review[];
    userReviews: Review[];
    bookReviews: Review[];
  };
}

export interface FavoritesState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    favorites: Favorite[];
  };
}

export interface UIState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    isAuthModalOpen: boolean;
    authModalMode: 'signin' | 'signup';
    isBookDetailsModalOpen: boolean;
    selectedBookId: string | null;
  };
}

// Component props types
export interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onToggleMode: () => void;
}

export interface BookCardProps {
  book: Book;
  onBookClick: (bookId: string) => void;
  onFavoriteToggle?: (bookId: string) => void;
  isFavorite?: boolean;
}

// Recommendation types
export interface Recommendation {
  title: string;
  author: string;
  genre?: string;
  reason: string;
  confidence: number;
  source: 'ai' | 'fallback';
  averageRating?: number;
  reviewCount?: number;
}

export interface RecommendationsState {
  loading: boolean;
  error: boolean;
  errorDetails: any;
  data: {
    recommendations: Recommendation[];
    source: 'ai' | 'fallback' | null;
  };
}

export interface HeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onLogout: () => void;
}
