import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    GET_FAVORITES_FAILURE,
    GET_FAVORITES_REQUEST,
    GET_FAVORITES_SUCCESS,
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
                data: action.response.data.data,
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
