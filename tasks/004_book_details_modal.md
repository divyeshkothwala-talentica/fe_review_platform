# Task 004: Book Details Modal and Review System

## Overview
Implement the book details modal that appears when users click "View Details" button, allowing logged-in users to view book information and write reviews as shown in Screenshot-4.

## Deliverables

### 1. Book Details Modal Component
- **Modal Layout**:
  - Overlay background with close functionality
  - Close button (X) in top-right corner
  - Book cover image on the left side
  - Book information and review section on the right side
  - Full-screen modal on mobile devices

### 2. Book Information Display
- Book title as modal header
- Author name ("Author: [Name]")
- Publication year ("Published: [Year]")
- Book description in full
- Average rating display (0.0 format, rounded to 1 decimal)
- Total review count

### 3. Write Review Section
- **"Write a Review" heading**
- **Rating Component**:
  - 5 interactive star rating system
  - Click to select rating (1-5 stars)
  - Visual feedback on hover and selection
- **Review Text Area**:
  - "Your Review" label
  - Text area with placeholder "Share your thoughts about this book..."
  - 100 character limit with counter
  - Character count display
- **Submit Review Button**
  - "Submit Review" button
  - Disabled state when form is invalid
  - Loading state during submission

### 4. Reviews Display Section
- **"Reviews (X)" heading** where X is the review count
- **Empty State**: "No reviews yet. Be the first to review this book!" when no reviews exist
- **Review List**:
  - User name for each review
  - Star rating display
  - Review text
  - Review date (not required based on clarifications)

### 5. Review Management
- Users can only review each book once
- Users can edit their existing reviews
- Users can delete their reviews
- Form validation for rating (required) and text (max 100 chars)

## Technical Requirements
- Modal closes on ESC key press and overlay click
- Form validation with real-time feedback
- API integration for review CRUD operations
- Optimistic updates for better UX
- Error handling with proper user feedback
- Mobile-responsive design (full-screen on mobile)
- Accessibility compliance (WCAG 2.1)
- Focus management for modal

## API Integration
- **GET /books/:bookId** - Get book details
- **GET /books/:bookId/reviews** - Get book reviews
- **POST /reviews** - Create new review
- **PUT /reviews/:reviewId** - Update existing review
- **DELETE /reviews/:reviewId** - Delete review
- **GET /reviews/check/:bookId** - Check if user has reviewed book

## User Experience Flow
1. **Opening Modal**:
   - User clicks "View Details" on book card
   - Modal opens with book information
   - Focus moves to modal content
   - Background is dimmed and non-interactive

2. **Writing Review**:
   - User selects star rating (required)
   - User types review text (max 100 characters)
   - Character counter updates in real-time
   - Submit button enables when form is valid

3. **Submitting Review**:
   - Form validates before submission
   - Loading state shown during API call
   - Success: Review appears in list, form resets
   - Error: Error message shown, form remains filled

4. **Editing Review**:
   - If user has existing review, form pre-fills with current data
   - Submit button changes to "Update Review"
   - Same validation and submission flow

## Acceptance Criteria
- [ ] Modal opens when "View Details" button is clicked
- [ ] Modal displays complete book information
- [ ] Star rating system works with click and hover states
- [ ] Review text area has 100 character limit with counter
- [ ] Form validation prevents invalid submissions
- [ ] Reviews are submitted and displayed correctly
- [ ] Users can edit/delete their existing reviews
- [ ] Modal closes with X button, ESC key, or overlay click
- [ ] Modal is full-screen on mobile devices
- [ ] Empty state shows when no reviews exist
- [ ] Loading states are displayed during API operations
- [ ] Error handling works for all API failures
- [ ] Focus management works properly for accessibility
- [ ] All interactions are keyboard accessible

## Dependencies
- Book service for API calls
- Review service for review operations
- Modal component utilities
- Form validation utilities
- Authentication state from Redux
- API endpoints: `/books/:bookId`, `/reviews`, `/books/:bookId/reviews`