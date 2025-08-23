import { combineReducers } from 'redux';

import authReducer from './authReducer';
import getBooksReducer from './getBooksReducer';
import searchBooksReducer from './searchBooksReducer';

export const reducerObject = {
    auth: authReducer,
    books: getBooksReducer,
    search: searchBooksReducer,
};

const rootReducer = combineReducers(reducerObject);

export default rootReducer;
