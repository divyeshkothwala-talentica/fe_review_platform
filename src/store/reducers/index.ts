import { combineReducers } from 'redux';

import authReducer from './authReducer';
import getBooksReducer from './getBooksReducer';
import searchBooksReducer from './searchBooksReducer';
import addFavoriteReducer from './addFavoriteReducer';
import removeFavoriteReducer from './removeFavoriteReducer';
import getFavoritesReducer from './getFavoritesReducer';
import checkFavoriteReducer from './checkFavoriteReducer';

export const reducerObject = {
    auth: authReducer,
    books: getBooksReducer,
    search: searchBooksReducer,
    addFavorite: addFavoriteReducer,
    removeFavorite: removeFavoriteReducer,
    favorites: getFavoritesReducer,
    favoriteStatus: checkFavoriteReducer,
};

const rootReducer = combineReducers(reducerObject);

export default rootReducer;
