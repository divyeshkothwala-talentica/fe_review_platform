# Task 005: User Profile Settings Page

## Overview
Implement the user profile settings page where logged-in users can view and edit their account information, see their reviews, and manage their favorite books as shown in Screenshot-5.

## Deliverables

### 1. Profile Page Layout
- **Header Section**:
  - Profile icon
  - "Profile Settings" title
  - "View your reading activity and preferences" subtitle
  - User email display in top-right corner

### 2. Account Information Section
- **"Account Information" heading**
- **Email Field**:
  - "Email" label
  - Current email display
  - Editable input field
- **Name Field** (if applicable):
  - "Name" label  
  - Current name display
  - Editable input field
- **Update Profile Button**:
  - Save changes functionality
  - Loading state during update
  - Success/error feedback

### 3. Your Reviews Section
- **"⭐ Your Reviews" heading**
- **Review List Display**:
  - Book title for each review
  - Star rating display (5-star system)
  - Review text excerpt
  - Edit/Delete functionality for each review
- **Empty State**: Message when user has no reviews
- **Review Management**:
  - Edit review functionality (opens edit modal/form)
  - Delete review with confirmation
  - Real-time updates after changes

### 4. Favorite Books Section
- **"📖 Favorite Books" heading**
- **Favorites Grid Display**:
  - Book cover image
  - Book title
  - Author name
  - Remove from favorites functionality
- **Empty State**: Message when user has no favorites
- **Grid Layout**:
  - Responsive grid (adjust based on screen size)
  - Consistent spacing and alignment

## Technical Requirements
- Fetch user profile data on page load
- Implement form validation for profile updates
- Use actions and reducers for all API calls
- Handle loading states for all operations
- Implement optimistic updates where appropriate
- Follow 300-line file limit per component
- Use inline Tailwind CSS styling
- Ensure mobile responsiveness
- Implement WCAG 2.1 accessibility standards

## API Integration
- **GET /users/profile** - Get user profile with statistics
- **PUT /users/profile** - Update user profile information
- **GET /reviews/user/:userId** - Get user's reviews
- **GET /favorites** - Get user's favorite books
- **PUT /reviews/:reviewId** - Update review from profile
- **DELETE /reviews/:reviewId** - Delete review from profile
- **DELETE /favorites/:bookId** - Remove from favorites

## User Experience Flow
1. **Page Load**:
   - Fetch user profile information
   - Load user's reviews and favorites
   - Display loading states during data fetch

2. **Profile Update**:
   - User edits name/email fields
   - Form validation in real-time
   - Submit changes with loading state
   - Show success/error feedback

3. **Review Management**:
   - Display all user reviews with book information
   - Allow editing reviews (open modal or inline edit)
   - Allow deleting reviews with confirmation
   - Update display after changes

4. **Favorites Management**:
   - Display favorite books in grid layout
   - Allow removing books from favorites
   - Update display immediately (optimistic update)

## Error Handling
- Network failures: Show error messages with retry options
- Validation errors: Display field-specific error messages
- Unauthorized access: Redirect to login
- API timeouts: Show timeout messages with retry functionality

## Acceptance Criteria
- [ ] Profile page displays user's email and account information
- [ ] Users can edit and update their name and email
- [ ] All user reviews are displayed with book information
- [ ] Users can edit reviews from the profile page
- [ ] Users can delete reviews with confirmation dialog
- [ ] All favorite books are displayed in a responsive grid
- [ ] Users can remove books from favorites
- [ ] Empty states are shown when no reviews/favorites exist
- [ ] Loading states are displayed during all API operations
- [ ] Form validation works for profile updates
- [ ] Success/error messages are shown for all operations
- [ ] Page is fully responsive on mobile devices
- [ ] All functionality is keyboard accessible
- [ ] Screen readers can navigate the page properly

## Dependencies
- User service for profile operations
- Review service for review management
- Favorites service for favorites management
- Authentication state from Redux
- Form validation utilities
- Confirmation dialog component
- API endpoints: `/users/profile`, `/reviews/user/:userId`, `/favorites`