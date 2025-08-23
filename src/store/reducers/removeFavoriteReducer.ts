import { getReducerType } from '../../common/types';
import { IReducerAction } from '../../common/interface';
import {
    REMOVE_FAVORITE_FAILURE,
    REMOVE_FAVORITE_REQUEST,
    REMOVE_FAVORITE_SUCCESS,
} from '../actions/removeFavoriteActions';

const removeFavoriteReducer: getReducerType = (
    state,
    action: IReducerAction,
) => {
    if (state === undefined) {
        state = {};
    }
    switch (action.type) {
        case REMOVE_FAVORITE_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                data: state.data || {},
            });

        case REMOVE_FAVORITE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: action.response.data,
            });
        case REMOVE_FAVORITE_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                error: true,
                errorDetails: {
                    errorMessage: action.error.errorMessage,
                    errorStatusCode: action.error.errorStatusCode,
                },
            });
    }
    return state;
};

export default removeFavoriteReducer;
