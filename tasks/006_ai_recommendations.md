# Task 006: AI Recommendations System

## Overview
Implement the AI-powered book recommendations feature that logged-in users can access by clicking the AI icon in the search field, as shown in Screenshot-6.

## Deliverables

### 1. AI Recommendations Page Layout
- **Header Section**:
  - "⚡ AI Recommendations" title with AI icon
  - "Personalized book suggestions powered by AI" subtitle
  - "Back to Books" navigation link
  - User email display in top-right corner

### 2. Recommendations Display
- **Book Recommendation Cards**:
  - Book cover image
  - Book title
  - Author name ("by [Author Name]")
  - Star rating display
  - Genre tags
  - AI-generated recommendation reason/description
  - "Add to Favorites" heart icon
  - "View Details" button

### 3. AI Recommendation Features
- **Personalized Suggestions**:
  - Based on user's favorite books
  - Based on user's review history and ratings
  - Based on preferred genres from user activity
- **Recommendation Explanations**:
  - Display why each book was recommended
  - Examples: "Based on your love for philosophical fiction and introspective narratives"
  - Show confidence indicators if available from AI

### 4. Fallback Recommendations
- **When AI Fails**:
  - Show top-rated books from the platform
  - Show books similar to user's favorites
  - Show books from user's preferred genres
  - Display appropriate messaging about fallback recommendations

### 5. AI Icon Integration
- **Search Bar Enhancement**:
  - Add AI icon (⚡) to the search bar
  - Icon only visible for logged-in users
  - Click navigation to recommendations page
  - Hover tooltip: "Get AI Recommendations"

## Technical Requirements
- Fetch recommendations on page load
- Handle AI service failures gracefully
- Implement fallback recommendation logic
- Use actions and reducers for API calls
- Display loading states during recommendation fetch
- Follow 300-line file limit per component
- Use inline Tailwind CSS styling
- Ensure mobile responsiveness
- Implement WCAG 2.1 accessibility standards

## API Integration
- **GET /recommendations** - Get AI-powered recommendations
- **Fallback APIs**:
  - **GET /books?sort=rating** - Top-rated books
  - **GET /books?genres=[user_genres]** - Books by preferred genres
  - **GET /favorites** - User's favorites for similarity matching

## User Experience Flow
1. **Accessing Recommendations**:
   - User clicks AI icon in search bar
   - Navigate to recommendations page
   - Show loading state while fetching recommendations

2. **Displaying Recommendations**:
   - Show personalized book suggestions
   - Display recommendation reasons
   - Allow interaction with each recommended book
   - Provide fallback content if AI service fails

3. **Interacting with Recommendations**:
   - Users can add books to favorites
   - Users can view book details (opens modal)
   - Users can navigate back to main book listing

4. **Error Handling**:
   - AI service failure: Show fallback recommendations
   - Network error: Show error message with retry option
   - No recommendations available: Show appropriate message

## Fallback Logic Priority
1. **Primary**: AI-generated recommendations
2. **Fallback 1**: Top-rated books (if user has no activity)
3. **Fallback 2**: Books from user's favorite genres
4. **Fallback 3**: Books similar to user's favorites
5. **Last Resort**: Recently added popular books

## Recommendation Explanation Examples
- "Based on your love for philosophical fiction and introspective narratives"
- "Recommended because you enjoyed dystopian themes in 1984"
- "Perfect match for readers who love character-driven stories"
- "A thrilling book that offers a look at our changing world through the eyes of an unforgettable narrator"

## Acceptance Criteria
- [ ] AI icon appears in search bar for logged-in users only
- [ ] Clicking AI icon navigates to recommendations page
- [ ] Recommendations page displays personalized book suggestions
- [ ] Each recommendation shows book details and explanation
- [ ] Users can add recommended books to favorites
- [ ] Users can view book details from recommendations
- [ ] Fallback recommendations work when AI service fails
- [ ] Loading states are displayed during recommendation fetch
- [ ] Error handling works for AI service failures
- [ ] "Back to Books" navigation works correctly
- [ ] Page is fully responsive on mobile devices
- [ ] All functionality is keyboard accessible
- [ ] Screen readers can access recommendation content
- [ ] Recommendation explanations are clear and helpful

## Dependencies
- Recommendation service for AI API calls
- Book service for fallback recommendations
- Favorites service for user preferences
- Authentication state from Redux
- Navigation utilities
- Error handling utilities
- API endpoint: `/recommendations`