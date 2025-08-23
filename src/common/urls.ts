export const URLS = {
  // Auth URLs
  LOGIN_URL: '/auth/login',
  REGISTER_URL: '/auth/register',
  
  // Books URLs
  BOOKS_URL: '/books',
  BOOK_DETAILS_URL: '/books/{id}',
  BOOK_GENRES_URL: '/books/genres',
  
  // Reviews URLs
  REVIEWS_URL: '/reviews',
  BOOK_REVIEWS_URL: '/reviews/book/{bookId}',
  USER_REVIEWS_URL: '/reviews/user/{userId}',
  
  // Favorites URLs
  FAVORITES_URL: '/favorites',
  FAVORITE_CHECK_URL: '/favorites/check/{bookId}',
  FAVORITE_REMOVE_URL: '/favorites/{bookId}',
  
  // User URLs
  USER_PROFILE_URL: '/users/profile',
  
  // Recommendations URLs
  RECOMMENDATIONS_URL: '/recommendations',
};
