# Task 001: Project Setup and Authentication System

## Overview
Set up the React application foundation and implement the authentication system including sign up and sign in functionality as shown in Screenshot-1.

## Deliverables

### 1. Project Setup
- Initialize React application with TypeScript
- Set up folder structure following workspace rules (components in separate folders)
- Configure Tailwind CSS for styling
- Set up Redux store with auth, books, reviews, favorites, and UI slices
- Configure API client with axios and interceptors
- Set up routing with React Router

### 2. Authentication Components
- **SignUp/SignIn Modal Component** (Screenshot-1)
  - Modal overlay with close button (X)
  - Toggle between "Sign In" and "Sign Up" tabs
  - Sign Up form: Name, Email, Password fields
  - Sign In form: Email, Password fields
  - "Create Account" button for sign up
  - Form validation (password minimum 7 characters)
  - Error handling and display

### 3. Authentication Logic
- JWT token management utilities
- Token storage in localStorage
- 24-hour session management
- Automatic logout on token expiration
- API integration for `/auth/register` and `/auth/login` endpoints
- Redux actions and reducers for auth state management

### 4. Header Component
- BookNest logo
- "Sign Up" and "Sign In" buttons (when not authenticated)
- User email display and profile access (when authenticated)
- Modal trigger functionality

## Technical Requirements
- Follow workspace rules: no files over 300 lines
- Use Pascal case for components, camel case for methods
- Implement proper error handling with try-catch
- Use inline Tailwind CSS classes only
- Ensure WCAG 2.1 accessibility compliance
- Implement keyboard navigation support

## Acceptance Criteria
- [ ] Users can open sign up/sign in modal from header buttons
- [ ] Users can register with name, email, and password (7+ characters)
- [ ] Users can sign in with email and password
- [ ] JWT token is stored and managed properly
- [ ] Users are automatically logged out after 24 hours
- [ ] Error messages are displayed for invalid credentials
- [ ] Modal can be closed with X button or ESC key
- [ ] All forms are accessible via keyboard navigation
- [ ] Authentication state is properly managed in Redux

## Dependencies
- React Router for navigation
- Redux for state management
- Axios for API calls
- Tailwind CSS for styling
- API endpoints: `/auth/register`, `/auth/login`