import { HttpMethod } from '../../common/resources';
import { IActionGenerator } from '../../common/interface';
import { URLS } from '../../common/urls';
import { CALL_API } from '../../middlewares/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';
export const SET_AUTH_DATA = 'SET_AUTH_DATA';

export const loginUser = (credentials: { email: string; password: string }): IActionGenerator => {
    return {
        [CALL_API]: {
            types: [
                LOGIN_REQUEST,
                LOGIN_SUCCESS,
                LOGIN_FAILURE,
            ],
            url: URLS.LOGIN_URL,
            method: HttpMethod.POST,
            data: credentials,
        },
        actionData: {
            errorMessage: 'Login Failed',
        },
    };
};

export const registerUser = (userData: { name: string; email: string; password: string }): IActionGenerator => {
    return {
        [CALL_API]: {
            types: [
                REGISTER_REQUEST,
                REGISTER_SUCCESS,
                REGISTER_FAILURE,
            ],
            url: URLS.REGISTER_URL,
            method: HttpMethod.POST,
            data: userData,
        },
        actionData: {
            errorMessage: 'Registration Failed',
        },
    };
};

export const logoutUser: any = () => {
    return { type: LOGOUT };
};

export const setAuthData: any = (authData: any) => {
    return { type: SET_AUTH_DATA, response: authData };
};
