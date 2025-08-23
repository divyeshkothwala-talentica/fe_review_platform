import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    LOGOUT,
    SET_AUTH_DATA,
} from '../actions/authActions';

const authReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {
            loading: false,
            error: false,
            errorDetails: {},
            data: {
                user: null,
                token: null,
                isAuthenticated: false,
            },
        };
    }
    
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                error: false,
                errorDetails: {},
                data: state.data || {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                },
            });

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            // Store token and user in localStorage for API service
            localStorage.setItem('authToken', action.response.data.token);
            localStorage.setItem('user', JSON.stringify(action.response.data.user));
            
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    user: action.response.data.user,
                    token: action.response.data.token,
                    isAuthenticated: true,
                },
            });
            
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
                data: {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                },
            });
            
        case LOGOUT:
            // Clear localStorage on logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                },
            });
            
        case SET_AUTH_DATA:
            // Store token and user in localStorage for API service
            if (action.response.token) {
                localStorage.setItem('authToken', action.response.token);
            }
            if (action.response.user) {
                localStorage.setItem('user', JSON.stringify(action.response.user));
            }
            
            return Object.assign({}, state, {
                loading: false,
                error: false,
                errorDetails: {},
                data: {
                    user: action.response.user,
                    token: action.response.token,
                    isAuthenticated: true,
                },
            });
    }
    return state;
};

export default authReducer;
