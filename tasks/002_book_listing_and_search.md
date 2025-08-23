# Task 002: Book Listing and Search Functionality

## Overview
Implement the main book listing page with search functionality, pagination, and responsive design as shown in Screenshots 2 and 3.

## Deliverables

### 1. Book Listing Page Layout
- **Header Section**
  - "Discover Great Books" title
  - "Read reviews, share your thoughts, and find your next favorite book" subtitle
  - Search bar with search icon and "Search books, authors, or genres..." placeholder

### 2. Search Functionality
- Real-time search after typing 3 characters
- Search by book title or author
- "No results found" popup when no matches
- Clear search functionality
- Search state management in component (not Redux)

### 3. Book Grid Component
- **Desktop**: 4 columns x 3 rows = 12 books per page
- **Mobile**: 1 column layout
- Book card components with:
  - Book cover image with lazy loading
  - Book title
  - Author name ("by [Author Name]")
  - Description (3 lines with ellipsis)
  - Star ratings (for logged-in users only)
  - Review count (for logged-in users only)
  - Heart icon for favorites (for logged-in users only)
  - "View Details" button

### 4. Pagination Component
- Traditional pagination buttons (not infinite scroll)
- Previous/Next navigation
- Page numbers (1, 2, 3, 4, 5, ... Next)
- Maintain user position when navigating back from book details
- 12 books per page limit

### 5. Guest vs Logged-in User Experience
- **Guest Users**: See book title, author, description, and "View Details" button only
- **Logged-in Users**: Additionally see ratings, review count, and favorite heart icon

## Technical Requirements
- Use skip/limit for pagination (not page/pageSize)
- Maintain pagination state in component (not Redux)
- Implement lazy loading for book cover images
- Handle loading states with centralized loader
- Follow 300-line file limit rule
- Use inline Tailwind CSS only
- Ensure mobile responsiveness (1 book per row on mobile)
- Implement WCAG 2.1 accessibility standards

## API Integration
- **GET /books** endpoint with query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (fixed at 12)
  - `search`: Search term for title/author
- Handle API errors with proper error messages
- Implement loading states during API calls

## Acceptance Criteria
- [ ] Books are displayed in a 4x3 grid on desktop, 1 column on mobile
- [ ] Search works in real-time after 3 characters
- [ ] Search filters by title and author
- [ ] "No results found" popup appears for empty search results
- [ ] Pagination shows correct page numbers and navigation
- [ ] 12 books are displayed per page
- [ ] Book cards show appropriate information based on user authentication
- [ ] Lazy loading works for book cover images
- [ ] Page position is maintained when returning from book details
- [ ] All interactions are keyboard accessible
- [ ] Loading states are properly displayed
- [ ] Error handling works for API failures

## Dependencies
- Book service for API calls
- Authentication state from Redux
- Lazy loading library or custom implementation
- Pagination utility functions
- API endpoint: `/books`