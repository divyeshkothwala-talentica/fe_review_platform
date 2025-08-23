import { combineReducers } from 'redux';

import authReducer from './authReducer';

export const reducerObject = {
    auth: authReducer,
};

const rootReducer = combineReducers(reducerObject);

export default rootReducer;
