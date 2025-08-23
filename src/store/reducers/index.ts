import { combineReducers } from 'redux';

import authReducer from './authReducer';
import getBooksReducer from './getBooksReducer';
import getBookReducer from './getBookReducer';
import searchBooksReducer from './searchBooksReducer';
import addFavoriteReducer from './addFavoriteReducer';
import removeFavoriteReducer from './removeFavoriteReducer';
import getFavoritesReducer from './getFavoritesReducer';
import checkFavoriteReducer from './checkFavoriteReducer';
import getBookReviewsReducer from './getBookReviewsReducer';
import createReviewReducer from './createReviewReducer';
import updateReviewReducer from './updateReviewReducer';
import deleteReviewReducer from './deleteReviewReducer';
import checkUserReviewReducer from './checkUserReviewReducer';

export const reducerObject = {
    auth: authReducer,
    books: getBooksReducer,
    book: getBookReducer,
    search: searchBooksReducer,
    addFavorite: addFavoriteReducer,
    removeFavorite: removeFavoriteReducer,
    favorites: getFavoritesReducer,
    favoriteStatus: checkFavoriteReducer,
    bookReviews: getBookReviewsReducer,
    createReview: createReviewReducer,
    updateReview: updateReviewReducer,
    deleteReview: deleteReviewReducer,
    userReviewStatus: checkUserReviewReducer,
};

const rootReducer = combineReducers(reducerObject);

export default rootReducer;
