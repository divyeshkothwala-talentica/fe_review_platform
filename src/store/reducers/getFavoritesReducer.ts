import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_FAVORITES_FAILURE,
    GET_FAVORITES_REQUEST,
    GET_FAVORITES_SUCCESS,
    APPEND_FAVORITES_SUCCESS,
    UPDATE_FAVORITES_TASK,
} from '../actions/getFavoritesActions';

const getFavoritesReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case GET_FAVORITES_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case GET_FAVORITES_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data, // Changed from action.response.data.data
                meta: action.response.meta, // Store meta information including pagination
            });
        case APPEND_FAVORITES_SUCCESS:
            const existingFavorites = state.data?.favorites || [];
            const newFavorites = action.response.data.favorites || [];
            return Object.assign({}, state, {
                loading: false,
                data: {
                    ...action.response.data,
                    favorites: [...existingFavorites, ...newFavorites],
                },
                meta: action.response.meta, // Store meta information including pagination
            });
        case GET_FAVORITES_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
            });
        case UPDATE_FAVORITES_TASK:
            const updatedData = { ...state.data };
            return Object.assign({}, state, {
                loading: false,
                data: { ...updatedData, ...action.response },
            });
    }
    return state;
};

export default getFavoritesReducer;
