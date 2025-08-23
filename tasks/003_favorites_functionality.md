# Task 003: Favorites Management System

## Overview
Implement the favorites functionality allowing logged-in users to mark books as favorites from the book listing page and manage them in their profile.

## Deliverables

### 1. Favorite Heart Icon on Book Cards
- Heart icon displayed only for logged-in users
- Toggle functionality (filled/unfilled heart)
- Visual feedback on hover and click
- Optimistic updates for better UX
- Error handling with rollback on failure

### 2. Favorites API Integration
- **Add to Favorites**: POST /favorites with bookId
- **Remove from Favorites**: DELETE /favorites/:bookId
- **Check Favorite Status**: GET /favorites/check/:bookId
- **Get User Favorites**: GET /favorites (for profile page)

### 3. Favorites State Management
- Redux actions for add/remove/toggle favorites
- Optimistic updates in Redux state
- Error handling with state rollback
- Loading states for favorite operations

### 4. Favorites in Profile Page Integration
- Display user's favorite books in profile section
- Book information: title, author, cover image
- Remove from favorites functionality from profile
- Empty state when no favorites exist

## Technical Requirements
- Use actions and reducers for API calls (following workspace rules)
- Implement optimistic updates for immediate UI feedback
- Handle network errors gracefully with rollback
- Follow 300-line file limit per component
- Use inline Tailwind CSS styling
- Ensure accessibility compliance (WCAG 2.1)
- Implement proper loading states

## User Experience Flow
1. **Adding Favorites**:
   - User clicks empty heart icon on book card
   - Heart immediately fills (optimistic update)
   - API call made in background
   - If API fails, heart reverts to empty with error message

2. **Removing Favorites**:
   - User clicks filled heart icon
   - Heart immediately empties (optimistic update)
   - API call made in background
   - If API fails, heart reverts to filled with error message

3. **Profile Page Display**:
   - Show all favorited books
   - Allow removal from favorites
   - Update book listing page state when favorites change

## Error Handling
- Network failure: Show error message, revert optimistic update
- API timeout: Show timeout message, revert state
- Unauthorized: Redirect to login
- Book not found: Show appropriate error message

## Acceptance Criteria
- [ ] Heart icon appears only for logged-in users on book cards
- [ ] Heart icon toggles between filled/unfilled states
- [ ] Optimistic updates work immediately on click
- [ ] API calls are made to add/remove favorites
- [ ] Error states revert optimistic updates with error messages
- [ ] Favorites are displayed in user profile page
- [ ] Users can remove favorites from profile page
- [ ] Loading states are shown during API operations
- [ ] Keyboard navigation works for heart icon
- [ ] Screen readers can access favorite functionality
- [ ] No limit on number of favorites per user

## Dependencies
- Authentication state from Redux
- Favorites service for API calls
- Redux store for favorites state management
- Error handling utilities
- API endpoints: `/favorites`, `/favorites/:bookId`, `/favorites/check/:bookId`